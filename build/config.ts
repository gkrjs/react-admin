/* eslint-disable import/no-extraneous-dependencies */
import merge from 'deepmerge';
import { ConfigEnv, UserConfig } from 'vite';

import { getPlugins } from './plugins';

import { Configure } from './types';
import { pathResolve } from './utils';

export const getConfig = (params: ConfigEnv, configure?: Configure): UserConfig => {
    const isBuild = params.command === 'build';
    return merge<UserConfig>(
        {
            resolve: {
                alias: {
                    '@': pathResolve('src'),
                    '~antd': 'antd',
                    '~@ant-design': '@ant-design',
                },
            },
            css: {
                modules: {
                    localsConvention: 'camelCaseOnly',
                },
                preprocessorOptions: {
                    less: {
                        javascriptEnabled: true,
                        modifyVars: { '@primary-color': '#1DA57A' },
                    },
                },
            },
            plugins: getPlugins(isBuild),
            server: { host: '0.0.0.0', port: 4000 },
        },
        typeof configure === 'function' ? configure(params, isBuild) : {},
        {
            arrayMerge: (_d, s, _o) => Array.from(new Set([..._d, ...s])),
        },
    );
};
