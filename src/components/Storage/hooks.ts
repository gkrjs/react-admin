import { dropInstance } from 'localforage';
import { createContext, useContext } from 'react';

import { DbActionType } from './constants';

import type {
    DbConfig,
    StorageConfig,
    StorageContextType,
    StorageState,
    TableConfig,
} from './types';

export const StorageConfigContext = createContext<StorageConfig>({});
export const StorageStateContext = createContext<StorageContextType | null>(null);
const useGetDb = () => {
    const context = useContext(StorageStateContext);
    return (name?: string) => {
        const state = context?.state;
        if (!state) return undefined;
        const dbname = name ?? state.default;
        return state.dbs.find((db) => db.name === dbname);
    };
};
const useDeleteDb = () => {
    const context = useContext(StorageStateContext);
    const getDb = useGetDb();
    return async (name: string) => {
        const dispatch = context?.dispatch;
        if (dispatch) {
            const db = getDb(name);
            if (db) {
                await Promise.all(
                    db.tables.map(async (t) => dropInstance({ name: db.name, storeName: t.name })),
                );
            }
            dispatch({ type: DbActionType.DELETE_DB, name });
        }
    };
};
const useGetTable = () => {
    const context = useContext(StorageStateContext);
    return (name?: string, dbname?: string) => {
        const state = context?.state;
        if (!state) return undefined;
        const dname = dbname ?? state.default;
        const db = state.dbs.find((d) => d.name === dname);
        return (
            db &&
            db.tables.find((t) => {
                const tname = name ?? db.defaultTable;
                return t.name === tname;
            })
        );
    };
};
const useGetStore = () => {
    const context = useContext(StorageStateContext);
    const getTable = useGetTable();
    return (tablename?: string, dbname?: string) => {
        if (!context?.state) return undefined;
        const table = getTable(tablename, dbname);
        return table && table.instance;
    };
};
const useDeleteTable = () => {
    const context = useContext(StorageStateContext);
    const getTable = useGetTable();
    return async (name: string, dbname?: string) => {
        const state = context?.state;
        const dispatch = context?.dispatch;
        if (state && dispatch) {
            const dname = dbname ?? state.default;
            dispatch({ type: DbActionType.DELETE_TABLE, name, dbname: dname });
            if (getTable(name, dbname)) await dropInstance({ name: dname, storeName: name });
        }
    };
};
export const useStorage = () => {
    const context = useContext(StorageStateContext);
    const state = context?.state as StorageState;
    if (!state) {
        throw new Error('Storage not be configed,please use <Storage> wrapper your component!');
    }
    const getDb = useGetDb();
    const deleteDb = useDeleteDb();
    const getStore = useGetStore();
    const getTable = useGetTable();
    const deleteTable = useDeleteTable();
    const dispatch = context?.dispatch;
    const addDb = (options: DbConfig) =>
        dispatch && dispatch({ type: DbActionType.ADD_DB, config: options });
    const setDefaultDb = (name: string) =>
        dispatch && dispatch({ type: DbActionType.SET_DEFAULT_DB, name });
    const addTable = (options: TableConfig, dbname?: string) =>
        dispatch && dispatch({ type: DbActionType.ADD_TABLE, config: options, dbname });
    return {
        storeState: state,
        addDb,
        setDefaultDb,
        deleteDb,
        getDb,
        addTable,
        getTable,
        deleteTable,
        getStore,
    };
};
