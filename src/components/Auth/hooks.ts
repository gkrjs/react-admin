import { useAsyncEffect } from 'ahooks';
import produce from 'immer';
import { useCallback, useMemo } from 'react';

import create from 'zustand';

import { useStorage, useAddTable } from '../Storage';

<<<<<<< HEAD
const useAuthState = create<{ token: null | string }>((set) => ({
    token: null,
}));

export const useAuth = () => {
    const { addTable, getStore } = useStorage();
    const auth = useAuthState((state) => state, shallow);

    useEffect(() => {
        (async () => {
            addTable({ name: 'auth' });
            const authStorage = getStore('auth');
            if (authStorage) {
                const storgeToken = await authStorage.getItem<string | null>('token');
                if (!storgeToken) clearToken();
                else setToken(storgeToken);
            }
        })();
    }, []);

    const setToken = async (token: string) => {
        const authStorage = getStore('auth');
        if (authStorage) await authStorage.setItem('token', auth.token);
        return useAuthState.setState(
=======
const useAuthStore = create<{ token?: null | string }>(() => ({}));

export const useAuth = () => {
    const addTable = useAddTable();
    const getStorage = useStorage();
    const { token } = useAuthStore((state) => state);
    useAsyncEffect(async () => {
        addTable({ name: 'auth' });
        const storage = getStorage('auth');
        if (storage) {
            const storgeToken = await storage.getItem<string | null>('token');
            if (!storgeToken) await clearToken();
            else await setToken(storgeToken);
        }
    }, []);
    const setToken = useCallback(async (value: string) => {
        const storage = getStorage('auth');
        if (storage) await storage.setItem('token', value);
        return useAuthStore.setState(
>>>>>>> 1ff6298ec41ef41865b28009e2e7518b1bc99383
            produce((draft) => {
                draft.token = value;
            }),
        );
<<<<<<< HEAD
    };
    const clearToken = async () => {
        const authStorage = getStore('auth');
        if (authStorage) await authStorage.setItem('token', null);
        return useAuthState.setState(
=======
    }, []);
    const clearToken = useCallback(async () => {
        const storage = getStorage('auth');
        if (storage) await storage.setItem('token', null);
        useAuthStore.setState(
>>>>>>> 1ff6298ec41ef41865b28009e2e7518b1bc99383
            produce((draft) => {
                draft.token = null;
            }),
        );
<<<<<<< HEAD
    };

    return { ...auth, setToken, clearToken };
=======
    }, []);

    return { token: useMemo(() => token, [token]), setToken, clearToken };
>>>>>>> 1ff6298ec41ef41865b28009e2e7518b1bc99383
};
