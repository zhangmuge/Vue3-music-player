import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {createPinia} from "pinia";
import App from '@/App.vue'
import router from './router'
import '@/assets/css/global.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@icon-park/vue-next/styles/index.css';
import 'nprogress/nprogress.css'
// @ts-ignore
import NProgress from 'nprogress'
const app = createApp(App)
const pinia=createPinia();
app.use(pinia)
app.use(ElementPlus)
app.use(router)

app.mount('#app')
NProgress.configure({ showSpinner: false, trickleSpeed: 100 });
// @ts-ignore
for(const [key,component] of Object.entries(ElementPlusIconsVue)){
    app.component(key,component)
}
