import Store from './Store';

export interface StorePluginValueChangeEvent<V> {
    store: Store;
    property: string;
    oldValue: V;
    newValue: V;
}

export interface StorePlugin {
    beforeValueChange?(event: StorePluginValueChangeEvent<any>): void;
    afterValueChange?(event: StorePluginValueChangeEvent<any>): void;
}