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
        }
    }
})
