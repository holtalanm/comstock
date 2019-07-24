Comstock, the simpler alternative to Vuex.

## **This is a work-in-progress**

I've pretty much just got it working within a test vue-cli application, and have submitted the first commit to the repo at this point.  In no way is this production-ready.  **use at your own risk**.

---
## Background

After getting frustrated with the amount of ceremony and boilerplate involved with using vuex, and after spending some time researching different store alternatives, I resolved that there must be a better way.

---

# Documentation

## RootStore

The backbone of Comstock.  Your applicaton should have exactly one class extending this, and exactly one instance of that class.

## Store

A store within Comstock.  Classes extending this should probably be properties on the RootStore implementation

## StoreState

Decorator used by Comstock to declare a property on the Store as stateful.  Any time this property is updated, the change propogate through Vue and into your UI.

## StoreStateOptions

Options to be passed to the `StoreState` decorator.

# Example:

```ts
//in ExampleRootStore.ts

import { RootState, StoreState } from 'comstock';

class ExampleRootStore extends RootState {

    @StoreState({ defaultValue: 'foo' })
    public foo!: string;
}

// extend the Vue type declaration, so typescript knows the type of
// this.$store within your vue components.
declare module 'vue/types/vue' {
    interface Vue {
        $store: ExampleRootStore;
    }
}

export default new ExampleRootStore();
```
```ts
//in main.ts (application entry point)

import Vue from 'vue';
import ExampleRootStore from './ExampleRootStore';

Vue.use(ExampleRootStore);
```

And that's it!  Your root state should be available within your `*.vue` components as `this.$store`.