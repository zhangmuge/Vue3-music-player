import Cookies from 'js-cookie'
import {logout} from '@/api/auth';
import {useStore} from '@/store'

export function getCookie(key:string){
    return Cookies.get(key)??localStorage.getItem(`cookie-${key}`);
}
export function doLogout(){
    logout();
    removeCookie('MUSIC_U');
    removeCookie('__csrf');

}

export function removeCookie(key:string){
    Cookies.remove(key);
    localStorage.removeItem(`cookie-${key}`);
}

export function isLoggedIn() {
    return getCookie('MUSIC_U') !== undefined;
}

// 账号登录
export function isAccountLoggedIn() {
    const store=useStore()
    return (
        getCookie('MUSIC_U') !== undefined &&
        store.data.loginMode === 'account'
    );
}

// 用户名搜索（用户数据为只读）
export function isUsernameLoggedIn() {
    const store=useStore()
    return store.data.loginMode === 'username';
}

// 账户登录或者用户名搜索都判断为登录，宽松检查
export function isLooseLoggedIn() {
    return isAccountLoggedIn() || isUsernameLoggedIn();
}
