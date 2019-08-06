import Vue from 'vue';

export interface StoreStateOptions<T> {
    defaultValue: T;
}

export declare class Store {
    [key: string]: any;
    protected readonly defaultState: any;
    protected readonly vueInternal: Vue
} 

export declare function StoreState<T>(
    options: StoreStateOptions<T>
): <S extends Store>(target: S, propertyKey: string) => void;
