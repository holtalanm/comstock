import { shallowMount } from '@vue/test-utils';
import BarDisplay from '../../test/BarDisplay';
import BarInput from '../../test/BarInput';
import FooStore from '../../test/FooStore';

describe('Store Singleton', () => {
    test('text updates across components when state updated', () => {
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
});
