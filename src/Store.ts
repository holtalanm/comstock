import Vue from 'vue';
import { StoreOptions, StorePlugin } from './types/comstock';

export default class Store {
    [key: string]: any;
    protected readonly plugins: StorePlugin[] = [];
    protected readonly defaultState: any = {};
    protected readonly vueInternal: Vue = new Vue({
        data() {
            return {
                $$state: {},
            };
        },
    });

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
}
