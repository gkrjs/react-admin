import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { getAntdMenus, RouterContext } from './util';

export const useAppRouter = () => {
    const { basePath, routes, menus, names, setConfig } = useContext(RouterContext);
    return {
        basePath: useMemo(() => basePath, [basePath]),
        routes: useMemo(() => routes, [routes]),
        menus: useMemo(() => menus, [menus]),
        names: useMemo(() => names, [names]),
        setConfig: useCallback(setConfig, [setConfig]),
    };
};
export const useMenus = () => {
    const { menus } = useContext(RouterContext);
    return useMemo(() => menus, [menus]);
};
export const useAntdMenus = () => {
    const { menus } = useContext(RouterContext);
    const antdMenus = useMemo(() => getAntdMenus(menus), [menus]);
    return antdMenus;
};
export const useLocationPath = () => {
    const { basePath } = useAppRouter();
    const [pathname, setPathname] = useState(basePath);
    const location = useLocation();
    useEffect(() => setPathname(location.pathname), [location.pathname]);
    return {
        basePath,
        pathname,
    };
};
