
import React, { useEffect, useState } from 'react';
import NavigationBar from '../../components/Navbar'
import { useDispatch } from 'react-redux';
import { setDashboardModalState } from '../../actions';
import '../ProfilePage/index.scss'
import './index.scss';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { contracts, requestAccount } from '../../utils';


const LiquidityPage = () => {
    const dispatch = useDispatch();
    const [matic, setMat] = useState("");
    const [spt, setSpt] = useState("");
    const [lp, setLP] = useState(0);


    function onEthChange(e) {
        setMat(e);

    }
    function onMaticChange(e) {
        setSpt(matic*10);
    }

    const approveTx = async () => {

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const Spototoken = new ethers.Contract(
            contracts.SPOTO_COIN.address,
            contracts.SPOTO_COIN.abi,
            signer
        );
        const transaction = await Spototoken.approve(contracts.LPT.address, 10000000000000000000000000n);
        console.log(transaction);
        let tx = await transaction.wait();
        let event = tx.events[0];
        let value = event.args[2];
        console.log(tx)
    };

    const provideLiq = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const LiqPool = new ethers.Contract(
            contracts.LPT.address,
            contracts.LPT.abi,
            signer
        );
        const transaction = await LiqPool.addLiquidity({ value: ethers.utils.parseEther(matic) });
        console.log(transaction);
        let tx = await transaction.wait();
        console.log(tx)

    };

    const getlpBalance = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
    
        const LPbalance = new ethers.Contract(
            contracts.SPT_LP.address,
            contracts.SPT_LP.abi,
            signer
        );
        const getbal = await LPbalance.balanceOf(requestAccount());
        let value=parseInt( getbal._hex);
        value=value/1000000000000000000
        setLP(value)
    
    };

    useEffect(() => {
        // return ()=>{
        //  getlpBalance();
        // }
        return(
            getlpBalance()
        )
    }, [lp])
    
    return (
        <div className="liquidity_pool">

            <div className="bg_container">
                <NavigationBar />
                <div className="dashboard_container">
                    <div className="dashboard_centre_frame_container">
                        <div className="dashboard_centre_frame max_width">
                            <div className="frame_bg">
                                <div className="content_main_container">
                                    <div className="cards_up_main_heading">
                                        <div className="text">Add Liquidity to Pool</div>
                                    </div>
                                    <div className="pool_main_container">
                                        <div className="detail_container">
                                            <div className="input_container">
                                                <label htmlFor="ETHtoken">Matic Token :</label> <br />
                                                <input type="number" name="ETHtoken" id="ETHtoken" value={matic} onChange={event => onEthChange(event.target.value)} /> <span className='token_name'>Matic</span>
                                                <div className='plus_symbol'>+</div>
                                                <label htmlFor="Matictoken">SPT Token :</label> <br />
                                                <input type="number" name="Matictoken" id="Matictoken" value={spt} onChange={event => onMaticChange(event.target.value)} /><span className='token_name'>SPT</span>
                                            </div>
                                        </div>
                                        <div className="button">
                                            <div className="btn_container" onClick={() => {
                                                provideLiq()
                                            }}><span>Add Liquidity</span> </div>
                                        </div>
                                        <div className="approve_btn">

                                            <button className='button' onClick={approveTx}>Approve Once</button>
                                        </div>
                                        <div className="pool_cards_container">
                                            <div className="pool_cards">
                                                <div className="head">My LP Shares</div>
                                                <div className="value">{lp} SLPT</div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default LiquidityPage;