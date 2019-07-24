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
}
