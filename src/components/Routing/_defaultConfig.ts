import type { RouterState } from './types';

export const getDefaultState: <M extends Record<string, any>>() => RouterState<M> = () => ({
    basePath: '/',
    hash: false,
    server: {
        enabled: false,
        api_url: null,
    },
    auth: {
        enabled: true,
        login_path: '/auth/login',
    },
    permission: {
        enabled: true,
        column: 'name',
    },
    routes: {
        constants: [],
        dynamic: [],
    },
});
