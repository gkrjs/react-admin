import type { ReactElement, ReactNode } from 'react';
import type { BrowserRouterProps, NavigateProps, RouteObject } from 'react-router-dom';

interface BaseRouteProps<M extends Record<string, any> | null> {
    name?: string;
    cacheKey?: string;
    auth?: boolean;
    permissions?: string[];
    roles?: string[];
    meta?: M;
    loading?: JSX.Element | false;
}
interface PathRouteProps<M extends Record<string, any> | null> extends BaseRouteProps<M> {
    caseSensitive?: boolean;
    path: string;
    page?: React.ReactNode | string;
}
interface IndexRouteProps<M extends Record<string, any> | null> extends BaseRouteProps<M> {
    index: true;
    page?: React.ReactNode | string;
}
interface NavigateRouteProps<M extends Record<string, any> | null>
    extends BaseRouteProps<M>,
        NavigateProps {
    path?: string;
    index?: boolean;
}
export type RouteOption<M extends Record<string, any> | null = null> = (
    | PathRouteProps<M>
    | IndexRouteProps<M>
    | NavigateRouteProps<M>
) & {
    children?: RouteOption<M>[];
};
export interface RouterConfig<M extends Record<string, any> | null = null> {
    basePath?: string;
    render?: (basename: string, route: RouteOption, element: ReactElement) => ReactNode;
    hash?: boolean;
    access_fields?: { permission?: string; role?: string };
    routes?: RouteOption<M>[];
}
export interface RouterState extends Omit<BrowserRouterProps, 'children'> {
    hash?: boolean;
    routes?: RouteObject[];
}
