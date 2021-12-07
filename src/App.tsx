import './App.css';
import { useUserInit } from './components/Auth';

import { AppRouter } from './components/Router';
import { DDD, useRouter } from './components/Routing';

import { useStorageInit } from './components/Storage';
import { routing } from './config/routeConfig';

import { router as routerConfig } from './config/router';

const App = () => {
    // useConfigInit(config);
    useStorageInit();
    useUserInit('/user/info');

    const { inited } = useRouter(routing);
    return (
        inited && (
            <DDD>
                <AppRouter config={routerConfig} />
            </DDD>
        )
    );
};

export default App;
