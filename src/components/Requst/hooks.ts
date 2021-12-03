import { createRequest } from './request';
import type { RequestConfig } from './types';

export const useAxios = (config?: RequestConfig) => {
    const instance = createRequest(config);
};
export const useRequest = () => {};
