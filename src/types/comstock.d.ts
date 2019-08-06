import Vue from 'vue';

export interface StoreStateOptions<T> {
    defaultValue: T;
}

export declare class Store {
    [key: string]: any;
    protected readonly defaultState: any;
    protected readonly vueInternal: Vue;
    protected readonly plugins: StorePlugin[];

    constructor(options?: StoreOptions);
} 

export declare function StoreState<T>(
    options: StoreStateOptions<T>
): <S extends Store>(target: S, propertyKey: string) => void;

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

export interface StoreOptions {
    plugins?: StorePlugin[];
}
