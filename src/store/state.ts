import initLocalStorage from './initLocalStorage';


if (localStorage.getItem('appVersion') === null) {
    localStorage.setItem('settings', JSON.stringify(initLocalStorage.settings));
    localStorage.setItem('data', JSON.stringify(initLocalStorage.data));
    localStorage.setItem('appVersion', '1.0.0');
}


export default {
    showLyrics: false,
    enableScrolling: true,
    title: 'PlayMusic',
    liked: {
        songs: [] as Array<number>,
        songsWithDetails: [], // 只有前12首
        playlists: [],
        albums: [],
        artists: [],
        mvs: [],
        cloudDisk: [],
        playHistory: {
            weekData: [],
            allData: [],
        },
    },
    contextMenu: {
        clickObjectID: 0,
        showMenu: false,
    },
    toast: {
        show: false,
        text: '',
        timer: null,
    },
    modals: {
        addTrackToPlaylistModal: {
            show: false,
            selectedTrackID: 0,
        },
        newPlaylistModal: {
            show: false,
            afterCreateAddTrackID: 0,
        },
    },
    dailyTracks: [],
    lastfm: JSON.parse(localStorage.getItem('lastfm') as string) || {},
    player: JSON.parse(localStorage.getItem('player') as string),
    settings: JSON.parse(localStorage.getItem('settings') as string),
    data: JSON.parse(localStorage.getItem('data') as string),
};
