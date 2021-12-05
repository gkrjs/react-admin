import { useCreation, useDeepCompareEffect } from 'ahooks';
import merge from 'deepmerge';

import { isArray, omit } from 'lodash-es';
import { useCallback, useState } from 'react';
import type { RouteObject } from 'react-router-dom';
import create from 'zustand';
import shallow from 'zustand/shallow';

import { zimmer } from '@/utils/helper';

import { useUser } from '../Auth';
import type { Permission, User } from '../Auth';

import { useRequest } from '../Request';

import { getDefaultState } from './_defaultConfig';
import type { RouteOption, RouterConfig, RouterState } from './types';
import { factoryRoutes } from './utils';

const useStore = create<RouterState>(zimmer(() => getDefaultState()));
export const useInitRouter = (config: RouterConfig) => {
    useDynamicRoutes();
    useStore.setState((state) => merge(config, state) as RouterState, true);
};

export const useRouter = () => {
    const { constants, dynamic } = useStore((state) => state.routes, shallow);
    const [routes, setRoutes] = useState<RouteObject[]>([]);
    const [names, setNames] = useState<Record<string, string>>({});
    const config = useRouterConfig();
    const user = useUser();

    const { basePath, render } = config;
    useDeepCompareEffect(() => {
        (async () => {
            const { routes: items, nameMaps } = factoryRoutes(
                filteAccessRoutes([...constants, ...dynamic], user, config.permission),
                {
                    basePath,
                    render,
                },
            );
            setRoutes(items);
            setNames(nameMaps);
        })();
    }, [constants, dynamic]);
    return {
        config: useCreation(() => config, [config]),
        routes: useCreation(() => routes, [routes]),
        names: useCreation(() => names, [names]),
    };
};

export const useRouterMutation = () => {
    const addRoutes = useCallback(
        useDynamicStore((state) => state.add),
        [],
    );
    return {
        configure: useCallback(useStore.setState, []),
        addRoutes,
    };
};

const filteAccessRoutes = (
    routes: RouteOption[],
    user: User | null,
    permconf: RouterState['permission'],
) => {
    const permColumn = permconf.column;
    let userPerms: Array<Permission<Record<string, any>>> = [];
    if (!!user && user.permissions) userPerms = user.permissions;
    const userPermNames = userPerms
        .filter((p) => 'permColumn' in p && typeof p[permColumn] === 'string')
        .map((p) => p[permColumn] as string);
    return routes.filter((route) => {
        const access = route.proteced ?? {};
        const auth = access.auth ?? false;
        const routePerms = access.permissions ?? [];
        if (auth) {
            if (
                !user ||
                (routePerms.length > 0 && !userPermNames.some((p) => routePerms.includes(p)))
            ) {
                return false;
            }
            if (route.children && route.children.length > 0) {
                route.children = filteAccessRoutes(route.children, user, permconf);
            }
        }
        return true;
    });
};
const useRouterConfig = () => useStore((state) => omit(state, ['routes']), shallow);
const useDynamicStore = create<{
    routes: RouteOption[];
    add: (routes: RouteOption[]) => void;
    set: (routes: RouteOption[]) => void;
}>(
    zimmer((set) => ({
        routes: [],
        add: (routes: RouteOption[]) =>
            set((draft) => {
                draft.routes = [...draft.routes, ...routes];
            }),
        set: (routes: RouteOption[]) =>
            set((draft) => {
                draft.routes = routes;
            }),
    })),
);
const useDynamicRoutes = () => {
    const { configure } = useRouterMutation();
    const request = useRequest();
    const { server } = useRouterConfig();
    const dynamicRoutes = useDynamicStore((state) => state.routes, shallow);
    const setRoutes = useDynamicStore((state) => state.set);
    useDeepCompareEffect(() => {
        (async () => {
            if (server.enabled && server.api_url !== null) {
                try {
                    const { data } = await request.get<RouteOption[]>(server.api_url);
                    if (isArray(data)) setRoutes(data);
                } catch (error) {
                    console.log(error);
                }
            }
        })();
    }, [server]);
    useDeepCompareEffect(() => {
        configure((draft) => {
            draft.routes.dynamic = dynamicRoutes;
        });
    }, [dynamicRoutes]);
};
