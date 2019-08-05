import { Component, Vue } from 'vue-property-decorator';
import FooStore from './FooStore';

@Component({
    template: `
        <input v-model="bar" class="bar-input"/>
    `,
})
export default class BarInput extends Vue {
    public get bar(): string {
        return FooStore.bar;
    }
    public set bar(value: string) {
        FooStore.bar = value;
    }
}

