import {createRouter, createWebHistory} from 'vue-router'
import type {RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home.vue'),
        // @ts-ignore
        meta: {
            keepAlive: true,
            savePosition: true
        }
    },
    {
        path:'/explore',
        name:'explore',
        component:()=>import('@/views/explore.vue'),
        // @ts-ignore
        meta: {
            keepAlive: true,
            savePosition: true
        }
    }

]
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router
