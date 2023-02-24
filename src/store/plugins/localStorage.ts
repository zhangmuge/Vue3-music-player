import type {PiniaPluginContext} from "pinia";
import {toRaw} from "vue";

export function storePlugins(context: PiniaPluginContext) {
    const {store} = context
    store.$subscribe(() => {
        localStorage.setItem('setting', JSON.stringify(toRaw(store.settings)))
    })
}
