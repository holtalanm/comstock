# **Comstock**, the simpler alternative to Vuex.
[![npm version](https://img.shields.io/npm/v/comstock.svg?style=flat)](https://www.npmjs.com/package/comstock "View this project on npm")

## **This is a work-in-progress.  use at your own risk**

I pretty much wrote this library as a state management solution for my side project.  It works, but I'm not going to production with it yet.
If you are successfully using this in production, please feel free to let me know on github, I'd love to hear about it!

## **Update**

If you are looking for a plugin to persist state changes to a storage (like sessionStorage) that will transparently handle reloadng the state on Store intialization, take a look at: https://www.npmjs.com/package/comstock-storage

---
## Background

After getting frustrated with the amount of ceremony and boilerplate involved with using vuex, and after spending some time researching different store alternatives, I resolved that there must be a better way.

Comstock is designed to be simple, while still allowing for single-responsibility state management.  This means your state is IN ONE PLACE for your application (or, a section of your application, in the event that it is a huge application).

## But how did you get the name *Comstock*?

Well, my thought process was something like this:

* State management
* Store
* something similar to Store
* Gold Mine
* I read a book once about a famouse mine
* __oh yeah!, the *Comstock Lode*__.
* _does NPM have any packages named that?_
* No?  Alright, we got ourselves a name, boys.

No real significance to the name besides it was unique enough to remember, and it wasn't taken on NPM yet.  Well, that, and gold mines are somehow tangentially related (in my mind at least) to state management, apparently.

---

# Documentation

## Store

A store within Comstock.  Classes extending this should be a singleton.  See example below.

## StoreState

Decorator used by Comstock to declare a property on the Store as stateful.  Any time this property is updated, the changes propogate through Vue and into your UI.

## StoreStateOptions

Options to be passed to the `StoreState` decorator.

## StorePlugin

Plugin that can accept property change events within the store.  Currently, can register a before change listener, or an after change listener, or both!

## StoreOptions

Options to pass to the store upon construction.  Currently just has a single property: plugins, which is an array of StorePlugin.

# Example:

```ts
//in TestStorePlugin.ts

import { StorePlugin, StorePluginValueChangeEvent } from 'comstock';

export default class TestStorePlugin implements StorePlugin {
    public beforeValueChange(event: StorePluginValueChangeEvent<any>): void {
        console.log(`Before Property Change: ${JSON.stringify({
            old: event.oldValue,
            new: event.newValue,
            property: event.property,
        })}`);
    }

    public afterValueChange(event: StorePluginValueChangeEvent<any>): void {
        console.log(`After Property Change: ${JSON.stringify({
            old: event.oldValue,
            new: event.newValue,
            property: event.property,
        })}`);
    }
}
```


```ts
//in ExampleStore.ts

import { Store, StoreState } from 'comstock';
import TestStorePlugin from './TestStorePlugin';

class ExampleStore extends Store {

    private static pExampleStore: ExampleStore | null;

    @StoreState({ defaultValue: 'foo' })
    public foo!: string;

    // Singleton pattern with private constructor and public static getter.
    private constructor() {
        super({
            plugins: [new TestStorePlugin()],
        });
    }

    public static get instance(): ExampleStore {
        // Ensures once the static instance is set, it never gets re-instantiated.
        if (ExampleStore.pExampleStore == null) {
            ExampleStore.pExampleStore = new ExampleStore();
        }

        return ExampleStore.pExampleStore;
    }
}

// Even though we used singleton pattern, just export the single instance. 
export default ExampleStore.instance;
```
```ts
//in ExampleComponent.ts, or ExampleComponent.vue (vue.js component)

import { Component, Vue } from 'vue-property-decorator';
import ExampleStore from './ExampleStore';

@Component({
    template: `
        <div class="foo-value">{{ foo }}</div>
    `,
})
export default class FooDisplay extends Vue {
    public get foo(): string {
        return ExampleStore.foo;
    }
}
```

And that's it!  Your store is a singleton, so any changes on the properties declares as `StoreState` will propogate through all the components that utilize them.

# Planned features down the road to v1.0:

* Write decorator for making it easier to map properties within vue components.