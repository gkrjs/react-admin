import { useCreation } from 'ahooks';
import type { AxiosInstance } from 'axios';

import { useAuth } from '@/components/Auth/auth';

import { createRequest } from './request';
import type { RequestConfig } from './types';

export function useRequest(): AxiosInstance;
export function useRequest(withToken: boolean): AxiosInstance;
export function useRequest(config: RequestConfig): AxiosInstance;
export function useRequest(config?: RequestConfig | boolean, withToken?: boolean) {
    const { token, setToken, clearToken } = useAuth();
    const option: { config?: RequestConfig; withToken: boolean } = {
        withToken: true,
    };
    if (typeof config === 'boolean') {
        option.withToken = config;
    } else if (typeof withToken === 'boolean') {
        option.config = config;
        option.withToken = withToken;
    }
    const instance = createRequest(option.config, option.withToken ? token : undefined, {
        success: async (res) => {
            const resToken = res.headers.authorization;
            if (resToken && option.withToken) setToken(resToken);
            return res;
        },
        failed: async (err) => {
            console.log(err);
            switch (err.response.status) {
                case 401: {
                    if (option.withToken && token) clearToken();
                    break;
                }
                default:
                    break;
            }
            return err;
        },
    });
    return useCreation(() => instance, [option.config, option.withToken, token]);
}
