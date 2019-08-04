import Vue, { PluginObject, PluginFunction } from 'vue';

export interface StoreStateOptions<T> {
    defaultValue: T;
}

export declare class Store {
    [key: string]: any;
    protected readonly vueInternal: Vue
} 

export declare function StoreState<T>(
    options: StoreStateOptions<T>
): <S extends Store>(target: S, propertyKey: string) => void;

export declare class RootStore extends Store implements PluginObject<any> {
    private vueGlobal: typeof Vue | null;
    public install: PluginFunction<any>;
}