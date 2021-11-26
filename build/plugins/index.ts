import react from '@vitejs/plugin-react';
import { PluginOption } from 'vite';

import { configAntdPlugin } from './antd';

export function getPlugins(isBuild: boolean) {
    const vitePlugins: (PluginOption | PluginOption[])[] = [];
    vitePlugins.push(react());
    if (isBuild) vitePlugins.push(configAntdPlugin(isBuild));
    return vitePlugins;
}
