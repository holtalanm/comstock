import { Store, StorePlugin, StorePluginValueChangeEvent } from '../index';

class TestStorePlugin implements StorePlugin {

    private beforeCallbacks: Array<((event: StorePluginValueChangeEvent<any>) => void)> = [];
    private afterCallbacks: Array<((event: StorePluginValueChangeEvent<any>) => void)> = [];

    public registerBeforeCallback(callback: ((event: StorePluginValueChangeEvent<any>) => void)): void {
        this.beforeCallbacks.push(callback);
    }

    public registerAfterCallback(callback: ((event: StorePluginValueChangeEvent<any>) => void)): void {
        this.afterCallbacks.push(callback);
    }

    public async beforeValueChange(event: StorePluginValueChangeEvent<any>): Promise<void> {
        this.beforeCallbacks.forEach((cb) => {
            cb(event);
        });
    }

    public async afterValueChange(event: StorePluginValueChangeEvent<any>): Promise<void> {
        this.afterCallbacks.forEach((cb) => {
            cb(event);
        });
    }

    public async onStoreInitialized(store: Store): Promise<void> {
        store.setState({
            bar: 'zip',
            baz: 'zap',
            zapArr: ['zark', 'farfegnuggen'],
        });
    }
}

const TestStorePluginInstance: TestStorePlugin = new TestStorePlugin();

export default TestStorePluginInstance;
