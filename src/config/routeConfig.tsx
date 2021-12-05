import { SmileOutlined } from '@ant-design/icons';

import { RequirdAuth } from '@/components/Auth';
import type { RouterConfig } from '@/components/Routing';

export const routing: RouterConfig = {
    basePath: import.meta.env.BASE_URL,
    window: undefined,
    hash: false,
    render: (basename, route, element) => (
        <RequirdAuth basename={basename} route={route} element={element} path="/auth/login" />
    ),
    routes: {
        constants: [
            {
                path: '/auth',
                children: [
                    {
                        name: 'auth.redirect',
                        index: true,
                        to: '/auth/login',
                    },
                    {
                        name: 'auth.login',
                        path: 'login',
                        page: 'pages/auth/login',
                        meta: { text: '登录页面', icon: <SmileOutlined /> },
                    },
                    {
                        name: 'auth.singup',
                        path: 'signup',
                        page: 'pages/auth/signup',
                        meta: { text: '注册页面', icon: <SmileOutlined /> },
                    },
                ],
            },
            {
                name: '404',
                path: '*',
                page: 'pages/errors/404',
            },
        ],
        dynamic: [
            {
                path: '/',
                page: 'layouts/master',
                proteced: { auth: true },
                children: [
                    {
                        name: 'dashboard',
                        index: true,
                        page: 'pages/dashboard/index',
                        meta: { text: '仪表盘', icon: <SmileOutlined /> },
                    },
                    {
                        name: 'content',
                        path: 'content',
                        children: [
                            {
                                name: 'index',
                                index: true,
                                to: '/content/articles',
                            },
                            {
                                name: 'articles',
                                path: 'articles',
                                page: 'pages/content/articles/index',
                            },
                            {
                                name: 'categories',
                                path: 'categories',
                                page: 'pages/content/categories/index',
                            },
                        ],
                    },
                ],
            },
        ],
    },
};
