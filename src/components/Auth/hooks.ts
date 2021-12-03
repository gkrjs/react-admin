import produce from 'immer';
import { useEffect } from 'react';
import create from 'zustand';
import shallow from 'zustand/shallow';

import { useStorage } from '../Storage';

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
            produce((draft) => {
                draft.token = token;
            }),
        );
    };
    const clearToken = async () => {
        const authStorage = getStore('auth');
        if (authStorage) await authStorage.setItem('token', null);
        return useAuthState.setState(
            produce((draft) => {
                draft.token = null;
            }),
        );
    };

    return { ...auth, setToken, clearToken };
};
