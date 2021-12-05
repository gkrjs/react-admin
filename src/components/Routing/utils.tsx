import loadable from '@loadable/component';
import { omit, pick, trim } from 'lodash-es';
import type { FC, ReactElement } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';

import type { ParentRouteProps, RouteOption } from './types';

const getAsyncImports = (imports: Record<string, () => Promise<any>>, reg: RegExp) => {
    return Object.keys(imports)
        .map((key) => {
            const names = reg.exec(key);
            return Array.isArray(names) && names.length >= 2
                ? { [names[1]]: imports[key] }
                : undefined;
        })
        .filter((m) => !!m)
        .reduce((o, n) => ({ ...o, ...n }), []) as unknown as Record<string, () => Promise<any>>;
};
export const pages = getAsyncImports(
    import.meta.glob('../../**/*.{tsx,jsx}'),
    /..\/..\/([\w+.?/?]+).tsx|.jsx/i,
);
export const Loading: FC = () => (
    <div className="fixed w-full h-full top-0 left-0 dark:bg-white bg-gray-800 bg-opacity-25 flex items-center justify-center">
        <span>加载中</span>
    </div>
);

/**
 * @description 格式化路由路径
 * @param {RouteOption} item
 * @param {string} basePath
 * @param {string} [parentPath]
 * @returns {*}  {string}
 */
export const formatPath = <M extends Record<string, any>>(
    item: RouteOption<M>,
    basePath: string,
    parentPath?: string,
): string => {
    const currentPath = 'path' in item && typeof item.path === 'string' ? item.path : '';
    // 如果没有传入父路径则使用basePath作为路由前缀
    let prefix = !parentPath ? basePath : `/${trim(parentPath, '/')}`;
    // 如果是父路径下的根路径则直接父路径
    if (trim(currentPath, '/') === '') return prefix;
    // 如果是顶级根路径并且当前路径以通配符"*"开头则直接返回当前路径
    if (prefix === '/' && currentPath.startsWith('*')) return currentPath;
    // 如果前缀不是"/",则为在前缀后添加"/"作为与当前路径的连接符
    if (prefix !== '/') prefix = `${prefix}/`;
    // 生成最终路径
    return `${prefix}${trim(currentPath, '/')}`;
};

export const getAsyncPage = (props: {
    cacheKey: string;
    loading?: JSX.Element | boolean;
    page: string;
}) => {
    const { cacheKey, loading, page } = props;
    let fallback: JSX.Element | undefined;
    if (loading) {
        fallback = typeof loading === 'boolean' ? <Loading /> : loading;
    }
    return loadable(pages[page], {
        cacheKey: () => cacheKey,
        fallback,
    });
};
export const factoryRoutes = <M extends Record<string, any>>(
    children: RouteOption<M>[],
    parent: ParentRouteProps<M>,
) => {
    let nameMaps: Record<string, string> = {};
    const routes = children.map((item, index) => {
        const route: RouteObject = { ...omit(item, ['page', 'children']) };
        const current: ParentRouteProps<M> = {
            ...parent,
            basePath: parent.basePath,
            index: parent.index ? `${parent.index}.${index.toString()}` : index.toString(),
        };
        // 当前项是一个跳转路由
        const isRedirectRoute = 'to' in item;
        const currentPath = formatPath(item, parent.basePath, parent.path);
        current.path = currentPath;
        if (item.name) {
            nameMaps[item.name] = current.path;
        }
        // 当前项是一个跳转路由
        if (isRedirectRoute) {
            route.element = <Navigate {...pick(item, ['to', 'state'])} replace />;
            // 当前项是一个页面路由
        } else if (item.page) {
            if (typeof item.page === 'string') {
                const AsyncPage = getAsyncPage({
                    page: item.page as string,
                    cacheKey: item.cacheKey ?? item.name ?? current.index!,
                    loading: item.loading,
                });
                route.element = <AsyncPage />;
            } else {
                route.element = item.page;
            }
        } else {
            route.element = <Outlet />;
        }
        if (current.render) {
            route.element = current.render(current.basePath, item, route.element as ReactElement);
        }

        if (item.children) {
            const rst = factoryRoutes(item.children, current);
            if (route) route.children = rst.routes;
            nameMaps = { ...nameMaps, ...rst.nameMaps };
        }
        return route;
    }) as RouteObject[];
    return { routes, nameMaps };
};
