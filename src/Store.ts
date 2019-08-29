import Vue, {WatchOptions} from 'vue';
import { StorePlugin, StorePluginValueChangeEvent } from './StorePlugin';
import {StoreStateOptions} from '..';

/**
 * Options to be passed into Store constructor.
 * Once again, I'm expecting the number of properties here to expand in the future.
 *
 * If they dont, well, now don't I feel silly.
 */
export interface StoreOptions {
    plugins?: StorePlugin[];
}

export interface Converter<T> {
    toJson: (value: T) => string;
    fromJson: (value: string) => T;
}

/**
 * A store within Comstock.  This object will be responsible for keeping track of the state,
 * and firing events to plugins when required.
 */
export default class Store {
    [key: string]: any;
    protected readonly defaultState: any = {};
    protected readonly converters: { [id: string]: Converter<any> } = {};
    protected readonly vueInternal: Vue = new Vue({
        data() {
            return {
                $$state: {},
            };
        },
    });
    private readonly plugins: StorePlugin[] = [];

    constructor(options?: StoreOptions) {
        if (options !== undefined) {
            if (options.plugins !== undefined) {
                this.plugins = [...options.plugins];
            }
        }
        this.vueInternal.$watch(function() { return (this as any)._data.$$state; }, () => {
            // Do Nothing
        }, { deep: true, sync: true } as WatchOptions);

        this.onInitialize();
    }

    /**
     * Get a copy of the current state within the Store.
     * This is mostly useful for plugins to get a snapshot of the store state values.
     *
     * @returns a copy of the store's internal state.
     */
    public getState(): any {
        const stateCopy: any = {};
        Object.keys((this.vueInternal as any)._data.$$state).forEach((prop) => {
            stateCopy[prop] = (this.vueInternal as any)._data.$$state[prop];
        });
        return stateCopy;
    }

    /**
     * Set properties within the Store that exist on the given newState object.
     *
     * This does not clear out values from the Store state that do not exist within the newState object,
     * so this method can be used to apply new values to a portion of the overall state.
     *
     * @param newState an object containing new state to set within the store
     */
    public setState(newState: any) {
        Object.keys(newState).forEach((prop) => {
            this[prop] = newState[prop];
        });
    }

    /**
     * Reset the known state properties to their default values.
     */
    public resetState() {
        this.setState(this.defaultState);
    }

    /**
     * Fire a store value change event.  This event is fired before the value is actually changed within the store.
     *
     * @param event the event to fire
     */
    public fireBeforeValueChangeEvent(event: StorePluginValueChangeEvent<any>): void {
        this.plugins.forEach((plugin) => {
            if (plugin.beforeValueChange !== undefined) {
                plugin.beforeValueChange(event);
            }
        });
    }

    /**
     * Fire a store value change event.  This event is fired after the value is changed within the store.
     *
     * @param event the event to fire
     */
    public fireAfterValueChangeEvent(event: StorePluginValueChangeEvent<any>): void {
        this.plugins.forEach((plugin) => {
            if (plugin.afterValueChange !== undefined) {
                plugin.afterValueChange(event);
            }
        });
    }

    protected setupPropertyIfNeeded(propertyName: string, options: StoreStateOptions<any>) {
        if (!(propertyName in this.defaultState)) {
            this.defaultState[propertyName] = options.defaultValue;
        }
        if (!(propertyName in (this.vueInternal as any)._data.$$state)) {
            Vue.set((this.vueInternal as any)._data.$$state, propertyName, options.defaultValue);
        }
        if (!(propertyName in this.converters)) {
            this.converters[propertyName] = {
                toJson: options.toJson || JSON.stringify,
                fromJson: options.fromJson || JSON.parse,
            };
        }
    }

    private onInitialize(): void {
        this.plugins.forEach((plugin) => {
            if (plugin.onStoreInitialized !== undefined) {
                plugin.onStoreInitialized(this);
            }
        });
    }
}
