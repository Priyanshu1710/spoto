import React from 'react'
import { Card } from 'antd';
import './index.scss';

const { Meta } = Card;

const SelectSport = () => {
    return (
        <div className='container mt-4 '>
            <div className="cards_main_container d-flex justify-content-around">
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                >
                    <Meta title="Cricket" />
                </Card>

                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                >
                    <Meta title="Other" description="Coming Soon" />
                </Card>
            </div>
        </div>
    )
}

export default SelectSport;


