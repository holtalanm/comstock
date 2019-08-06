import Vue from 'vue';
import { Store, StoreStateOptions, StorePluginValueChangeEvent } from './types/comstock';


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
                this.plugins.forEach((plugin) => {
                    if (plugin.beforeValueChange !== undefined) {
                        plugin.beforeValueChange(pluginEvent);
                    }
                });

                Vue.set(this.vueInternal._data.$$state, propertyKey, value);

                this.plugins.forEach((plugin) => {
                    if (plugin.afterValueChange !== undefined) {
                        plugin.afterValueChange(pluginEvent);
                    }
                });
            },
        });
    };
}
