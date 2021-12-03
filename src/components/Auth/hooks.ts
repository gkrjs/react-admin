import produce from 'immer';
import { useEffect } from 'react';
import create from 'zustand';
import shallow from 'zustand/shallow';

import { useStorage } from '../Storage';

const useAuthStore = create<{ token: null | string }>((set) => ({
    token: null,
}));

export const useAuth = () => {
    const { storeState, addTable, getStore } = useStorage();
    const auth = useAuthStore((state) => state, shallow);
    useEffect(() => {
        addTable({ name: 'auth' });
    }, []);
    useEffect(() => {
        (async () => {
            const store = getStore('auth');
            if (store) {
                const storgeToken = await store.getItem<string | null>('token');
                if (!storgeToken) clearToken();
                else setToken(storgeToken);
            }
        })();
    }, [storeState]);
    useEffect(() => {
        (async () => {
            const store = getStore('auth');
            if (store) await store.setItem('token', auth.token);
        })();
    }, [auth.token]);
    const setToken = async (token: string) => {
        return useAuthStore.setState(
            produce((draft) => {
                draft.token = token;
            }),
        );
    };
    const clearToken = () =>
        useAuthStore.setState(
            produce((draft) => {
                draft.token = null;
            }),
        );
    return { ...auth, setToken, clearToken };
};
