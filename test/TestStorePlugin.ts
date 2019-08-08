import { StorePlugin, StorePluginValueChangeEvent } from '../src/StorePlugin';

class TestStorePlugin implements StorePlugin {

    private beforeCallbacks: Array<((event: StorePluginValueChangeEvent<any>) => void)> = [];
    private afterCallbacks: Array<((event: StorePluginValueChangeEvent<any>) => void)> = [];

    public registerBeforeCallback(callback: ((event: StorePluginValueChangeEvent<any>) => void)): void {
        this.beforeCallbacks.push(callback);
    }

    public registerAfterCallback(callback: ((event: StorePluginValueChangeEvent<any>) => void)): void {
        this.afterCallbacks.push(callback);
    }

    public beforeValueChange(event: StorePluginValueChangeEvent<any>): void {
        this.beforeCallbacks.forEach((cb) => {
            cb(event);
        });
    }

    public afterValueChange(event: StorePluginValueChangeEvent<any>): void {
        this.afterCallbacks.forEach((cb) => {
            cb(event);
        });
    }
}

const TestStorePluginInstance: TestStorePlugin = new TestStorePlugin();

export default TestStorePluginInstance;
