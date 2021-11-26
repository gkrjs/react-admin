import ReactDOM from 'react-dom';

import App from './App';

if (import.meta.env.DEV) {
    import('antd/dist/antd.less');
}
import('./App.css');
ReactDOM.render(
    // <React.StrictMode>
    <App />,
    // </React.StrictMode>,
    document.getElementById('root'),
);
