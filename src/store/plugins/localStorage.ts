import type {PiniaPluginContext} from "pinia";
import {toRaw} from "vue";

export function storePlugins(context: PiniaPluginContext) {
    const {store} = context
    store.$subscribe(() => {
        localStorage.setItem('settings', JSON.stringify(toRaw(store.settings)))
        localStorage.setItem('data', JSON.stringify(toRaw(store.data)))
    })
}
