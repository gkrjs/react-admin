/* eslint-disable autofix/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useAsyncEffect } from 'ahooks';

import { useCallback, useMemo } from 'react';

import { createImmer } from '@/utils/store';

import { useStorage, useStorageInit, useStorageMutation } from '../Storage';

type Auth = { token?: null | string; inited: boolean };
const useAuthStore = createImmer<Auth>(() => ({ inited: false }));
export const useAuthInit = () => {
    const { addTable } = useStorageMutation();
    const { getInstance } = useStorage();
    const { setToken, clearToken } = useAuth();
    const storageInited = useStorageInit();
    const inited = useAuthStore((state) => state.inited);
    useAsyncEffect(async () => {
        if (!inited && storageInited) {
            addTable({ name: 'auth' });
            const storage = getInstance('auth');
            if (storage) {
                const storgeToken = await storage.getItem<string | null>('token');
                if (!storgeToken) await clearToken();
                else await setToken(storgeToken);
            }
        }
    }, [storageInited]);
    return useMemo(() => inited, [inited]);
};
export const useAuth = () => {
    const { getInstance } = useStorage();
    const { token } = useAuthStore((state) => state);
    const setToken = useCallback(async (value: string) => {
        const storage = getInstance('auth');
        if (storage) await storage.setItem('token', value);
        return useAuthStore.setState((draft) => {
            draft.token = value;
            draft.inited = true;
        });
    }, []);
    const clearToken = useCallback(async () => {
        const storage = getInstance('auth');
        if (storage) await storage.setItem('token', null);
        useAuthStore.setState((draft) => {
            draft.token = null;
            draft.inited = false;
        });
    }, []);

    return { token: useMemo(() => token, [token]), setToken, clearToken };
};
