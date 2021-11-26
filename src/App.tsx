import './App.css';
import { AppRouter } from './components/Router';
import { router as routerConfig } from './config/router';

const App = () => {
    return <AppRouter config={routerConfig} />;
};

export default App;
