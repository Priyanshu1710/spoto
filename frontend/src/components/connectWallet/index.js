import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import './index.scss';
import metaMaskIcon from '../../assets/images/MetaMask_Fox.png';
import { useSelector, useDispatch } from 'react-redux';
import { setDashboardModalState, setUserAdd, setUserBal } from '../../actions';
import { requestAccount, requestBalance } from "../../utils/index";
import { Menu, Dropdown, Space } from 'antd';

const ConnectWallet = () => {
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userAddress, setUserAddress] = useState();
    const [alreadyConnected, setAlreadyConnected] = useState();
    const modalStage = useSelector((state) => state.spoto.updateDashboardModexStage);
    const walletAddress = useSelector((state) => state.spoto.userAdd);





    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        dispatch(setDashboardModalState(false))
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        dispatch(setDashboardModalState(false))
    };
    const metaMaskConnectHandle = async () => {
        const metaMaskAccount = await requestAccount();
        console.log(metaMaskAccount);
        localStorage.setItem("userAddresss", metaMaskAccount);
        let userAccBal = localStorage.getItem("userBal")
        // console.log("userbal--->", userAccBal);
        dispatch(setUserAdd(metaMaskAccount))
        dispatch(setUserBal(userAccBal));
        let userAccAdd = localStorage.getItem("userAddresss")
        setUserAddress(userAccAdd);
        await requestBalance();
    };

    useEffect(() => {
        setIsModalVisible(modalStage);
        let userAccAdd = localStorage.getItem("userAddresss")
        // console.log("userbal--->", userAccAdd);
        setAlreadyConnected(userAccAdd);
        setUserAddress(userAccAdd)
        // console.log(alreadyConnected);
    }, [modalStage, alreadyConnected])


    return (
        <>
            <div className='nav_modal_btn' >
                {alreadyConnected && (
                    <>
                        <div className="nav_btn_container" type="primary" onClick={showModal}>
                            <p>Conneced</p>
                        </div>
                    </>
                )}
                {!alreadyConnected && (
                    <>
                        <div className="nav_btn_container" type="primary" onClick={showModal}>
                            <p>Connect Wallet</p>
                        </div>
                    </>
                )}

                <Modal
                    // title="Connect Wallet"
                    visible={isModalVisible}
                    footer={null}

                    onOk={handleOk}
                    onCancel={handleCancel}
                    centered={true}
                    className='connect_wallet_main_container'
                >
                    <div>
                        <div className="metamask_main_container" >
                            <div className="metamask_container"
                                onClick={() => {
                                    console.log("Connect MetaMase")
                                    metaMaskConnectHandle();
                                }}
                            >


                                {alreadyConnected && (
                                    <>
                                        <div className='user_address'>{userAddress}</div>
                                    </>
                                )}
                                {!alreadyConnected && (
                                    <>
                                        <div className="img_container">
                                            <img src={metaMaskIcon} alt="Metamask" />
                                        </div>
                                        <h1>MetaMask</h1>
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default ConnectWallet;