import type { MenuDataItem } from '@ant-design/pro-layout';
import loadable from '@loadable/component';
import { trim, omit, pick } from 'lodash-es';

import { createContext } from 'react';
import type { FC } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';

import type {
    RouteOption,
    RouterConfig,
    ParentPropsForGenerator,
    MenuOption,
    AntdMenuOption,
    AntdRouterConfig,
} from './types';

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
export const formatPath = (item: RouteOption, basePath: string, parentPath?: string): string => {
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
export const getRoutes = <M extends Record<string, any> | null>(
    children: RouteOption<M>[],
    parent: ParentPropsForGenerator,
) => {
    let nameMaps: Record<string, string> = {};
    const data = children.map((child, index) => {
        let route: RouteObject | undefined;
        let menus: MenuOption[] = [];
        let menu: MenuOption | undefined;
        const current: ParentPropsForGenerator = {
            basePath: parent.basePath,
            name: parent.name ? `${parent.name}.${child.name}` : child.name,
            index: parent.index ? `${parent.index}.${index.toString()}` : index.toString(),
        };
        // 当前项是一个外部链接
        const isUrl = 'isUrl' in child && child.isUrl;
        // 当前项是一个分隔符
        const isDivide = 'isDivide' in child && child.isDivide;
        // 当前项是一个路由
        const isRoute =
            !('isUrl' in child) &&
            !('isDivide' in child) &&
            ('path' in child || 'index' in child || 'to' in child);
        // 当前项是一个跳转路由
        const isRedirectRoute = 'to' in child;
        // 配置是一个React路由
        if (isRoute) {
            route = { ...omit(child, ['page', 'children']) };
            const currentPath = formatPath(child, parent.basePath, parent.path);
            current.path = currentPath;
            if (current.name) {
                nameMaps[current.name] = current.path;
            }
            // 是一个跳转路由
            if (isRedirectRoute) {
                route.element = <Navigate {...pick(child, ['to', 'state'])} replace />;
                // 是一个页面路由
            } else if (child.page) {
                if (typeof child.page === 'string') {
                    let fallback: JSX.Element | undefined;
                    if (child.loading) {
                        fallback = typeof child.loading === 'boolean' ? <Loading /> : child.loading;
                    }
                    const Component = loadable(pages[child.page], {
                        cacheKey: () => child.cacheKey ?? current.name ?? current.index!,
                        fallback,
                    });
                    route.element = <Component />;
                } else {
                    route.element = child.page;
                }
                const AsyncPage = getAsyncPage({
                    page: child.page as string,
                    cacheKey: child.cacheKey ?? current.name ?? current.index!,
                    loading: child.loading,
                });
                route.element = typeof child.page === 'string' ? <AsyncPage /> : child.page;
            } else {
                route.element = <Outlet />;
            }
        }
        const { text, icon } = child.meta ?? {};
        // 配置是一个菜单
        if (child.name) {
            menu = {
                ...(child.meta ?? {}),
                id: current.index!,
                icon,
                text: text ?? current.name ?? current.index!,
            };
            if ('target' in child && typeof child.target === 'string') {
                menu.target = child.target;
            }
            if (isDivide) {
                menu.divide = true;
            } else if (isUrl) {
                menu.url = child.path;
            } else if (current.path) {
                menu.path = current.path;
            }
        }

        if (child.children) {
            const rst = getRoutes(child.children, current);
            if (route) route.children = rst.routes;
            nameMaps = { ...nameMaps, ...rst.nameMaps };
            if (menu) {
                menu.children = rst.menus;
            } else {
                menus = rst.menus;
            }
        }
        if (menu) menus.push(menu);
        return { route, menus };
    });
    const routes = data.filter((item) => item.route).map((item) => item.route) as RouteOption[];
    const menus = data.map((item) => item.menus).reduce((o, n) => [...o, ...n], []) as MenuOption[];
    return { routes, menus, nameMaps };
};

export const getAntdMenus = (menus: AntdMenuOption[]) =>
    menus.map((item) => {
        const menu: Record<string, any> = omit(item, [
            'target',
            'path',
            'url',
            'divide',
            'children',
            'text',
            'routes',
        ]);
        menu.name = item.text;
        if (item.divide) {
            menu.disabled = true;
        } else if (item.url) {
            menu.path = item.url;
            menu.target = item.target;
        } else if (item.path) {
            menu.path = item.path;
        }
        if (item.children) menu.children = getAntdMenus(item.children);
        return menu as MenuDataItem;
    });

export const RouterContext = createContext<{
    basePath: string;
    routes: RouteObject[];
    menus: MenuOption[];
    names: Record<string, string>;
    setConfig: (config: RouterConfig | AntdRouterConfig) => void;
}>({
    basePath: '/',
    routes: [],
    menus: [],
    names: {},
    setConfig: (config) => {},
});
