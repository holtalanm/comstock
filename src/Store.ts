import Vue from 'vue';
import { StorePlugin, StorePluginValueChangeEvent } from './StorePlugin';

export interface StoreOptions {
    plugins?: StorePlugin[];
}


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
    }

    public resetState() {
        Object.keys(this.defaultState).forEach((prop) => {
            this[prop] = this.defaultState[prop];
        });
    }

    public fireBeforeValueChangeEvent(event: StorePluginValueChangeEvent<any>): void {
        this.plugins.forEach((plugin) => {
            if (plugin.beforeValueChange !== undefined) {
                plugin.beforeValueChange(event);
            }
        });
    }

    public fireAfterValueChangeEvent(event: StorePluginValueChangeEvent<any>): void {
        this.plugins.forEach((plugin) => {
            if (plugin.afterValueChange !== undefined) {
                plugin.afterValueChange(event);
            }
        });
    }
}
