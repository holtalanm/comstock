import Vue from 'vue';
import StoreImpl from '../Store';

export declare interface StoreStateOptions<T> {
    defaultValue: T;
}

export declare class Store {
    [key: string]: any;
    protected readonly defaultState: any;
    protected readonly vueInternal: Vue;

    constructor(options?: StoreOptions);

    public fireBeforeValueChangeEvent(event: StorePluginValueChangeEvent<any>): void;
    public fireAfterValueChangeEvent(event: StorePluginValueChangeEvent<any>): void;
} 

export declare function StoreState<T>(
    options: StoreStateOptions<T>
): <S extends Store>(target: S, propertyKey: string) => void;

export declare interface StorePluginValueChangeEvent<V> {
    store: Store;
    property: string;
    oldValue: V;
    newValue: V;
}

export declare interface StorePlugin {
    beforeValueChange?(event: StorePluginValueChangeEvent<any>): void;
    afterValueChange?(event: StorePluginValueChangeEvent<any>): void;
}

export declare interface StoreOptions {
    plugins?: StorePlugin[];
}
