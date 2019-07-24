import Vue, { PluginObject, PluginFunction, ComponentOptions } from 'vue';
import Store from './Store';

// tslint:disable-next-line: variable-name
function applyMixin<S extends Store>(_vue: typeof Vue, store: S) {
    const version = Number(_vue.version.split('.')[0]);

    if (version >= 2) {
        const mixinObj: ComponentOptions<any> = {
            beforeCreate() {
                this.$store = store;
            },
        };
        _vue.mixin(mixinObj);
    } else {
        // Not compatible.  Seriously, why use Vue 1.x anyways?
        // tslint:disable-next-line: no-console
        console.error(`Comstock not compatible with Vue version 1.x`);
    }
}

export default class RootStore extends Store implements PluginObject<any> {
    private vueGlobal: typeof Vue | null = null;

    // tslint:disable-next-line: variable-name
    public install: PluginFunction<any> = (_vue) => {
        if (this.vueGlobal && _vue === this.vueGlobal) {
            if (process.env.NODE_ENV !== 'production') {
                // tslint:disable-next-line: no-console
                console.error(
                    `Comstock already installed.  Vue.use(${typeof this}) should be called only once.`,
                );
            }
            return;
        }
        this.vueGlobal = _vue;
        applyMixin(_vue, this);
    }
}
