import Vue, { WatchOptions } from 'vue';

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