
import React, { useState } from 'react';
import { Form, Input, Button, Radio } from 'antd';
import { Select } from 'antd';
import './index.scss';

const { Option } = Select;


const ProfilePage = () => {
    const [form] = Form.useForm();
    const [requiredMark, setRequiredMarkType] = useState('optional');

    const onRequiredTypeChange = ({ requiredMarkValue }) => {
        setRequiredMarkType(requiredMarkValue);
    };
    return (
        <div className="container mt-5">
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    requiredMarkValue: requiredMark,
                }}
                onValuesChange={onRequiredTypeChange}
                requiredMark={true}
                className='profile_form_container '
            >
                <Form.Item
                    label="Name :"
                    required={true}
                    tooltip="This is a required field"
                >
                    <Input placeholder="Enter Your Name" />
                </Form.Item>

                <div className=' mb-4'>

                    <Select
                        defaultValue="Select Avatar"
                        style={{ width: "100% " }}
                        allowClear>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                    </Select>
                </div>

                <div className=' mb-4'>

                    <Select
                        defaultValue="Select Character 1"
                        style={{ width: "100% " }}
                        allowClear>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                    </Select>
                </div>

                <div className='mt-2 mb-2'>

                    <Select
                        defaultValue="Select Character 2"
                        style={{ width: "100% " }}
                        allowClear>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                    </Select>
                </div>





                <Form.Item className='mt-4'>
                    <Button type="primary">Create</Button>
                </Form.Item>
            </Form>
        </div>


    )
}

export default ProfilePage;