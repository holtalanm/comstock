import { Component, Vue } from 'vue-property-decorator';
import FooStore from './FooStore';

@Component({
    template: `
        <div class="bar-value">{{ bar }}</div>
    `,
})
export default class BarDisplay extends Vue {
    public get bar(): string {
        return FooStore.bar;
    }
}

