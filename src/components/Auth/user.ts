import { useCreation } from 'ahooks';
import { useCallback } from 'react';
import useSWR from 'swr';

import create from 'zustand';

import { zimmer } from '@/utils/helper';

import { useConfig } from '../Config';

import { useRequest } from '../Request';

import type { User } from './types';

const createStore = <
    T extends Record<string, any> = Record<string, any>,
    P extends Record<string, any> = Record<string, any>,
>() => {
    const useStore = create(zimmer(() => ({ user: null } as { user: User<T, P> | null })));
    return useStore;
};

export const useInitUser = <
    T extends Record<string, any> = Record<string, any>,
    P extends Record<string, any> = Record<string, any>,
>(): void => {
    const request = useRequest();
    const useStore = createStore<T, P>();
    const { setState } = useStore;
    const {
        api: { account },
    } = useConfig();
    const fetcher = useCallback((url) => request.get(url).then((res) => res.data), []);
    const { data } = useSWR<User<T, P>>(account, fetcher);
    if (data) {
        setState((state) => {
            state.user = data;
        });
    }
};
export const useUser = <
    T extends Record<string, any> = Record<string, any>,
    P extends Record<string, any> = Record<string, any>,
>() => {
    const useStore = createStore<T, P>();
    const user = useStore((state) => state.user);
    return useCreation(() => user, [user]);
};
