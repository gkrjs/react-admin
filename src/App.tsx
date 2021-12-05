import './App.css';
import { useInitUser } from './components/Auth';
import { useInitConfig } from './components/Config';
import { AppRouter } from './components/Router';
import { useInitRouter } from './components/Routing';
import { useInitStorage } from './components/Storage';

import { config } from './config/app';
import { routing } from './config/routeConfig';

import { router as routerConfig } from './config/router';

const App = () => {
    useInitConfig(config);
    useInitStorage();
    useInitUser();
    useInitRouter(routing);
    return <AppRouter config={routerConfig} />;
};

export default App;
