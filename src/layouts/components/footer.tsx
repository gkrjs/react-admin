import { Button } from 'antd';
import type { FC } from 'react';

import { useAddTable } from '@/components/Storage/hooks';

export const AppFooter: FC = () => {
    const addTable = useAddTable();
    console.log('footer');
    return (
        <footer>
            <Button onClick={() => addTable({ name: 'hhh' })}>Logo</Button>
            @CopyRight
        </footer>
    );
};
