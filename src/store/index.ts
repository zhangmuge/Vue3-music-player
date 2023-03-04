import {defineStore} from "pinia";
import State from "@/store/state";
import {isAccountLoggedIn, isLooseLoggedIn} from '@/utils/auth';
import {likeATrack} from '@/api/track';
import {getPlaylistDetail} from '@/api/playlist';
import {getTrackDetail} from '@/api/track';
import {
    userPlaylist,
    userPlayHistory,
    userLikedSongsIDs,
    likedAlbums,
    likedArtists,
    likedMVs,
    cloudDisk,
    userAccount,
} from '@/api/user';
import {result} from "lodash";

export const useStore = defineStore('store', {
    state: () => State,
    actions: {
        updateLikedXXX(name: string, data: any) {
            // @ts-ignore
            this.liked[name] = data;
            if (name === 'songs') {
                this.player.sendSelfToIpcMain()
            }
        },
        async showToast(text: string) {
            if (this.toast.timer !== null) {
                clearTimeout(this.toast.timer);
                this.toast = {
                    show: false,
                    text: '',
                    timer: null
                }
            }
            this.toast = {
                show: true,
                text,
                // @ts-ignore
                timer: setTimeout(() => {
                    this.toast = {
                        show: false,
                        text: this.toast.text,
                        timer: null
                    }
                }, 3200)
            }
        },
        likeATrack(id: number) {
            if (!isAccountLoggedIn()) {
                this.showToast('此操作需要登录网易云账号')
                return;
            }
            let like = true;
            if (this.liked.songs.includes(id))
                like = false;
            likeATrack({id, like}).then(() => {
                    if (like === false) {
                        this.updateLikedXXX('songs', this.liked.songs.filter(d => d !== id))
                    } else {
                        const newLikeSongs = this.liked.songs;
                        newLikeSongs.push(id);
                        this.updateLikedXXX('songs', newLikeSongs)
                    }
                    this.fetchLikedSongsWithDetails()
                }
            )
        },
        async fetchLikedSongsWithDetails() {
            return getPlaylistDetail(this.data.likedSongPlaylistID).then(
                (result: any) => {
                    if (result.playlist?.trackIds?.length === 0) {
                        return new Promise((resolve: any) => {
                            resolve()
                        })
                    }
                    return getTrackDetail(result.playlist.trackIds.slice(0, 12).map((t: any) => t.id).join(',')).then(
                        (result: any) => {
                            this.updateLikedXXX('songsWithDetails', result.songs)
                        }
                    )
                }
            )
        },
        updateDailyTracks(dailyTracks: any) {
            this.dailyTracks = dailyTracks
        },
        togglePlaylistCategory(name: string) {
            const index = this.settings.enabledPlaylistCategories.findIndex(
                (c: any) => c === name
            );
            if (index !== -1) {
                this.settings.enabledPlaylistCategories =
                    this.settings.enabledPlaylistCategories.filter((c: any) => c !== name);
            } else {
                this.settings.enabledPlaylistCategories.push(name);
            }
        },
        updateData(key: any, value: any) {
            this.data[key] = value
        },
        async fetchUserProfile() {
            if (!isAccountLoggedIn())
                return;
            return userAccount().then(res => {
                const data = res.data
                if (data.code === 200)
                    this.updateData('user', data.profile)
            })
        },
        async fetchLikedPlaylist() {
            if (!isLooseLoggedIn()) return;
            if (isAccountLoggedIn()) {
                return userPlaylist({
                    uid: this.data.user?.userId,
                    limit: 2000, // 最多只加载2000个歌单（等有用户反馈问题再修）
                    timestamp: new Date().getTime(),
                }).then(result => {
                    const data = result.data
                    if (data.playlist) {
                        this.updateLikedXXX('playlists', data.playlist)
                        this.updateData('likedSongPlaylistID', data.playlist[0].id)
                        // 更新用户”喜欢的歌曲“歌单ID
                    }
                });
            }
        },
        async fetchLikedSongs() {
            if (!isLooseLoggedIn()) return;
            if (isAccountLoggedIn()) {
                return userLikedSongsIDs(this.data.user.userId).then(res => {
                    const data = res.data
                    if (data.ids) {
                        this.updateLikedXXX('songs', data.ids)
                    }
                })
            }
        },
        async fetchLikedAlbums() {
            if (isAccountLoggedIn()) return;
            return likedAlbums({limit: 2000}).then(res => {
                const data = res.data
                if (data.data) {
                    this.updateLikedXXX('albums', data.data)
                }
            })
        },
        async fetchLikedArtists() {
            if (!isAccountLoggedIn()) return;
            return likedArtists({limit: 2000}).then(res => {
                const data = res.data
                if (data.data) {
                    this.updateLikedXXX('artists', data.data)
                }
            })
        },
        async fetchPlayHistory() {
            if (!isAccountLoggedIn()) return
            return Promise.all([
                userPlayHistory({uid: this.data.user?.userId, type: 0}),
                userPlayHistory({uid: this.data.user?.userId, type: 1}),
            ]).then(res => {
                    const data = {}
                    const dataType = {0: 'allData', 1: 'weekData'};
                    if (res[0] && res[1]) {
                        for (let i = 0; i < res.length; i++) {
                            // @ts-ignore
                            const songData = res[i].data[dataType[i]].map(item => {
                                const song = item.song;
                                song.playCount = item.playCount;
                                return song;
                            });
                            // @ts-ignore
                            data[[dataType[i]]] = songData
                        }
                        this.updateLikedXXX('playHistory', data)
                    }
                }
            )
        },
        async fetchCloudDisk() {
            if (!isAccountLoggedIn()) return
            return cloudDisk({limit: 1000}).then(res => {
                if (res.data.data) {
                    this.updateLikedXXX('cloudDisk', res.data.data)
                }
            })
        },
        async fetchLikedMVs() {
            if (!isAccountLoggedIn()) return;
            return likedMVs({limit: 1000}).then(res => {
                if (res.data.data) {
                    this.updateLikedXXX('mvs', res.data.data)
                }
            })
        }
    }
})
