import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import './index.scss';
import metaMaskIcon from '../../assets/images/MetaMask_Fox.png';
import { useSelector, useDispatch } from 'react-redux';
import { setDashboardModalState, setUserAdd } from '../../actions';
import { requestAccount, requestBalance } from "../../utils/index";
import { Menu, Dropdown, Space } from 'antd';

const ConnectWallet = () => {
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userAddress, setUserAddress] = useState(false);
    const modalStage = useSelector((state) => state.spoto.updateDashboardModexStage);
    const walletAddress = useSelector((state) => state.spoto.userAdd);

    useEffect(() => {
        setIsModalVisible(modalStage);
    }, [modalStage])



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
        dispatch(setUserAdd(metaMaskAccount))
        setUserAddress(true);
        await requestBalance();
    };


    return (
        <>
            <div className='nav_modal_btn' >
                {userAddress && (
                    <>
                        <div className="nav_btn_container" type="primary" onClick={showModal}>
                            <p>Conneced</p>
                        </div>
                    </>
                )}
                {!userAddress && (
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
                                {userAddress && (
                                    <>
                                        <div className='user_address'>{walletAddress}</div>
                                    </>
                                )}
                                {!userAddress && (
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