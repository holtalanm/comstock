import { shallowMount } from '@vue/test-utils';
import BarDisplay from '../../test/BarDisplay';
import BarInput from '../../test/BarInput';
import FooStore from '../../test/FooStore';
import TestStorePlugin from '../../test/TestStorePlugin';
import { StorePluginValueChangeEvent } from '../../index';

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
            converter: {
                toJson: JSON.stringify,
                fromJson: JSON.parse,
            },
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
            converter: {
                toJson: JSON.stringify,
                fromJson: JSON.parse,
            },
            newValue,
            oldValue: 'bar',
        };

        expect(!!afterEvents.find((evt) => {
            return evt.newValue === expected.newValue &&
                evt.oldValue === expected.oldValue &&
                evt.property === expected.property;

        })).toEqual(true);
    });

    test('property without converter toJson defined defaults to JSON.stringify', () => {
        const afterEvents: Array<StorePluginValueChangeEvent<any>> = [];
        TestStorePlugin.registerAfterCallback((evt) => {
            afterEvents.push(evt);
        });

        FooStore.resetState();

        FooStore.bar = 'boogabooga';

        const event = afterEvents.find((evt) => {
            return evt.property === 'bar' &&
                evt.oldValue === 'bar' &&
                evt.newValue === FooStore.bar;
        });

        expect(event).toBeDefined();
        expect(event).toBeTruthy();

        if (!!event) {
            const converter = event.converter;

            const toStringResult = converter.toJson(FooStore.bar);
            expect(toStringResult).toEqual(JSON.stringify(FooStore.bar));
        }
    });

    test('property without converter fromJson defined defaults to JSON.parse', () => {
        const afterEvents: Array<StorePluginValueChangeEvent<any>> = [];
        TestStorePlugin.registerAfterCallback((evt) => {
            afterEvents.push(evt);
        });

        FooStore.resetState();

        FooStore.bar = 'boogabooga';

        const event = afterEvents.find((evt) => {
            return evt.property === 'bar' &&
                evt.oldValue === 'bar' &&
                evt.newValue === FooStore.bar;
        });

        expect(event).toBeDefined();
        expect(event).toBeTruthy();

        if (!!event) {
            const converter = event.converter;

            const fromStringResult = converter.fromJson(converter.toJson(FooStore.bar));
            expect(fromStringResult).toEqual(JSON.parse(converter.toJson(FooStore.bar)));
        }
    });

    test('property with converter toJson defined uses that for converter', () => {
        const afterEvents: Array<StorePluginValueChangeEvent<any>> = [];
        TestStorePlugin.registerAfterCallback((evt) => {
            afterEvents.push(evt);
        });

        FooStore.resetState();

        FooStore.baz = 'boogabooga';

        const event = afterEvents.find((evt) => {
            return evt.property === 'baz' &&
                evt.oldValue === 'baz' &&
                evt.newValue === FooStore.baz;
        });

        expect(event).toBeDefined();
        expect(event).toBeTruthy();

        if (!!event) {
            const converter = event.converter;

            const toStringResult = event.converter.toJson(FooStore.baz);
            expect(toStringResult).toEqual(`${FooStore.baz}_toString`);
        }
    });

    test('property with conveter fromJson defined uses that for converter', () => {
        const afterEvents: Array<StorePluginValueChangeEvent<any>> = [];
        TestStorePlugin.registerAfterCallback((evt) => {
            afterEvents.push(evt);
        });

        FooStore.resetState();

        FooStore.baz = 'boogabooga';

        const event = afterEvents.find((evt) => {
            return evt.property === 'baz' &&
                evt.oldValue === 'baz' &&
                evt.newValue === FooStore.baz;
        });

        expect(event).toBeDefined();
        expect(event).toBeTruthy();

        if (!!event) {
            const converter = event.converter;

            const fromStringResult = event.converter.fromJson(`${FooStore.baz}_toString`);
            expect(fromStringResult).toEqual(FooStore.baz);
        }
    });
});
