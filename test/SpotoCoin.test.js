const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Spoto Coin Contract", function () {
  let owner, addr1, addr2, addrs, spotoCoin, treasury, liquidityPool, lpToken;

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const SpotoCoin = await ethers.getContractFactory("SpotoCoin");
    treasury = addrs[35];
    spotoCoin = await SpotoCoin.deploy(treasury.address);

    const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    liquidityPool = await LiquidityPool.deploy();

    const LPT = await ethers.getContractFactory("LPT");
    lpToken = await LPT.deploy(liquidityPool.address);
  });

  describe("Deployment", () => {
    it("Creates 500,000 available tokens", async () => {
      const supply = await spotoCoin.totalSupply();
      expect(supply).to.be.equal("500000000000000000000000");
    });

    it("Assigns the owner correctly", async () => {
      const currentOwner = await spotoCoin.owner();
      expect(currentOwner).to.be.equal(owner.address);
    });

    it("Assigns the symbol of the token correctly", async () => {
      const symbol = await spotoCoin.symbol();
      expect(symbol).to.be.equal("SC");
    });

    it("Assigns the symbol of the token correctly", async () => {
      const name = await spotoCoin.name();
      expect(name).to.be.equal("Spoto Coin");
    });

    it("Adds owner to whitelist", async () => {
      const isOwnerWhitelisted = await spotoCoin.isWhitelisted(owner.address);
      expect(isOwnerWhitelisted).to.be.true;
    });
  });

  describe("Only owner", () => {
    it("Only owner can advance phase", async () => {
      await expect(spotoCoin.connect(addr1).advancePhase()).to.be.revertedWith(
        "OWNER_ONLY"
      );
    });

    it("Only owner can pause contract", async () => {
      await expect(
        spotoCoin.connect(addr1).togglePauseContract()
      ).to.be.revertedWith("OWNER_ONLY");
    });

    it("Only owner can toggle tax", async () => {
      await expect(spotoCoin.connect(addr1).toggleTax()).to.be.revertedWith(
        "OWNER_ONLY"
      );
    });

    it("Only owner can mint", async () => {
      await expect(
        spotoCoin.connect(addr1).mint(addr1.address, 1000)
      ).to.be.revertedWith("OWNER_ONLY");
    });

    it("Only owner can burn", async () => {
      await expect(
        spotoCoin.connect(addr1).burn(spotoCoin.address, 1000)
      ).to.be.revertedWith("OWNER_ONLY");
    });

    it("Only owner can add an address to whitelist", async () => {
      await expect(
        spotoCoin.connect(addr1).addToWhitelist(addr1.address)
      ).to.be.revertedWith("OWNER_ONLY");
    });

    it("Only owner can send fund to LP", async () => {
      await expect(
        spotoCoin
          .connect(addr1)
          .sendLiquidityToLPContract(liquidityPool.address)
      ).to.be.revertedWith("OWNER_ONLY");
    });
  });

  describe("Contributing", () => {
    it("Assigns 5 times the value contributed", async () => {
      await spotoCoin.contribute({ value: parseEther("0.25") });

      const assignedBalance = await spotoCoin.balancesToClaim(owner.address);
      expect(assignedBalance).to.be.equal(parseEther("1.25"));
    });
  });

  describe("Minting and burning", () => {
    it("Reverts mint if it would go above the maximum allowed supply", async () => {
      await expect(spotoCoin.mint(owner.address, 100)).to.be.revertedWith(
        "ABOVE_MAX_SUPPLY"
      );
    });

    it("Burns correctly", async () => {
      await spotoCoin.burn(spotoCoin.address, 100);

      const newSupply = await spotoCoin.totalSupply();
      expect(newSupply).to.be.equal(parseEther("499900"));
    });

    it("Mints and assigns correctly", async () => {
      await spotoCoin.burn(spotoCoin.address, 100);

      const supply = await spotoCoin.totalSupply();
      expect(supply).to.be.equal(parseEther("499900"));

      await spotoCoin.mint(owner.address, 100);

      const newSupply = await spotoCoin.totalSupply();
      const newOwnerBalance = await spotoCoin.balanceOf(owner.address);

      expect(newSupply).to.be.equal(parseEther("500000"));
      expect(newOwnerBalance).to.be.equal(parseEther("100"));
    });
  });

  describe("Taxing", () => {
    it("Pauses taxing", async () => {
      let balanceOfTreasury, balanceOfUser;

      await spotoCoin.contribute({ value: parseEther("1") });
      await spotoCoin.advancePhase();
      await spotoCoin.advancePhase();
      await spotoCoin.claimTokens();

      // TAX OFF
      await spotoCoin.toggleTax();
      await spotoCoin.transfer(addr1.address, parseEther("1"));
      balanceOfTreasury = await spotoCoin.balanceOf(treasury.address);
      balanceOfUser = await spotoCoin.balanceOf(addr1.address);

      expect(balanceOfTreasury).to.be.equal(parseEther("0"));
      expect(balanceOfUser).to.be.equal(parseEther("1"));

      // TAX ON
      await spotoCoin.toggleTax();
      await spotoCoin.transfer(addr2.address, parseEther("1"));
      balanceOfTreasury = await spotoCoin.balanceOf(treasury.address);
      balanceOfUser = await spotoCoin.balanceOf(addr2.address);

      expect(balanceOfTreasury).to.be.equal(parseEther("0.02"));
      expect(balanceOfUser).to.be.equal(parseEther("0.98"));
    });
  });

  describe("Pausing", () => {
    it("Pauses on SEED", async () => {
      await spotoCoin.contribute({ value: parseEther("0.25") });

      await spotoCoin.togglePauseContract();

      await expect(
        spotoCoin.contribute({ value: parseEther("0.25") })
      ).to.be.revertedWith("CONTRACT_PAUSED");

      await expect(spotoCoin.claimTokens()).to.be.revertedWith(
        "CONTRACT_PAUSED"
      );
    });

    it("Pauses on GENERAL", async () => {
      await spotoCoin.advancePhase();
      await spotoCoin.contribute({ value: parseEther("0.25") });

      await spotoCoin.togglePauseContract();

      await expect(
        spotoCoin.contribute({ value: parseEther("0.25") })
      ).to.be.revertedWith("CONTRACT_PAUSED");

      await expect(spotoCoin.claimTokens()).to.be.revertedWith(
        "CONTRACT_PAUSED"
      );
    });

    it("Pauses on OPEN", async () => {
      await spotoCoin.advancePhase();
      await spotoCoin.advancePhase();

      await spotoCoin.contribute({ value: parseEther("0.25") });

      await spotoCoin.togglePauseContract();

      await expect(
        spotoCoin.contribute({ value: parseEther("0.25") })
      ).to.be.revertedWith("CONTRACT_PAUSED");

      await expect(spotoCoin.claimTokens()).to.be.revertedWith(
        "CONTRACT_PAUSED"
      );
    });
  });

  describe("Phases", () => {
    it("Increases phases correctly", async () => {
      await spotoCoin.advancePhase();
      await spotoCoin.advancePhase();

      const phase = await spotoCoin.currentPhase();
      expect(phase).to.be.equal(2);
    });

    it("Reverts increasing phase if it's the last one", async () => {
      await spotoCoin.advancePhase();
      await spotoCoin.advancePhase();

      await expect(spotoCoin.advancePhase()).to.be.revertedWith("LAST_PHASE");
    });

    describe("SEED phase", () => {
      it("Reverts if individual total above 1500 ether", async () => {
        await spotoCoin.contribute({ value: parseEther("1400") });
        await expect(
          spotoCoin.contribute({ value: parseEther("200") })
        ).to.be.revertedWith("ABOVE_MAX_INDIVIDUAL_CONTRIBUTION");
      });

      it("Reverts if total contributions above 15,000 ether", async () => {
        //Donate maximum from 10 different address
        for (let i = 0; i < 10; i++) {
          await spotoCoin.addToWhitelist(addrs[i].address);
          await spotoCoin
            .connect(addrs[i])
            .contribute({ value: parseEther("1500") });
        }

        //Current total contributions: 15,000
        await spotoCoin.addToWhitelist(addrs[10].address);
        await expect(
          spotoCoin.connect(addrs[10]).contribute({ value: parseEther("1") })
        ).to.be.revertedWith("ABOVE_MAX_CONTRIBUTION");
      });
    });

    describe("GENERAL phase", () => {
      beforeEach(async () => {
        await spotoCoin.advancePhase();
      });

      it("Reverts if individual total above 1000 ether", async () => {
        await spotoCoin.contribute({ value: parseEther("1000") });
        await expect(
          spotoCoin.contribute({ value: parseEther("1") })
        ).to.be.revertedWith("ABOVE_MAX_INDIVIDUAL_CONTRIBUTION");
      });

      it("Reverts if total contributions above 30,000 ether", async () => {
        //Donate maximum from 30 different address
        for (let i = 0; i < 30; i++) {
          await spotoCoin
            .connect(addrs[i])
            .contribute({ value: parseEther("1000") });
        }

        //Current total contributions: 30,000
        await expect(
          spotoCoin.connect(addrs[30]).contribute({ value: parseEther("1") })
        ).to.be.revertedWith("ABOVE_MAX_CONTRIBUTION");
      });
    });

    describe("OPEN phase", () => {
      it("Reverts if total contributions above 30,000 ether", async () => {
        await spotoCoin.advancePhase();
        await spotoCoin.advancePhase();

        //Donate maximum from 30 different address
        for (let i = 0; i < 30; i++) {
          await spotoCoin
            .connect(addrs[i])
            .contribute({ value: parseEther("1000") });
        }

        //Current total contributions: 29,400
        await expect(
          spotoCoin.connect(addrs[30]).contribute({ value: parseEther("700") })
        ).to.be.revertedWith("ABOVE_MAX_CONTRIBUTION");
      });

      it("Reverts if claiming not allowed yet", async () => {
        await spotoCoin.contribute({ value: parseEther("10") });

        await expect(spotoCoin.claimTokens()).to.be.revertedWith(
          "NOT_LAST_PHASE"
        );
      });

      it("Allows user to claim tokens assigned to them", async () => {
        await spotoCoin.advancePhase();
        await spotoCoin.connect(addr1).contribute({ value: parseEther("0.5") });
        await spotoCoin.advancePhase();

        await spotoCoin.connect(addr1).claimTokens();

        const balanceOf = await spotoCoin.balanceOf(addr1.address);

        expect(balanceOf).to.be.equal(parseEther("2.5"));
      });

      it("Can only send funds on the OPEN phase", async () => {
        await expect(
          spotoCoin.sendLiquidityToLPContract(liquidityPool.address)
        ).to.be.revertedWith("NOT_LAST_PHASE");
      });
    });
  });

  describe("Token transfering", () => {
    it("Transfers tokens and takes 2%", async () => {
      await spotoCoin.contribute({ value: parseEther("1") });
      await spotoCoin.advancePhase();
      await spotoCoin.advancePhase();

      await spotoCoin.claimTokens();

      await spotoCoin.transfer(addr1.address, parseEther("1"));

      const balanceOf = await spotoCoin.balanceOf(addr1.address);

      expect(balanceOf).to.be.equal(parseEther("0.98"));
    });

    it("Sends 2% of a transaction to the treasury wallet", async () => {
      await spotoCoin.contribute({ value: parseEther("1") });
      await spotoCoin.advancePhase();
      await spotoCoin.advancePhase();
      await spotoCoin.claimTokens();
      await spotoCoin.transfer(addr1.address, parseEther("1"));

      const balanceOf = await spotoCoin.balanceOf(treasury.address);

      expect(balanceOf).to.be.equal(parseEther("0.02"));
    });
  });

  describe("Sending funds to liquidity pool", () => {
    beforeEach(async () => {
      await spotoCoin.advancePhase();
      await spotoCoin.advancePhase();

      //Donate 100 eth from 30 different address
      for (let i = 0; i < 30; i++) {
        await spotoCoin
          .connect(addrs[i])
          .contribute({ value: parseEther("100") });
      }

      await liquidityPool.setSpotoCoinAddress(spotoCoin.address);
      await liquidityPool.setLPTAddress(lpToken.address);
    });

    it("Sends 3,000 ETH and 15,000 SPT to LP", async () => {
      await spotoCoin.sendLiquidityToLPContract(liquidityPool.address);

      const provider = ethers.provider;

      const liquidityPoolSPTBalance = await spotoCoin.balanceOf(
        liquidityPool.address
      );
      const liquidityPoolETHBalance = await provider.getBalance(
        liquidityPool.address
      );

      expect(liquidityPoolSPTBalance).to.be.equal(parseEther("15000"));
      expect(liquidityPoolETHBalance).to.be.equal(parseEther("3000"));
    });

    it("Sends remaining 485,000 SPT to treasury", async () => {
      await expect(() =>
        spotoCoin.sendLiquidityToLPContract(liquidityPool.address)
      ).to.changeTokenBalance(spotoCoin, treasury, parseEther("485000"));
    });
  });
});
