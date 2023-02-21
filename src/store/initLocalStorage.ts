import { playlistCategories } from '@/utils/staticData';

console.debug('[debug][initLocalStorage.js]');
const enabledPlaylistCategories = playlistCategories
    .filter(c => c.enable)
    .map(c => c.name);

const localStorage = {
    player: {},
    settings: {
        lang: null,
        musicLanguage: 'all',
        appearance: 'auto',
        musicQuality: 320000,
        lyricFontSize: 28,
        outputDevice: 'default',
        showPlaylistsByAppleMusic: true,
        enableUnblockNeteaseMusic: true,
        automaticallyCacheSongs: true,
        cacheLimit: 8192,
        enableReversedMode: false,
        nyancatStyle: false,
        showLyricsTranslation: true,
        lyricsBackground: true,
        closeAppOption: 'ask',
        enableDiscordRichPresence: false,
        enableGlobalShortcut: true,
        showLibraryDefault: false,
        subTitleDefault: false,
        linuxEnableCustomTitlebar: false,
        enabledPlaylistCategories,
        proxyConfig: {
            protocol: 'noProxy',
            server: '',
            port: null,
        },
    },
    data: {
        user: {},
        likedSongPlaylistID: 0,
        lastRefreshCookieDate: 0,
        loginMode: null,
    },
};


export default localStorage;
