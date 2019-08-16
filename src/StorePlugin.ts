import Store from './Store';

/**
 * Event fired by the Store on a value change.
 * This could have been fired before or after the change.
 */
export interface StorePluginValueChangeEvent<V> {
    store: Store;
    property: string;
    oldValue: V;
    newValue: V;
}

/**
 * A plugin for Comstock.  Can be used to provide additional functionality to a Store,
 * such as storing the state into localStorage.
 */
export interface StorePlugin {
    /**
     * Method called when the store this plugin is registered to is first constructed.
     * This is a good time for the plugin to set an initial state into the store or something.
     *
     * @param store the Store object that was initialized
     */
    onStoreInitialized?(store: Store): Promise<void>;
    /**
     * Method called when a value is about to be changed within the store state.
     *
     * @param event the value change event
     */
    beforeValueChange?(event: StorePluginValueChangeEvent<any>): Promise<void>;
    /**
     * Method called after a value is changed within the store state.
     *
     * @param event the value change event
     */
    afterValueChange?(event: StorePluginValueChangeEvent<any>): Promise<void>;
}
