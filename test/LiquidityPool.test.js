const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Liquidity Pool Contract", function () {
  let owner,
    addr1,
    addr2,
    addrs,
    provider,
    spotoCoin,
    treasury,
    liquidityPool,
    lpToken,
    spotoRouter;

  beforeEach(async () => {
    provider = ethers.provider;
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    treasury = addrs[35];

    const SpotoCoin = await ethers.getContractFactory("SpotoCoin");
    spotoCoin = await SpotoCoin.deploy(treasury.address);

    const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    liquidityPool = await LiquidityPool.deploy();

    const LPT = await ethers.getContractFactory("LPT");
    lpToken = await LPT.deploy(liquidityPool.address);

    const SpotoRouter = await ethers.getContractFactory("SpotoRouter");
    spotoRouter = await SpotoRouter.deploy(
      liquidityPool.address,
      spotoCoin.address
    );
    await spotoCoin.setRouterAddress(spotoRouter.address);

    await spotoCoin.advancePhase();
    await spotoCoin.advancePhase();

    //Donate from 10 different address
    for (let i = 0; i < 10; i++) {
      await spotoCoin.connect(addrs[i]).contribute({ value: parseEther("10") });
      await spotoCoin.connect(addrs[i]).claimTokens();
    }

    await liquidityPool.setSpotoCoinAddress(spotoCoin.address);
    await liquidityPool.setLPTAddress(lpToken.address);

    await spotoCoin.sendLiquidityToLPContract(liquidityPool.address);
  });

  describe("Depositing", () => {
    it("Sends all contributed ETH and that amount multiplied by 5 of SPT to LP", async () => {
      const liquidityPoolSPTBalance = await spotoCoin.balanceOf(
        liquidityPool.address
      );
      const liquidityPoolETHBalance = await provider.getBalance(
        liquidityPool.address
      );

      expect(liquidityPoolSPTBalance).to.be.equal(parseEther("500"));
      expect(liquidityPoolETHBalance).to.be.equal(parseEther("100"));
    });

    it("Mints initial LP tokens and assigns to SpotoCoin contract", async () => {
      const lpOfSpotoCoin = await lpToken.balanceOf(spotoCoin.address);

      /*
       * SpotoCoin contract sent 100 eth and 500 tokens, so it should have
       * sqrt(100 * 500), around 223.60 LP tokens
       */
      expect(lpOfSpotoCoin).to.be.within(parseEther("223"), parseEther("224"));
    });

    it("Transfers ETH to LP", async () => {
      await expect(() =>
        spotoRouter
          .connect(addrs[0])
          .addLiquidity(parseEther("1"), { value: parseEther("0.2") })
      ).to.changeEtherBalances(
        [addrs[0], liquidityPool],
        [parseEther("-0.2"), parseEther("0.2")]
      );
    });

    it("Gives router contract SPT allowance and transfers them to LP", async () => {
      await expect(() =>
        spotoRouter
          .connect(addrs[0])
          .addLiquidity(parseEther("1"), { value: parseEther("0.2") })
      ).to.changeTokenBalances(
        spotoCoin,
        [addrs[0], liquidityPool],
        [parseEther("-1"), parseEther("0.98")]
      );
    });

    it("Mints and assigns LP tokens", async () => {
      await spotoRouter
        .connect(addrs[0])
        .addLiquidity(parseEther("1"), { value: parseEther("0.2") });

      const lpBalance = await lpToken.balanceOf(addrs[0].address);

      /*
       * Address sent 0.2 eth and 1 token, math is:
       *
       *  liquidity = Math.min(
       *    (ethAmount * totalSupply) / ethReserve,
       *    (sptAmount * totalSupply) / sptReserve
       *  );
       *
       *  Total LP supply right now is around 44,721.35 LP tokens, ETH reserve is 20k, and SPT reserve is 100k so
       *
       *  (0.2 * 44,721.35) / 20,000 = ~ 0.44 tokens
       *  (  1 * 44,721.35) / 20,000 = ~ 2.23 tokens
       *
       *  Math.min() gets the smaller value, so user should have 0.44 tokens
       *
       */
      expect(lpBalance).to.be.within(parseEther("0.44"), parseEther("0.45"));
    });
  });

  describe("Withdrawing", () => {
    it("Deposits and withdraws close to the same ether amount", async () => {
      await spotoRouter
        .connect(addrs[0])
        .addLiquidity(parseEther("25"), { value: parseEther("5") });

      const liquidityPoolETHBalanceBefore = await provider.getBalance(
        liquidityPool.address
      );
      const userBalanceBefore = await provider.getBalance(addrs[0].address);

      await spotoRouter.connect(addrs[0]).pullLiquidity();

      const liquidityPoolETHBalanceAfter = await provider.getBalance(
        liquidityPool.address
      );
      const userBalanceAfter = await provider.getBalance(addrs[0].address);

      expect(
        liquidityPoolETHBalanceBefore.sub(liquidityPoolETHBalanceAfter)
      ).to.be.closeTo(parseEther("5"), parseEther("3"));

      expect(userBalanceAfter.sub(userBalanceBefore)).to.be.closeTo(
        parseEther("5"),
        parseEther("3")
      );
    });

    it("Deposits and withdraws close to the same SPT amount", async () => {
      await spotoRouter
        .connect(addrs[0])
        .addLiquidity(parseEther("25"), { value: parseEther("5") });

      const liquidityPoolSPTBalanceBefore = await spotoCoin.balanceOf(
        liquidityPool.address
      );
      const userBalanceBefore = await spotoCoin.balanceOf(addrs[0].address);

      await spotoRouter.connect(addrs[0]).pullLiquidity();

      const liquidityPoolSPTBalanceAfter = await spotoCoin.balanceOf(
        liquidityPool.address
      );
      const userBalanceAfter = await spotoCoin.balanceOf(addrs[0].address);

      expect(
        liquidityPoolSPTBalanceBefore.sub(liquidityPoolSPTBalanceAfter)
      ).to.be.closeTo(parseEther("25"), parseEther("3"));

      expect(userBalanceAfter.sub(userBalanceBefore)).to.be.closeTo(
        parseEther("25"),
        parseEther("3")
      );
    });
  });

  describe("Swapping", () => {
    it("Swaps 5 ETH for close to 25 SPT", async () => {
      const balanceBeforeSwap = await spotoCoin.balanceOf(addrs[0].address);

      await expect(() =>
        spotoRouter.connect(addrs[0]).swapTokens(0, { value: parseEther("5") })
      ).to.changeEtherBalances(
        [liquidityPool, addrs[0]],
        [parseEther("5"), parseEther("-5")]
      );

      const balanceAfterSwap = await spotoCoin.balanceOf(addrs[0].address);

      expect(balanceAfterSwap.sub(balanceBeforeSwap)).to.be.closeTo(
        parseEther("25"),
        parseEther("2")
      );
    });

    it("Swaps 5 SPT for close to 1 ETH", async () => {
      const balanceBeforeSwap = await provider.getBalance(addrs[0].address);

      await expect(() =>
        spotoRouter.connect(addrs[0]).swapTokens(parseEther("5"))
      ).to.changeTokenBalances(
        spotoCoin,
        [liquidityPool, addrs[0]],
        [parseEther("4.9"), parseEther("-5")]
      );

      const balanceAfterSwap = await provider.getBalance(addrs[0].address);

      expect(balanceAfterSwap.sub(balanceBeforeSwap)).to.be.closeTo(
        parseEther("1"),
        parseEther("1")
      );
    });
  });
});
