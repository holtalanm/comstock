import Store from './Store';

export interface StorePluginValueChangeEvent<V> {
    store: Store;
    property: string;
    oldValue: V;
    newValue: V;
}

export interface StorePlugin {
    onStoreInitialized?(store: Store): void;
    beforeValueChange?(event: StorePluginValueChangeEvent<any>): void;
    afterValueChange?(event: StorePluginValueChangeEvent<any>): void;
}