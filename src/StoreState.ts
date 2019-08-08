import Vue from 'vue';
import Store from './Store';
import { StorePluginValueChangeEvent } from './StorePlugin';

export interface StoreStateOptions<T> {
    defaultValue: T;
}

export default function StoreState<T>(options: StoreStateOptions<T>) {
    return <S extends Store>(target: S, propertyKey: string) => {
        Object.defineProperty(target, propertyKey, {
            get(this: S): T {
                if (!(propertyKey in this.defaultState)) {
                    this.defaultState[propertyKey] = options.defaultValue;
                }
                if (!(propertyKey in this.vueInternal._data.$$state)) {
                    Vue.set(this.vueInternal._data.$$state, propertyKey, options.defaultValue);
                }
                return this.vueInternal._data.$$state[propertyKey] as T;
            },
            set(this: S, value: T) {
                const oldValue = this.vueInternal._data.$$state[propertyKey];
                const pluginEvent: StorePluginValueChangeEvent<T> = {
                    store: this as Store,
                    property: propertyKey,
                    oldValue,
                    newValue: value,
                };
                this.fireBeforeValueChangeEvent(pluginEvent);

                Vue.set(this.vueInternal._data.$$state, propertyKey, value);

                this.fireAfterValueChangeEvent(pluginEvent);
            },
        });
    };
}
