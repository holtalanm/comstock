import Vue from 'vue';
import Store from './Store';

export interface StoreStateOptions<T> {
    defaultValue: T;
}

export default function StoreState<T>(options: StoreStateOptions<T>) {
    return <S extends Store>(target: S, propertyKey: string) => {
        Object.defineProperty(target, propertyKey, {
            get(this: S): T {
                if (!(propertyKey in this.vueInternal._data.$$state)) {
                    Vue.set(this.vueInternal._data.$$state, propertyKey, options.defaultValue);
                }
                return this.vueInternal._data.$$state[propertyKey] as T;
            },
            set(this: S, value: T) {
                Vue.set(this.vueInternal._data.$$state, propertyKey, value);
            },
        });
    };
}
