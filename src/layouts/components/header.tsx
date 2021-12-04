import type { FC } from 'react';

import { useAddTable } from '@/components/Storage/hooks';

export const AppHeader: FC = () => {
    const addTable = useAddTable();
    console.log('header');
    return (
        <header>
            <div onClick={() => addTable({ name: 'ddd' })}>Logo</div>
            <div>breadcrumbs</div>
            <div>user menus</div>
        </header>
    );
};
