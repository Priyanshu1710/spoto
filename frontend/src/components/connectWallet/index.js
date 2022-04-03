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
        // console.log(metaMaskAccount);
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
        setAlreadyConnected(userAccAdd);
        setUserAddress(userAccAdd)
    }, [modalStage, alreadyConnected, userAddress])


    return (
        <>
            <div className='nav_modal_btn' >
                {userAddress && (
                    <>
                        <div className="nav_btn_container" type="primary" onClick={showModal}>
                            <p>Disconnect</p>
                        </div>
                    </>
                )}
                {!userAddress && (
                    <>
                        <div className="nav_btn_container" type="primary" onClick={showModal}>
                            <p>Metamask</p>
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
                                    // metaMaskConnectHandle();
                                }}
                            >


                                {walletAddress && (
                                    <>
                                        {/* <div className='user_address'>{userAddress}</div> */}
                                        <div className='user_address'>
                                            <div className="left">No</div>

                                            <div className="right" onClick={(() => {
                                                localStorage.removeItem("userAddresss")
                                                console.log("clicked yes");
                                                setUserAddress(false)
                                                dispatch(setUserAdd(0))
                                            })
                                            }>Yes</div>
                                        </div>
                                    </>
                                )}
                                {!walletAddress && (
                                    <>
                                        <div className='d-flex align-items-center' onClick={() => {
                                            console.log("Connect MetaMase")
                                            metaMaskConnectHandle();
                                        }}>
                                            <div className="img_container">
                                                <img src={metaMaskIcon} alt="Metamask" />
                                            </div>
                                            <h1>MetaMask</h1>
                                        </div>
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