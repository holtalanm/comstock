import Vue from 'vue';
import StoreImpl from '../Store';

/**
 * Options for StoreState.  I'm expecting to have more than one option sometime in the future, 
 * otherwise having an intermediary interface would seem silly. 
 */
export declare interface StoreStateOptions<T> {
    /**
     * The default value for the state property.  
     * This is the value that the property will be set to when the property is accessed for the first time.
     * It is also the value that the property will be set to on Store.resetState calls.
     */
    defaultValue: T;
}

/**
 * A store within Comstock.  This object will be responsible for keeping track of the state, 
 * and firing events to plugins when required.
 */
export declare class Store {
    [key: string]: any;
    protected readonly defaultState: any;
    protected readonly vueInternal: Vue;

    constructor(options?: StoreOptions);

    /**
     * Get a copy of the current state within the Store.
     * This is mostly useful for plugins to get a snapshot of the store state values.
     * 
     * @returns a copy of the store's internal state.
     */
    public getState(): any;
    /**
     * Set properties within the Store that exist on the given newState object.
     * 
     * This does not clear out values from the Store state that do not exist within the newState object,
     * so this method can be used to apply new values to a portion of the overall state.
     * 
     * @param newState an object containing new state to set within the store
     */
    public setState(newState: any): void;
    /**
     * Reset the known state properties to their default values.
     */
    public resetState(): void;
    /**
     * Fire a store value change event.  This event is fired before the value is actually changed within the store.
     * 
     * @param event the event to fire
     */
    public fireBeforeValueChangeEvent(event: StorePluginValueChangeEvent<any>): void;
    /**
     * Fire a store value change event.  This event is fired after the value is changed within the store.
     * 
     * @param event the event to fire
     */
    public fireAfterValueChangeEvent(event: StorePluginValueChangeEvent<any>): void;
} 

/**
 * Decorator for defining a property within the Store implementation that should be tracked as a part of the Store's state.
 * 
 * @param options options object.  See interface documentation.
 */
export declare function StoreState<T>(
    options: StoreStateOptions<T>
): <S extends Store>(target: S, propertyKey: string) => void;

/**
 * Event fired by the Store on a value change.
 * This could have been fired before or after the change.
 */
export declare interface StorePluginValueChangeEvent<V> {
    store: Store;
    property: string;
    oldValue: V;
    newValue: V;
}

/**
 * A plugin for Comstock.  Can be used to provide additional functionality to a Store, 
 * such as storing the state into localStorage. 
 */
export declare interface StorePlugin {
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

/**
 * Options to be passed into Store constructor.
 * Once again, I'm expecting the number of properties here to expand in the future.
 * 
 * If they dont, well, now don't I feel silly.
 */
export declare interface StoreOptions {
    plugins?: StorePlugin[];
}
