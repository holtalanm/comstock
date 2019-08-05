import { Store, StoreState } from '../index';

class FooStore extends Store {
    private static pInstance: FooStore | null = null;

    @StoreState({ defaultValue: 'bar' })
    public bar!: string;

    @StoreState({ defaultValue: 'baz' })
    public baz!: string;

    @StoreState({ defaultValue: [] })
    public zapArr!: string[];

    private constructor() {
        super();
    }

    static get instance(): FooStore {
        if (FooStore.pInstance == null) {
            FooStore.pInstance = new FooStore();
        }

        return FooStore.pInstance;
    }
}

export default FooStore.instance;
