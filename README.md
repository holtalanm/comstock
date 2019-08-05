# **Comstock**, the simpler alternative to Vuex.

## **This is a work-in-progress.  use at your own risk**

I pretty much wrote this library as a state management solution for my side project.  It works, but I'm not going to production with it yet.
If you are successfully using this in production, please feel free to let me know on github, I'd love to hear about it!

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

# Example:

```ts
//in ExampleStore.ts

import { Store, StoreState } from 'comstock';

class ExampleStore extends Store {

    private static pExampleStore: ExampleStore | null;

    @StoreState({ defaultValue: 'foo' })
    public foo!: string;

    // Singleton pattern with private constructor and public static getter.
    private constructor() {
        super();
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

* Add plugin API for Store, compatible in some way with vuex plugins (to reduce adoption pain).
    * Can be done by either
        * directly supporting vuex plugin api
        * create comstock plugin api, write comstock plugin that provides compatibility with vuex plugins.
* Write decorator for making it easier to map properties within vue components.