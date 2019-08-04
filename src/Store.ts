import Vue from 'vue';

export default class Store {
    [key: string]: any;
    protected readonly vueInternal: Vue = new Vue({
        data() {
            return {
                $$state: {},
            };
        },
    });

    constructor() {
        this.vueInternal.$watch(function() { return this._data.$$state; }, () => {
            // Do Nothing
        }, { deep: true, sync: true });
    }
}
