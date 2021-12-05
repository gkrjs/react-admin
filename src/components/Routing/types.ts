import type { ReactElement, ReactNode } from 'react';
import type { BrowserRouterProps, NavigateProps } from 'react-router-dom';

interface BaseRouteProps<M extends Record<string, any>> {
    name?: string;
    cacheKey?: string;
    proteced?: {
        auth?: boolean;
        permissions?: string[];
    };
    meta?: M;
    loading?: JSX.Element | false;
}
interface PathRouteProps<M extends Record<string, any>> extends BaseRouteProps<M> {
    caseSensitive?: boolean;
    path: string;
    page?: React.ReactNode | string;
}
interface IndexRouteProps<M extends Record<string, any>> extends BaseRouteProps<M> {
    index: true;
    page?: React.ReactNode | string;
}
interface NavigateRouteProps<M extends Record<string, any>>
    extends BaseRouteProps<M>,
        NavigateProps {
    path?: string;
    index?: boolean;
}
export type RouteOption<M extends Record<string, any> = Record<string, any>> = (
    | PathRouteProps<M>
    | IndexRouteProps<M>
    | NavigateRouteProps<M>
) & {
    children?: RouteOption<M>[];
};
export interface RouterConfig<M extends Record<string, any> = Record<string, any>> {
    basePath?: string;
    hash?: boolean;
    window?: Window;
    render?: (basename: string, route: RouteOption<M>, element: ReactElement) => ReactNode;
    server?: {
        enabled?: boolean;
        api_url?: string | null;
    };
    auth?: {
        enabled?: boolean;
        login_path?: string;
    };
    permission?: {
        enabled?: boolean;
        column?: string;
    };
    routes: {
        constants: RouteOption<M>[];
        dynamic: RouteOption<M>[];
    };
}
export interface RouterState<M extends Record<string, any> = Record<string, any>>
    extends Omit<BrowserRouterProps, 'children' | 'basename'>,
        ReReuired<Omit<RouterConfig<M>, 'routes' | 'render' | 'window'>>,
        Pick<RouterConfig<M>, 'routes' | 'render'> {}

export interface ParentRouteProps<M extends Record<string, any> = Record<string, any>> {
    basePath: string;
    render?: (basename: string, route: RouteOption<M>, element: ReactElement) => ReactNode;
    index?: string;
    path?: string;
}
