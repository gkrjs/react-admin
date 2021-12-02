import type { AxiosRequestConfig } from 'axios';

export interface RequestConfig extends AxiosRequestConfig {
    error_message?: boolean;
    cancel_repeat?: boolean;
    auth_token?: string;
}
