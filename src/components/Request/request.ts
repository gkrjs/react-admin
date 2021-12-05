import axios from 'axios';
import type { AxiosResponse, AxiosRequestConfig, AxiosInstance } from 'axios';

import produce from 'immer';

import type { RequestConfig } from './types';

function getPendingKey(config: AxiosRequestConfig) {
    const { url, method, params } = config;
    let { data } = config;
    if (typeof data === 'string') data = JSON.parse(data); // response里面返回的config.data是个字符串对象
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
}

function addPending(config: AxiosRequestConfig, maps: Map<string, any>) {
    const nmaps = produce(maps, (draft) => draft);
    const pendingKey = getPendingKey(config);
    config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken((cancel) => {
            if (!nmaps.has(pendingKey)) {
                nmaps.set(pendingKey, cancel);
            }
        });
    return nmaps;
}

function removePending(config: AxiosRequestConfig, maps: Map<string, any>) {
    const nmaps = produce(maps, (draft) => draft);
    const pendingKey = getPendingKey(config);
    if (nmaps.has(pendingKey)) {
        const cancelToken = nmaps.get(pendingKey);
        cancelToken(pendingKey);
        nmaps.delete(pendingKey);
    }
    return nmaps;
}

export const createRequest: (
    config?: RequestConfig,
    token?: string | null,
    fetched?: {
        success?:
            | ((value: AxiosResponse<any, any>) => Promise<AxiosResponse<any, any>>)
            | undefined;
        failed?: ((error: any) => Promise<any>) | undefined;
    },
) => AxiosInstance = (config, token, fetched) => {
    const success: (value: AxiosResponse<any, any>) => Promise<AxiosResponse<any, any>> =
        fetched?.success ?? ((value) => Promise.resolve(value));
    const failed: (error: any) => any = (error) => Promise.reject(error);
    let pendingMap = new Map();
    const options: RequestConfig = {
        baseURL: '/api/',
        timeout: 10000,
        ...(config ?? {}),
    };
    const instance = axios.create(options);
    instance.interceptors.request.use(
        (params: RequestConfig) => {
            pendingMap = removePending(params, pendingMap);
            if (params.cancel_repeat) {
                pendingMap = addPending(params, pendingMap);
            }
            if (token && typeof window !== 'undefined') {
                options.headers = { ...(options.headers ?? {}), Authorization: token };
            }
            return params;
        },
        (error) => failed(error),
    );

    instance.interceptors.response.use(
        (response) => {
            pendingMap = removePending(response.config, pendingMap);
            return success(response);
        },
        (error) => {
            pendingMap = error.config && removePending(error.config, pendingMap);
            return failed(error);
        },
    );

    return instance;
};
