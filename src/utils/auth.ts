import Cookies from 'js-cookie'
import {logout} from '@/api/auth';
import useStore from '@/store'

export function getCookie(key: string) {
    return Cookies.get(key) ?? localStorage.getItem(`cookie-${key}`);
}

export function doLogout() {
    const store = useStore()
    logout();
    removeCookie('MUSIC_U');
    removeCookie('__csrf');
    store.updateData('user', {})
    store.updateData('loginMode', null)
    store.updateData('likedSongPlaylistID', undefined)

}

export function removeCookie(key: string) {
    Cookies.remove(key);
    localStorage.removeItem(`cookie-${key}`);
}

export function isLoggedIn() {
    return getCookie('MUSIC_U') !== undefined;
}

// 账号登录
export function isAccountLoggedIn() {
    const store = useStore()
    return (
        getCookie('MUSIC_U') !== undefined &&
        store.data.loginMode === 'account'
    );
}

// 用户名搜索（用户数据为只读）
export function isUsernameLoggedIn() {
    const store = useStore()
    return store.data.loginMode === 'username';
}

// 账户登录或者用户名搜索都判断为登录，宽松检查
export function isLooseLoggedIn() {
    return isAccountLoggedIn() || isUsernameLoggedIn();
}

export function setCookies(string: string) {
    const cookies = string.split(';;')
    cookies.map(cookie => {
        document.cookie = cookie;
        const cookieKeyValue = cookie.split(';')[0].split('=')
        localStorage.setItem(`cookie-${cookieKeyValue[0]}`, cookieKeyValue[1])
    })
}
