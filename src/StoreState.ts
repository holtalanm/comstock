import Vue from 'vue';
import Store from './Store';
import { StorePluginValueChangeEvent } from './StorePlugin';

/**
 * Options for StoreState.  I'm expecting to have more than one option sometime in the future,
 * otherwise having an intermediary interface would seem silly.
 */
export interface StoreStateOptions<T> {
    /**
     * The default value for the state property.
     * This is the value that the property will be set to when the property is accessed for the first time.
     * It is also the value that the property will be set to on Store.resetState calls.
     */
    defaultValue: T;

    /**
     * Function for converting the value of this state property to a string.
     * By default, JSON.stringify is used if no function is given.
     *
     * This probably is only needed if you have a complex data structure,
     * or are using TypeScript classes as state properties.
     */
    toJson?: (value: T) => string;
    /**
     * Function for converting a string to the value of this state property.
     * By default, JSON.parse is used if no function is given.
     *
     * This probably is only needed if you have a complex data structure,
     * or are using TypeScript classes as state properties.
     */
    fromJson?: (str: string) => T;
}

/**
 * Decorator for defining a property within the Store implementation
 * that should be tracked as a part of the Store's state.
 *
 * @param options options object.  See interface documentation.
 */
export default function StoreState<T>(options: StoreStateOptions<T>) {
    return <S extends Store>(target: S, propertyKey: string) => {

        Object.defineProperty(target, propertyKey, {
            get(this: S): T {
                this.setupPropertyIfNeeded(propertyKey, options);
                return (this.vueInternal as any)._data.$$state[propertyKey] as T;
            },
            set(this: S, value: T) {
                this.setupPropertyIfNeeded(propertyKey, options);
                const oldValue = (this.vueInternal as any)._data.$$state[propertyKey];
                const pluginEvent: StorePluginValueChangeEvent<T> = {
                    store: this as Store,
                    property: propertyKey,
                    converter: this.converters[propertyKey],
                    oldValue,
                    newValue: value,
                };
                this.fireBeforeValueChangeEvent(pluginEvent);

                Vue.set((this.vueInternal as any)._data.$$state, propertyKey, value);

                this.fireAfterValueChangeEvent(pluginEvent);
            },
        });
    };
}
