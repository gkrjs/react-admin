import ProForm, { ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import type { FC } from 'react';

const waitTime = (time = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const CredentialLoginForm: FC = () => {
    return (
        <div className="p-4 w-full">
            <ProForm
                className="enter-x"
                onFinish={async () => {
                    await waitTime(2000);
                    message.success('提交成功');
                }}
                submitter={{
                    searchConfig: {
                        submitText: '登录',
                    },
                    render: (_, dom) => dom.pop(),
                    submitButtonProps: {
                        size: 'large',
                        style: {
                            width: '100%',
                        },
                    },
                }}
            >
                <ProFormText
                    fieldProps={{
                        size: 'large',
                        // prefix: <MobileOutlined />,
                    }}
                    name="credential"
                    placeholder="请输入用户名,手机号或邮箱地址"
                    rules={[
                        {
                            required: true,
                            message: '请输入手机号!',
                        },
                        {
                            pattern: /^1\d{10}$/,
                            message: '不合法的手机号格式!',
                        },
                    ]}
                />
                <ProFormText.Password
                    fieldProps={{
                        size: 'large',
                    }}
                    name="password"
                    placeholder="请输入密码"
                />
            </ProForm>
        </div>
    );
};
export default CredentialLoginForm;
