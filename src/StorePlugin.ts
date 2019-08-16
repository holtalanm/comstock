import Store from './Store';

export interface StorePluginValueChangeEvent<V> {
    store: Store;
    property: string;
    oldValue: V;
    newValue: V;
}

export interface StorePlugin {
    onStoreInitialized?(store: Store): Promise<void>;
    beforeValueChange?(event: StorePluginValueChangeEvent<any>): Promise<void>;
    afterValueChange?(event: StorePluginValueChangeEvent<any>): Promise<void>;
}
