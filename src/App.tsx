import './App.css';
import { AppRouter } from './components/Router';
import { Storage } from './components/Storage';
import { router as routerConfig } from './config/router';

const App = () => {
    return (
        <Storage>
            <AppRouter config={routerConfig} />
        </Storage>
    );
};

export default App;
