import { useAsyncEffect, useDeepCompareEffect } from 'ahooks';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useDeepCompareMemo } from '@/hooks';
import { createImmer } from '@/utils/store';

import { useRequest } from '../Request';

import { useAuthInit } from './auth';
import type { User } from './types';

type StoreType = {
    user: User | null;
    inited: boolean;
};
const useUserStore = createImmer<StoreType>(() => ({ user: null, inited: false }));
export const useUserInit = (accout_api?: string) => {
    const authInited = useAuthInit();
    const { getAuthRequest } = useRequest();
    const request = getAuthRequest();
    const [api, setApi] = useState<string | undefined>();
    const inited = useUserStore((state) => state.inited);
    // const [inited, setInit] = useState<boolean>(false);
    useEffect(() => {
        if (accout_api !== undefined) setApi(accout_api);
    }, [accout_api]);
    useAsyncEffect(async () => {
        if (inited && !authInited) {
            useUserStore.setState((draft) => {
                draft.user = null;
                draft.inited = false;
            });
        } else if (!inited && authInited && api && request) {
            try {
                console.log('ddd');
                const { data } = await request.get(api);
                if (data) {
                    useUserStore.setState((draft) => {
                        draft.user = data;
                        draft.inited = true;
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, [authInited]);
    return {
        inited: useMemo(() => inited, [inited]),
        setApi: useCallback(setApi, []),
    };
};
export const useUser = <
    T extends Record<string, any> = Record<string, any>,
    P extends Record<string, any> = Record<string, any>,
>() => {
    const user = useUserStore((state) => state.user) as User<T, P>;
    useDeepCompareEffect(() => {
        if (user) console.log(user);
    }, [user]);
    return {
        user: useDeepCompareMemo(() => user, [user]),
        setInit: useCallback(
            (inited: boolean) => useUserStore.setState((state) => ({ ...state, inited })),
            [],
        ),
    };
};
