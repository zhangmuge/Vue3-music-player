declare module "*.vue" {
    import {defineComponent} from "vue";
    const component: ReturnType<typeof defineComponent>;
    export default component;
}
import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        // 是可选的
        isAdmin?: boolean
        // 每个路由都必须声明
        requiresAuth: boolean
        name: string
    }
}
declare module 'js-cookie'
declare module 'node:process'
declare module 'nprogress'
import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        keepAlive?: boolean
        savePosition?: boolean
    }
}
