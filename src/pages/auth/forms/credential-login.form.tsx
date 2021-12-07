import ProForm, { ProFormText } from '@ant-design/pro-form';

import { message } from 'antd';

import { FC, useEffect, useState } from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '@/components/Auth/auth';

import { useLocationPath } from '@/components/Router';

const waitTime = (time = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const CredentialLoginForm: FC = () => {
    const { clearToken } = useAuth();
    // const request = useAuthRequest();
    const { search } = useLocation();
    const { basePath } = useLocationPath();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [redirect, setRedirect] = useState(basePath);
    useEffect(() => {
        let queryRedirect = searchParams.get('redirect');
        if (queryRedirect && queryRedirect.length > 0) {
            searchParams.forEach((v, k) => {
                if (k !== 'redirect') queryRedirect = `${queryRedirect}&${k}=${v}`;
            });
            setRedirect(queryRedirect);
        } else {
            setRedirect(basePath);
        }
    }, [search]);

    return (
        <div className="p-4 w-full">
            <ProForm
                className="enter-x"
                onFinish={async (values) => {
                    await clearToken();
                    try {
                        // const {
                        //     data: { token },
                        // } = await request.post('/user/auth/login', values);
                        // if (token) await setToken(token);
                        message.success('登录成功');
                        console.log(redirect);
                        waitTime();
                        navigate(redirect, { replace: true });
                    } catch (err) {
                        message.error('用户名或密码错误');
                    }
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
