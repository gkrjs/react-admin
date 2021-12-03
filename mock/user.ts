import { MockMethod } from 'vite-plugin-mock';

import { resultError, resultSuccess, getRequestToken, RequestParams } from './_util';

export function createFakeUserList() {
    return [
        {
            id: '1',
            username: 'pincman',
            email: 'pincman@qq.com',
            nickname: 'pincman',
            avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
            desc: 'manager',
            password: '123456',
            token: 'fakeToken1',
            homePath: '/dashboard/analysis',
            roles: [
                {
                    roleName: 'Super Admin',
                    value: 'super',
                },
            ],
        },
        {
            id: '2',
            username: 'test',
            email: 'pincman@qq.com',
            password: '123456',
            nickname: 'test user',
            avatar: 'https://q1.qlogo.cn/g?b=qq&nk=339449197&s=640',
            desc: 'tester',
            token: 'fakeToken2',
            homePath: '/dashboard/workbench',
            roles: [
                {
                    roleName: 'Tester',
                    value: 'test',
                },
            ],
        },
    ];
}

const fakeCodeList: any = {
    '1': ['1000', '3000', '5000'],

    '2': ['2000', '4000', '6000'],
};
export default [
    // mock user login
    {
        url: '/api/user/auth/login',
        timeout: 200,
        method: 'post',
        response: ({ body }) => {
            const { credential, password } = body;
            const checkUser = createFakeUserList().find(
                (item) =>
                    (item.username === credential || item.nickname === credential) &&
                    password === item.password,
            );
            if (!checkUser) {
                return resultError('Incorrect account or password！');
            }
            const { id, username, email, token, nickname, desc, roles } = checkUser;
            return resultSuccess({
                roles,
                id,
                username,
                email,
                nickname,
                token,
                desc,
            });
        },
    },
    {
        url: '/api/user/info',
        method: 'get',
        response: (request: RequestParams) => {
            const token = getRequestToken(request);
            if (!token) return resultError('Invalid token');
            const checkUser = createFakeUserList().find((item) => item.token === token);
            if (!checkUser) {
                return resultError('The corresponding user information was not obtained!');
            }
            return resultSuccess(checkUser);
        },
    },
    {
        url: '/api/getPermCode',
        timeout: 200,
        method: 'get',
        response: (request: RequestParams) => {
            const token = getRequestToken(request);
            if (!token) return resultError('Invalid token');
            const checkUser = createFakeUserList().find((item) => item.token === token);
            if (!checkUser) {
                return resultError('Invalid token!');
            }
            const codeList = fakeCodeList[checkUser.id];

            return resultSuccess(codeList);
        },
    },
    {
        url: '/api/user/auth/logout',
        timeout: 200,
        method: 'get',
        response: (request: RequestParams) => {
            const token = getRequestToken(request);
            if (!token) return resultError('Invalid token');
            const checkUser = createFakeUserList().find((item) => item.token === token);
            if (!checkUser) {
                return resultError('Invalid token!');
            }
            return resultSuccess(undefined, { message: 'Token has been destroyed' });
        },
    },
] as MockMethod[];