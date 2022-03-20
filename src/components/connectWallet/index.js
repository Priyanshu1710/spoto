import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import './index.scss';
import metaMaskIcon from '../../assets/images/MetaMask_Fox.png';

const ConnectWallet = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <div >
                <Button type="primary" onClick={showModal}>
                    Connect Wallet
                </Button>
                <Modal
                    title="Connect Wallet"
                    visible={isModalVisible}
                    footer={null}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    className='connect_wallet_main_container'
                >
                    <div>
                        <div className="metamask_main_container" >
                            <div className="metamask_container"
                                onClick={() => console.log("Connect MetaMase")}
                            >
                                <div className="img_container">
                                    <img src={metaMaskIcon} alt="Metamask" />
                                </div>
                                <h1>MetaMask</h1>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default ConnectWallet;