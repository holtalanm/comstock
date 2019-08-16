import { shallowMount } from '@vue/test-utils';
import BarDisplay from '../../test/BarDisplay';
import BarInput from '../../test/BarInput';
import FooStore from '../../test/FooStore';
import TestStorePlugin from '../../test/TestStorePlugin';
import { StorePluginValueChangeEvent } from '../StorePlugin';

describe('Store Singleton', () => {
    test('onStoreInitialized fires on store construction', () => {
        expect(FooStore.bar).toEqual('zip');
        expect(FooStore.baz).toEqual('zap');
        expect(FooStore.zapArr).toEqual(['zark', 'farfegnuggen']);
    });

    test('getState returns copy of internal state', () => {
        const storeState = FooStore.getState();
        expect(storeState['bar']).toEqual('zip');
        expect(storeState['baz']).toEqual('zap');
        expect(storeState['zapArr']).toEqual(['zark', 'farfegnuggen']);
    });

    test('text updates across components when state updated', () => {
        FooStore.resetState();
        const displayWrapper = shallowMount(BarDisplay);
        const inputWrapper = shallowMount(BarInput);
        const display: BarDisplay = displayWrapper.vm as any as BarDisplay;
        const input: BarInput = inputWrapper.vm as any as BarInput;
        const f = FooStore;
        const initialBar = 'bar';
        const endBar = 'testing';
        expect(display.bar).toEqual(initialBar);
        expect(displayWrapper.text()).toEqual(initialBar);
        expect(input.bar).toEqual(initialBar);
        expect((inputWrapper.element as HTMLInputElement).value).toEqual(initialBar);
        input.bar = endBar;
        expect(displayWrapper.text()).toEqual(endBar);
        expect(display.bar).toEqual(endBar);
        expect(f.bar).toEqual(endBar);
        expect((inputWrapper.element as HTMLInputElement).value).toEqual(endBar);
    });

    test('resetState resets the state back to the default values', () => {
        const displayWrapper = shallowMount(BarDisplay);
        const inputWrapper = shallowMount(BarInput);
        const display: BarDisplay = displayWrapper.vm as any as BarDisplay;
        const input: BarInput = inputWrapper.vm as any as BarInput;
        const initialBar = 'bar';
        const endBar = 'testing';
        input.bar = endBar;
        expect(display.bar).toEqual(endBar);
        expect(FooStore.bar).toEqual(endBar);
        expect(displayWrapper.text()).toEqual(endBar);
        expect((inputWrapper.element as HTMLInputElement).value).toEqual(endBar);

        FooStore.resetState();
        expect(display.bar).toEqual(initialBar);
        expect(input.bar).toEqual(initialBar);
        expect(displayWrapper.text()).toEqual(initialBar);
        expect((inputWrapper.element as HTMLInputElement).value).toEqual(initialBar);
    });

    test('plugin beforeEvent fires as expected', () => {
        const beforeEvents: Array<StorePluginValueChangeEvent<any>> = [];
        TestStorePlugin.registerBeforeCallback((evt) => {
            beforeEvents.push(evt);
        });

        FooStore.resetState();

        const newValue = 'bahahahaha';

        FooStore.bar = newValue;

        const expected: StorePluginValueChangeEvent<any> = {
            store: FooStore,
            property: 'bar',
            newValue,
            oldValue: 'bar',
        };

        expect(!!beforeEvents.find((evt) => {
            return evt.newValue === expected.newValue &&
                evt.oldValue === expected.oldValue &&
                evt.property === expected.property;

        })).toEqual(true);
    });

    test('plugin after event fires as expected', () => {
        const afterEvents: Array<StorePluginValueChangeEvent<any>> = [];
        TestStorePlugin.registerAfterCallback((evt) => {
            afterEvents.push(evt);
        });

        FooStore.resetState();

        const newValue = 'bahahahaha';

        FooStore.bar = newValue;

        const expected: StorePluginValueChangeEvent<any> = {
            store: FooStore,
            property: 'bar',
            newValue,
            oldValue: 'bar',
        };

        expect(!!afterEvents.find((evt) => {
            return evt.newValue === expected.newValue &&
                evt.oldValue === expected.oldValue &&
                evt.property === expected.property;

        })).toEqual(true);
    });
});
