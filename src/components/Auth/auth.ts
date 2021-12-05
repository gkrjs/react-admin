import { useAsyncEffect } from 'ahooks';
import produce from 'immer';
import { useCallback, useMemo } from 'react';

import create from 'zustand';

import { useStorage, useStorageMutation } from '../Storage';

const useAuthStore = create<{ token?: null | string }>(() => ({}));

export const useAuth = () => {
    const { addTable } = useStorageMutation();
    const { getInstance } = useStorage();
    const { token } = useAuthStore((state) => state);
    useAsyncEffect(async () => {
        addTable({ name: 'auth' });
        const storage = getInstance('auth');
        if (storage) {
            const storgeToken = await storage.getItem<string | null>('token');
            if (!storgeToken) await clearToken();
            else await setToken(storgeToken);
        }
    }, []);
    const setToken = useCallback(async (value: string) => {
        const storage = getInstance('auth');
        if (storage) await storage.setItem('token', value);
        return useAuthStore.setState(
            produce((draft) => {
                draft.token = value;
            }),
        );
    }, []);
    const clearToken = useCallback(async () => {
        const storage = getInstance('auth');
        if (storage) await storage.setItem('token', null);
        useAuthStore.setState(
            produce((draft) => {
                draft.token = null;
            }),
        );
    }, []);

    return { token: useMemo(() => token, [token]), setToken, clearToken };
};
