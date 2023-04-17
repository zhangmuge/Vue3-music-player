// Last.fm API documents 👉 https://www.last.fm/api

// @ts-ignore
import axios from 'axios';
// @ts-ignore
import md5 from 'crypto-js/md5';

const apiKey = "";
const apiSharedSecret = "";
const baseUrl = window.location.origin;
const url = 'https://ws.audioscrobbler.com/2.0/';

const sign = (params: { [x: string]: any; }) => {
    const sortParamsKeys = Object.keys(params).sort();
    const sortedParams = sortParamsKeys.reduce((acc, key) => {
        // @ts-ignore
        acc[key] = params[key];
        return acc;
    }, {});
    let signature = '';
    // @ts-ignore
    for (const [key, value] of Object.entries(sortedParams)) {
        signature += `${key}${value}`;
    }
    return md5(signature + apiSharedSecret).toString();
};

export function auth() {
    return;
}

export function authGetSession(token: any) {
    const signature = md5(
        `api_key${apiKey}methodauth.getSessiontoken${token}${apiSharedSecret}`
    ).toString();
    return axios({
        url,
        method: 'GET',
        params: {
            method: 'auth.getSession',
            format: 'json',
            api_key: apiKey,
            api_sig: signature,
            token,
        },
    });
}

export function trackUpdateNowPlaying(params: { [x: string]: any; api_key?: any; method?: any; sk?: any; }) {
    params.api_key = apiKey;
    params.method = 'track.updateNowPlaying';
    // @ts-ignore
    params.sk = JSON.parse(localStorage.getItem('lastfm'))['key'];
    const signature = sign(params);

    return axios({
        url,
        method: 'POST',
        params: {
            ...params,
            api_sig: signature,
            format: 'json',
        },
    });
}

export function trackScrobble(params: { [x: string]: any; artist?: any; track?: any; timestamp?: number; album?: any; trackNumber?: any; duration?: number; api_key?: any; method?: any; sk?: any; }) {
    params.api_key = apiKey;
    params.method = 'track.scrobble';
    // @ts-ignore
    params.sk = JSON.parse(localStorage.getItem('lastfm'))['key'];
    const signature = sign(params);

    return axios({
        url,
        method: 'POST',
        params: {
            ...params,
            api_sig: signature,
            format: 'json',
        },
    });
}
