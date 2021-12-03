import produce from 'immer';
import create from 'zustand';

const useToken = create<{ token: null | string }>((set) => ({
    token: null,
    setToken: (token: string) =>
        set(
            produce((state) => {
                state.token = token;
            }),
        ),
    clearToken: () => set((state) => ({ ...state, token: null })),
}));
