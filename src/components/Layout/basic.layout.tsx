import { LikeOutlined, UserOutlined } from '@ant-design/icons';

import type { MenuDataItem, ProSettings } from '@ant-design/pro-layout';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';

import { Button, Descriptions, Result, Avatar, Space, Statistic } from 'antd';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAntdMenus, useLocationPath } from '../Router';

const content = (
    <Descriptions size="small" column={2}>
        <Descriptions.Item label="创建人">张三</Descriptions.Item>
        <Descriptions.Item label="联系方式">
            <a>421421</a>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">2017-01-10</Descriptions.Item>
        <Descriptions.Item label="更新时间">2017-10-10</Descriptions.Item>
        <Descriptions.Item label="备注">中国浙江省杭州市西湖区古翠路</Descriptions.Item>
    </Descriptions>
);

const MenuItem: FC<{
    item: MenuDataItem & {
        isUrl: boolean;
        onClick: () => void;
    };
    dom: React.ReactNode;
}> = ({ item, dom }) => {
    const { basePath } = useLocationPath();
    const navigate = useNavigate();
    if (item.isUrl) {
        return (
            <a href={item.path} target={item.target ?? '_blank'}>
                {dom}
            </a>
        );
    }
    return (
        <a
            onClick={(e) => {
                e.preventDefault();
                navigate(item.path ?? basePath);
            }}
        >
            {dom}
        </a>
    );
};

export default () => {
    const [settings] = useState<Partial<ProSettings> | undefined>({
        fixSiderbar: true,
    });
    const { pathname } = useLocationPath();
    const menus = useAntdMenus();
    return (
        <div
            id="app-layout"
            style={{
                height: '100vh',
            }}
        >
            <ProLayout
                location={{
                    pathname,
                }}
                route={{ path: '/', routes: menus }}
                // eslint-disable-next-line react/no-unstable-nested-components
                menuFooterRender={(props) => {
                    return (
                        <a
                            style={{
                                lineHeight: '48rpx',
                                display: 'flex',
                                height: 48,
                                color: 'rgba(255, 255, 255, 0.65)',
                                alignItems: 'center',
                            }}
                            href="https://preview.pro.ant.design/dashboard/analysis"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                alt="pro-logo"
                                src="https://procomponents.ant.design/favicon.ico"
                                style={{
                                    width: 16,
                                    height: 16,
                                    margin: '0 16px',
                                    marginRight: 10,
                                }}
                            />
                            {!props?.collapsed && 'Preview Pro'}
                        </a>
                    );
                }}
                onMenuHeaderClick={(e) => console.log(e)}
                // eslint-disable-next-line react/no-unstable-nested-components
                menuItemRender={(item, dom) => <MenuItem item={item} dom={dom} />}
                // eslint-disable-next-line react/no-unstable-nested-components
                rightContentRender={() => (
                    <div>
                        <Avatar shape="square" size="small" icon={<UserOutlined />} />
                    </div>
                )}
                {...settings}
            >
                <PageContainer
                    content={content}
                    tabList={[
                        {
                            tab: '基本信息',
                            key: 'base',
                        },
                        {
                            tab: '详细信息',
                            key: 'info',
                        },
                    ]}
                    extraContent={
                        <Space size={24}>
                            <Statistic title="Feedback" value={1128} prefix={<LikeOutlined />} />
                            <Statistic title="Unmerged" value={93} suffix="/ 100" />
                        </Space>
                    }
                    extra={[
                        <Button key="3">操作</Button>,
                        <Button key="2">操作</Button>,
                        <Button key="1" type="primary">
                            主操作
                        </Button>,
                    ]}
                    footer={[
                        <Button key="3">重置</Button>,
                        <Button key="2" type="primary">
                            提交
                        </Button>,
                    ]}
                >
                    <div
                        style={{
                            height: '120vh',
                        }}
                    >
                        <Result
                            status="404"
                            style={{
                                height: '100%',
                                background: '#fff',
                            }}
                            title="Hello World"
                            subTitle="Sorry, you are not authorized to access this page."
                            extra={<Button type="primary">Back Home</Button>}
                        />
                    </div>
                </PageContainer>
            </ProLayout>
        </div>
    );
};
