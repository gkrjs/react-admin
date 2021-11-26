import type { FC } from 'react';

import { useAntdMenus } from '@/components/Router';

const Dashboard: FC = () => {
    const antdMenus = useAntdMenus();
    console.log(antdMenus);
    return <div>Dashboard</div>;
};
export default Dashboard;
