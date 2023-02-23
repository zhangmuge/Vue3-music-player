import router from "@/router";
import axios from 'axios';
import {doLogout, getCookie} from "@/utils/auth";
// @ts-ignore
import process from 'node:process';

const baseURL = 'http://1.15.93.226:3000';

const service = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15000,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});
// service.interceptors.request.use((config) => {
//     if (!config.params)
//         config.params = {};
//     if (baseURL.length) {
//         if (baseURL[0] !== '/') {
//             config.params.cookie = `MUSIC_U=${getCookie('MUSIC_U')};`;
//         }
//     } else {
//         console.error("You must set up the baseURL in the service's config");
//     }
//     if (!config.url?.includes('/login')) {
//         config.params.realIP = '211.161.244.70'
//     }
//     if (process.env.VUE_APP_REAL_IP) {
//         config.params.realIP = process.env.VUE_APP_REAL_IP;
//     }
//     const proxy = JSON.parse(<string>localStorage.getItem('settings')).proxyConfig;
//     if (['HTTP', 'HTTPS'].includes(proxy.protocol)) {
//         config.params.proxy = `${proxy.protocol}://${proxy.server}:${proxy.port}`;
//     }
//     return config;
// })
// service.interceptors.response.use(
//     (response) => {
//         const res = response.data
//         return res;
//     },
//     async error => {
//         const response = error.response;
//         const data = response.data;
//
//         if (
//             response &&
//             typeof data === 'object' &&
//             data.code === 301 &&
//             data.msg === '需要登录'
//         ) {
//             console.warn('Token has expired. Logout now!');
//
//             // 登出帳戶
//             doLogout();
//             router.push({name: 'login'});
//         }
//     }
// )
export default service;
