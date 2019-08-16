import Vue from 'vue';
import { StorePlugin, StorePluginValueChangeEvent } from './StorePlugin';

declare module 'vue/types/vue' {
    interface Vue {
        _data: any;
    }
}


declare module 'vue/types/options' {
    interface WatchOptions {
        sync: boolean;
    }
}

/**
 * Options to be passed into Store constructor.
 * Once again, I'm expecting the number of properties here to expand in the future.
 *
 * If they dont, well, now don't I feel silly.
 */
export interface StoreOptions {
    plugins?: StorePlugin[];
}

/**
 * A store within Comstock.  This object will be responsible for keeping track of the state,
 * and firing events to plugins when required.
 */
export default class Store {
    [key: string]: any;
    protected readonly defaultState: any = {};
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
        this.vueInternal.$watch(function() { return this._data.$$state; }, () => {
            // Do Nothing
        }, { deep: true, sync: true });

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
        Object.keys(this.vueInternal._data.$$state).forEach((prop) => {
            stateCopy[prop] = this.vueInternal._data.$$state[prop];
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

    private onInitialize(): void {
        this.plugins.forEach((plugin) => {
            if (plugin.onStoreInitialized !== undefined) {
                plugin.onStoreInitialized(this);
            }
        });
    }
}
