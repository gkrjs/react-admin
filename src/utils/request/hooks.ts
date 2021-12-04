import { useCreation } from 'ahooks';
import type { AxiosInstance } from 'axios';

import { useAuth } from '@/components/Auth/hooks';

import { createRequest } from './request';
import type { RequestConfig } from './types';

export function useRequest(): AxiosInstance;
export function useRequest(withToken: boolean): AxiosInstance;
export function useRequest(config: RequestConfig): AxiosInstance;
export function useRequest(config?: RequestConfig | boolean, withToken?: boolean) {
    const { token } = useAuth();
    const option: { config?: RequestConfig; withToken: boolean } = {
        withToken: true,
    };
    if (typeof config === 'boolean') {
        option.withToken = config;
    } else if (typeof withToken === 'boolean') {
        option.config = config;
        option.withToken = withToken;
    }
    return useCreation(
        () => createRequest(option.config, option.withToken ? token : undefined),
        [option.config, option.withToken, token],
    );
}
