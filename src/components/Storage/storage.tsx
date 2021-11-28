import { FC, useContext, useReducer } from 'react';

import { StorageConfigContext, StorageStateContext } from './hooks';
import type { StorageConfig } from './types';
import { storageReducer, initStorage } from './utils';

const StateProvider: FC = ({ children }) => {
    const config = useContext(StorageConfigContext);
    const [state, dispatch] = useReducer(storageReducer, config, initStorage);
    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <StorageStateContext.Provider value={{ state, dispatch }}>
            {children}
        </StorageStateContext.Provider>
    );
};
const Storage: FC<{ config?: StorageConfig }> = ({ config = {}, children }) => (
    <StorageConfigContext.Provider value={config}>
        <StateProvider>{children}</StateProvider>
    </StorageConfigContext.Provider>
);

export default Storage;
