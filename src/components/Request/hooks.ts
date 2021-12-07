import type { AxiosInstance } from 'axios';

import { useCallback, useRef, useState } from 'react';

import { useAuth, useAuthInit } from '@/components/Auth/auth';

import { createRequest } from './request';
import type { RequestConfig } from './types';

export function useRequest() {
    const authInited = useAuthInit();
    const { token, setToken, clearToken } = useAuth();
    const [initedReq, setInitReq] = useState<boolean>(false);
    const [initedAuthReq, setInitAuthReq] = useState<boolean>(false);
    const ref = useRef<AxiosInstance | null>(null);
    const authRef = useRef<AxiosInstance | null>(null);
    const getRequest = useCallback(
        (config?: RequestConfig, reCreate?: boolean) => {
            if (reCreate || !initedAuthReq) {
                if (!initedReq) return null;
                const instance = createRequest(config, {
                    withToken: false,
                });
                ref.current = instance;
                setInitReq(true);
                return instance;
            }
            if (ref.current) return ref.current;
            return null;
        },
        [initedReq, authInited],
    );
    const getAuthRequest = useCallback(
        (config?: RequestConfig, reCreate?: boolean) => {
            if (reCreate || !initedAuthReq) {
                if (!authInited) return null;
                const instance = createRequest(config, {
                    withToken: true,
                    token,
                    setToken,
                    clearToken,
                });
                authRef.current = instance;
                setInitAuthReq(true);
                return instance;
            }
            if (authRef.current) return authRef.current;
            return null;
        },
        [initedAuthReq, authInited],
    );
    return { getRequest, getAuthRequest };
}
