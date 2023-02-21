import request from "@/utils/request";

interface PhoneParams {
    phone: string,
    password: string,
    countrycode?: string,
    md5_password?: string
}

export function loginWithPhone(params: PhoneParams) {
    return request({
        url: '/login/cellphone',
        method: "post",
        params
    })
}


export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}

export function refreshCookie() {
    return request({
        url: '/login/refresh',
        method: 'post',
    });
}

export function loginQrCodeCheck(key: string) {
    return request({
        url: '/login/qr/check',
        method: 'get',
        params: {
            key,
            timestamp: new Date().getTime(),
        },
    });
}

interface QrParams {
    key: string,
    qrimg?: string
}

export function loginQrCodeCreate(params: QrParams) {
    return request({
        url: '/login/qr/create',
        method: 'get',
        params: {
            ...params,
            timestamp: new Date().getTime(),
        },
    });
}

export function loginQrCodeKey() {
    return request({
        url: '/login/qr/key',
        method: 'get',
        params: {
            timestamp: new Date().getTime(),
        },
    });
}

interface EmailParams {
    email: string,
    password: string,
    md5_password?: string
}

export function loginWithEmail(params: EmailParams) {
    return request({
        url: '/login',
        method: 'post',
        params,
    });
}
