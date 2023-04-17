<template>
    <div v-show="show" class="playlist">
        <div
                v-if="specialPlaylistInfo === undefined && !isLikeSongsPage"
                class="playlist-info"
        >
            <Cover
                    :id="playlist.id"
                    :image-url="resizeImage(playlist.coverImgUrl,1024)"
                    :show-play-button="true"
                    :always-show-shadow="true"
                    :click-cover-to-play="true"
                    :fixed-size="288"
                    type="playlist"
                    :cover-hover="false"
                    :play-button-size="18"
            />
            <div class="info">
                <div class="title"
                ><span v-if="playlist.privacy === 10" class="lock-icon">
            <el-icon><lock/></el-icon></span
                >{{ playlist.name }}
                </div
                >
                <div class="artist">
                    Playlist by
                    <span
                            v-if="
              [
                5277771961, 5277965913, 5277969451, 5277778542, 5278068783,
              ].includes(playlist.id)
            "
                            style="font-weight: 600"
                    >Apple Music</span
                    >
                    <a
                            v-else
                            :href="`https://music.163.com/#/user/home?id=${playlist.creator.userId}`"
                            target="blank"
                    >{{ playlist.creator.nickname }}</a
                    >
                </div>
                <div class="date-and-count">
                    最后更新与
                    {{ formatDate(playlist.updateTime) }} · {{ playlist.trackCount }}
                    首歌
                </div>
                <div class="description" @click="toggleFullDescription">
                    {{ playlist.description }}
                </div>
                <div class="buttons">
                    <ButtonTwoTone @click="playPlaylistByID()">
                        <el-icon class="play">
                            <play/>
                        </el-icon>
                        播放
                    </ButtonTwoTone>
<!--                    <ButtonTwoTone-->
<!--                            v-if="playlist.creator.userId !== store.data.user.userId"-->
<!--                            :icon-button="true"-->
<!--                            :horizontal-padding="0"-->
<!--                            :background-color="-->
<!--              playlist.subscribed ? 'var(&#45;&#45;color-secondary-bg)' : ''-->
<!--            "-->
<!--                            @click="likePlaylist"-->
<!--                    >-->
<!--                        <el-icon class="heart" v-if="playlist.subscribed">-->
<!--                            <like theme="outline" fill="#000000" />-->
<!--                        </el-icon>-->
<!--&lt;!&ndash;                        <el-icon v-else-if="!playlist.subscribed">&ndash;&gt;-->
<!--&lt;!&ndash;                            <like theme="filled" fill="#d0021b"/>&ndash;&gt;-->
<!--&lt;!&ndash;                        </el-icon>&ndash;&gt;-->
<!--                    </ButtonTwoTone>-->
                </div>
            </div>
            <div v-if="displaySearchInPlaylist" class="search-box">
                <div class="container" :class="{ active: inputFocus }">
                    <el-icon>
                        <search/>
                    </el-icon>
                    <div class="input">
                        <input
                                v-model.trim="inputSearchKeyWords"
                                v-focus
                                :placeholder="inputFocus ? '' : '搜索歌单音乐'"
                                @input="inputDebounce()"
                                @focus="inputFocus = true"
                                @blur="inputFocus = false"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="specialPlaylistInfo !== undefined" class="special-playlist">
            <div
                    class="title"
            >
                <!--                <img :src="resizeImage(playlist.coverImgUrl,512)"/>-->
                {{ specialPlaylistInfo.name }}
            </div>
            <div class="subtitle"
            >{{ playlist.englishTitle }} · {{ playlist.updateFrequency }}
            </div>

            <div class="buttons">
                <ButtonTwoTone
                        class="play-button"
                        color="grey"
                        @click="playPlaylistByID()"
                >
                    <el-icon class="play">
                        <Play/>
                    </el-icon>
                    播放
                </ButtonTwoTone>
                <ButtonTwoTone
                        v-if="playlist.creator.userId !== store.data.user.userId"
                        :icon-button="true"
                        :horizontal-padding="0"
                        :color="playlist.subscribed ? 'blue' : 'grey'"
                        :text-color="playlist.subscribed ? '#335eea' : ''"
                        :background-color="
            playlist.subscribed ? 'var(--color-secondary-bg)' : ''
          "
                        @click="likePlaylist"
                >
                    <el-icon class="heart" v-if="playlist.subscribed">
                        <like theme="outline" fill="#000000" />
                    </el-icon>
                    <el-icon class="heart" v-else>
                        <like theme="filled" fill="#d0021b"/>
                    </el-icon>
                </ButtonTwoTone>
=
            </div>
        </div>

        <div v-if="isLikeSongsPage" class="user-info">
            <h1>
                <img
                        class="avatar"
                        :src="resizeImage(store.data.user.avatarUrl,512)"
                        loading="lazy"
                />
                {{ store.data.user.nickname }}的音乐库
            </h1>
            <div class="search-box-likepage" @click="searchInPlaylist()">
                <div class="container" :class="{ active: inputFocus }">
                    <el-icon class="search"><search/></el-icon>
                    <div class="input" :style="{ width: searchInputWidth }">
                        <input
                                v-if="displaySearchInPlaylist"
                                v-model.trim="inputSearchKeyWords"
                                v-focus
                                :placeholder="inputFocus ? '' : '搜索歌单音乐'"
                                @input="inputDebounce()"
                                @focus="inputFocus = true"
                                @blur="inputFocus = false"
                        />
                    </div>
                </div>
            </div>
        </div>

        <TrackList
                :id="playlist.id"
                :tracks="filteredTracks"
                type="playlist"
                :extra-context-menu-item="
        isUserOwnPlaylist ? ['removeTrackFromPlaylist'] : []
      "
        />

        <div class="load-more">
            <ButtonTwoTone
                    v-show="hasMore"
                    color="grey"
                    :loading="loadingMore"
                    @click="loadMore(100)"
            >加载更多
            </ButtonTwoTone
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    getPlaylistDetail,
    subscribePlaylist,
    deletePlaylist,
} from '@/api/playlist';
import {getTrackDetail} from '@/api/track';
import {isAccountLoggedIn} from '@/utils/auth';
import {computed, onBeforeMount, onMounted, ref} from "vue";
import ButtonTwoTone from '@/components/ButtonTwoTone.vue';
import TrackList from '@/components/TrackList.vue';
import Cover from '@/components/Cover.vue';
import useStore from "@/store";
import {useRoute} from "vue-router";
import dayjs from "dayjs";
import {Play, Search, Lock, Like} from "@icon-park/vue-next"
import {ElMessageBox} from "element-plus";

const route = useRoute();
const specialPlaylist = {
    2829816518: {
        name: '欧美私人订制',
        gradient: 'gradient-pink-purple-blue',
    },
    2890490211: {
        name: '助眠鸟鸣声',
        gradient: 'gradient-green',
    },
    5089855855: {
        name: '夜的胡思乱想',
        gradient: 'gradient-moonstone-blue',
    },
    2888212971: {
        name: '全球百大DJ',
        gradient: 'gradient-orange-red',
    },
    2829733864: {
        name: '睡眠伴侣',
        gradient: 'gradient-midnight-blue',
    },
    2829844572: {
        name: '洗澡时听的歌',
        gradient: 'gradient-yellow',
    },
    2920647537: {
        name: '还是会想你',
        gradient: 'gradient-dark-blue-midnight-blue',
    },
    2890501416: {
        name: '助眠白噪声',
        gradient: 'gradient-sky-blue',
    },
    5217150082: {
        name: '摇滚唱片行',
        gradient: 'gradient-yellow-red',
    },
    2829961453: {
        name: '古风音乐大赏',
        gradient: 'gradient-fog',
    },
    4923261701: {
        name: 'Trance',
        gradient: 'gradient-light-red-light-blue ',
    },
    5212729721: {
        name: '欧美点唱机',
        gradient: 'gradient-indigo-pink-yellow',
    },
    3103434282: {
        name: '甜蜜少女心',
        gradient: 'gradient-pink',
    },
    2829896389: {
        name: '日系私人订制',
        gradient: 'gradient-yellow-pink',
    },
    2829779628: {
        name: '运动随身听',
        gradient: 'gradient-orange-red',
    },
    2860654884: {
        name: '独立女声精选',
        gradient: 'gradient-sharp-blue',
    },
    898150: {
        name: '浪漫婚礼专用',
        gradient: 'gradient-pink',
    },
    2638104052: {
        name: '牛奶泡泡浴',
        gradient: 'gradient-fog',
    },
    5317236517: {
        name: '后朋克精选',
        gradient: 'gradient-pink-purple-blue',
    },
    2821115454: {
        name: '一周原创发现',
        gradient: 'gradient-blue-purple',
    },
    2829883282: {
        name: '华语私人雷达',
        gradient: 'gradient-yellow-red',
    },
    3136952023: {
        name: '私人雷达',
        gradient: 'gradient-radar',
    },
};
const show = ref(false);

interface playlists {
    id: number,
    name: string,
    coverImgUrl: string,
    creator: {
        userId: number,
        nickname: string,
        avatarUrl: string
    },
    description: string,
    subscribedCount: number,
    shareCount: number,
    commentCount: number,
    playCount: number,
    createTime: number,
    subscribed: boolean,
    tags: string[],
    trackCount: number,
    tracks: any[],
    trackIds: any[],
    privacy: number,
    updateTime: string,
    englishTitle: string,
    updateFrequency: string,
}

const displaySearchInPlaylist = ref(false);
const inputFocus = ref(false);
const debounceTimeout = ref(null);
const searchKeyWords = ref('');
const playlist = ref({} as playlists);
const store = useStore()
const tracks = ref([]);
const player = computed(() => store.player)
const isLikeSongsPage = computed(() => route.name === 'likeSongs');
const isUserOwnPlaylist = computed(() => {
    return (playlist.value.creator.userId === store.data.user.userId && playlist.value.creator.userId !== store.data.likedSongPlaylistID)
});
const filteredTracks = computed(() => {
    return tracks.value.filter((track: any) => (track.name &&
            track.name
                .toLowerCase()
                .includes(searchKeyWords.value.toLowerCase())) ||
        (track.al.name &&
            track.al.name
                .toLowerCase()
                .includes(searchKeyWords.value.toLowerCase())) ||
        track.ar.find(
            (artist: { name: string; }) =>
                artist.name &&
                artist.name
                    .toLowerCase()
                    .includes(searchKeyWords.value.toLowerCase())
        ))
})
const inputSearchKeyWords = ref('');
const inputDebounce = () => {
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value)
    // @ts-ignore
    debounceTimeout.value = setTimeout(() => {
        searchKeyWords.value = inputSearchKeyWords.value
    }, 600)
}
const formatDate = (timestamp: string, format = 'MMM D, YYYY') => {
    if (!timestamp) return '';
    return dayjs(Number(timestamp)).format(format);
}
const showFullDescription = ref(false);
const toggleFullDescription = () => {
    ElMessageBox({
        title: '歌单介绍',
        message: playlist.value.description,
        showConfirmButton:false
    });
}
const resizeImage = (imgUrl: string, size: number) => {
    if (!imgUrl) return '';
    let httpsImgUrl = imgUrl;
    if (imgUrl.slice(0, 5) !== 'https') {
        httpsImgUrl = 'https' + imgUrl.slice(4);
    }
    return `${httpsImgUrl}?param=${size}y${size}`;
};
const loadingMore = ref(false);
const loadData = (id: string, next = undefined) => {
    temp_id.value = id
    getPlaylistDetail(Number(id), next).then((res: any) => {
        playlist.value = res.playlist;
        tracks.value = res.playlist.tracks;
        show.value = true;
        lastLoadedTrackIndex.value = store.data.playlistTracks.length - 1;
        return res;
    }).then(() => {
        //@ts-ignore
        if (playlist.value.trackCount > tracks.value.length) {
            loadingMore.value = true;
            loadMore();
        }
    });
}
const hasMore = ref(false)
const loadMore = (loadNum = 100) => {
    let trackIDs = playlist.value.trackIds.filter((t: any, index: number) => {
        if (index > lastLoadedTrackIndex.value &&
            index <= lastLoadedTrackIndex.value + loadNum) {
            return t
        }
    });

    trackIDs = trackIDs.map((t: any) => t.id) as any;
    getTrackDetail(trackIDs.join(',')).then((res: any) => {
        //@ts-ignore
        tracks.value.push(...res.songs);
        lastLoadedTrackIndex.value += trackIDs.length;
        loadingMore.value = false;
        if (lastLoadedTrackIndex.value + 1 === playlist.value.trackIds.length) {
            hasMore.value = false;
        } else {
            hasMore.value = true;
        }
    })
}
const lastLoadedTrackIndex = ref(9)
const temp_id = ref('')
if (route.name === 'likedSongs') {
    loadData(store.data.likedSongPlaylistID);
} else {
    //@ts-ignore
    loadData(route.params.id);
}
const specialPlaylistInfo = computed(() => {
    //@ts-ignore
    return specialPlaylist[playlist.value.id];
});
const playPlaylistByID = (trackID = 'first') => {
    let trackIDs = playlist.value.trackIds.map((t: any) => t.id) as any;
    store.player.replacePlaylist(trackIDs, playlist.value.id, 'playlist', trackID)
}
const likePlaylist = (toast = false) => {
    if (!isAccountLoggedIn()) {
        store.showToast('请先登录');
        return;
    }
    subscribePlaylist({id: playlist.value.id, t: playlist.value.subscribed ? 2 : 1}).then((res: any) => {

        if (res.code === 200) {
            playlist.value.subscribed = !playlist.value.subscribed;
            if (toast) {
                store.showToast(playlist.value.subscribed ? '收藏成功' : '取消收藏成功');
            }
        }
    })
}
const searchInputWidth = ref('0px');
const searchInPlaylist = () => {
    displaySearchInPlaylist.value =
        !displaySearchInPlaylist.value || isLikeSongsPage.value;
    if (displaySearchInPlaylist.value == false) {
        searchKeyWords.value = '';
        inputSearchKeyWords.value = '';
    } else {
        searchInputWidth.value = '172px';
        loadMore(500);
    }
}
</script>
<style lang="scss" scoped>
.playlist {
  margin-top: 32px;
}

.playlist-info {
  display: flex;
  margin-bottom: 72px;
  position: relative;

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    margin-left: 56px;

    .title {
      font-size: 36px;
      font-weight: 700;
      color: var(--color-text);

      .lock-icon {
        opacity: 0.28;
        color: var(--color-text);
        margin-right: 8px;

        .svg-icon {
          height: 26px;
          width: 26px;
        }
      }
    }

    .artist {
      font-size: 18px;
      opacity: 0.88;
      color: var(--color-text);
      margin-top: 24px;
    }

    .date-and-count {
      font-size: 14px;
      opacity: 0.68;
      color: var(--color-text);
      margin-top: 2px;
    }

    .description {
      font-size: 14px;
      opacity: 0.68;
      color: var(--color-text);
      margin-top: 24px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      cursor: pointer;

      &:hover {
        transition: opacity 0.3s;
        opacity: 0.88;
      }
    }

    .buttons {
      margin-top: 32px;
      display: flex;

      button {
        margin-right: 16px;
      }
    }
  }
}

.special-playlist {
  margin-top: 192px;
  margin-bottom: 128px;
  border-radius: 1.25em;
  text-align: center;

  @keyframes letterSpacing4 {
    from {
      letter-spacing: 0px;
    }

    to {
      letter-spacing: 4px;
    }
  }

  @keyframes letterSpacing1 {
    from {
      letter-spacing: 0px;
    }

    to {
      letter-spacing: 1px;
    }
  }

  .title {
    font-size: 84px;
    line-height: 1.05;
    font-weight: 700;
    text-transform: uppercase;

    letter-spacing: 4px;
    animation-duration: 0.8s;
    animation-name: letterSpacing4;
    -webkit-text-fill-color: lightskyblue;
    background-clip: text;
    //background-image: linear-gradient(
    //  225deg,
    //  var(--color-primary),
    //  var(--color-primary)
    //);

    img {
      height: 78px;
      border-radius: 0.125em;
      margin-right: 24px;
    }
  }

  .subtitle {
    font-size: 18px;
    letter-spacing: 1px;
    margin: 28px 0 54px 0;
    animation-duration: 0.8s;
    animation-name: letterSpacing1;
    text-transform: uppercase;
    color: var(--color-text);
  }

  .buttons {
    margin-top: 32px;
    display: flex;
    justify-content: center;

    button {
      margin-right: 16px;
    }
  }
}

.gradient-test {
  background-image: linear-gradient(to left, #92fe9d 0%, #00c9ff 100%);
}

[data-theme='dark'] {
  .gradient-radar {
    background-image: linear-gradient(to left, #92fe9d 0%, #00c9ff 100%);
  }
}

.gradient-radar {
  background-image: linear-gradient(to left, #0ba360 0%, #3cba92 100%);
}

.gradient-blue-purple {
  background-image: linear-gradient(
                  45deg,
                  #89c4f5 0%,
                  #6284ff 42%,
                  #ff0000 100%
  );
}

.gradient-sharp-blue {
  background-image: linear-gradient(45deg, #00c6fb 0%, #005bea 100%);
}

.gradient-yellow-pink {
  background-image: linear-gradient(45deg, #f6d365 0%, #fda085 100%);
}

.gradient-pink {
  background-image: linear-gradient(45deg, #ee9ca7 0%, #ffdde1 100%);
}

.gradient-indigo-pink-yellow {
  background-image: linear-gradient(
                  43deg,
                  #4158d0 0%,
                  #c850c0 46%,
                  #ffcc70 100%
  );
}

.gradient-light-red-light-blue {
  background-image: linear-gradient(
                  225deg,
                  hsl(190, 30%, 50%) 0%,
                  #081abb 38%,
                  #ec3841 58%,
                  hsl(13, 99%, 49%) 100%
  );
}

.gradient-fog {
  background: linear-gradient(-180deg, #bcc5ce 0%, #929ead 98%),
  radial-gradient(
                  at top left,
                  rgba(255, 255, 255, 0.3) 0%,
                  rgba(0, 0, 0, 0.3) 100%
  );
  background-blend-mode: screen;
}

.gradient-red {
  background-image: linear-gradient(213deg, #ff0844 0%, #ffb199 100%);
}

.gradient-sky-blue {
  background-image: linear-gradient(147deg, #48c6ef 0%, #6f86d6 100%);
}

.gradient-dark-blue-midnight-blue {
  background-image: linear-gradient(213deg, #09203f 0%, #537895 100%);
}

.gradient-yellow-red {
  background: linear-gradient(147deg, #fec867 0%, #f72c61 100%);
}

.gradient-yellow {
  background: linear-gradient(147deg, #fceb02 0%, #fec401 100%);
}

.gradient-midnight-blue {
  background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
}

.gradient-orange-red {
  background-image: linear-gradient(147deg, #ffe53b 0%, #ff2525 74%);
}

.gradient-moonstone-blue {
  background-image: linear-gradient(
                  147deg,
                  hsl(200, 34%, 8%) 0%,
                  hsl(204, 35%, 38%) 50%,
                  hsl(200, 34%, 18%) 100%
  );
}

.gradient-pink-purple-blue {
  background-image: linear-gradient(
                  to right,
                  #ff3cac 0%,
                  #784ba0 50%,
                  #2b86c5 100%
  ) !important;
}

.gradient-green {
  background-image: linear-gradient(
                  90deg,
                  #c6f6d5,
                  #68d391,
                  #38b2ac
  ) !important;
}

.user-info {
  h1 {
    font-size: 42px;
    position: relative;
    color: var(--color-text);

    .avatar {
      height: 44px;
      margin-right: 12px;
      vertical-align: -7px;
      border-radius: 50%;
      border: rgba(0, 0, 0, 0.2);
    }
  }
}

.search-box {
  display: flex;
  position: absolute;
  right: 20px;
  bottom: -55px;
  justify-content: flex-end;
  -webkit-app-region: no-drag;

  .container {
    display: flex;
    align-items: center;
    height: 32px;
    background: var(--color-secondary-bg-for-transparent);
    border-radius: 8px;
    width: 200px;
  }

  .svg-icon {
    height: 15px;
    width: 15px;
    color: var(--color-text);
    opacity: 0.28;
    margin: {
      left: 8px;
      right: 4px;
    }
  }

  input {
    font-size: 16px;
    border: none;
    background: transparent;
    width: 96%;
    font-weight: 600;
    margin-top: -1px;
    color: var(--color-text);
  }

  .active {
    background: var(--color-primary-bg-for-transparent);

    input,
    .svg-icon {
      opacity: 1;
      color: var(--color-primary);
    }
  }
}

[data-theme='dark'] {
  .search-box {
    .active {
      input,
      .svg-icon {
        color: var(--color-text);
      }
    }
  }
}

.search-box-likepage {
  display: flex;
  position: absolute;
  right: 12vw;
  top: 95px;
  justify-content: flex-end;
  -webkit-app-region: no-drag;

  .input {
    transition: all 0.5s;
  }

  .container {
    display: flex;
    align-items: center;
    height: 32px;
    background: var(--color-secondary-bg-for-transparent);
    border-radius: 8px;
  }

  .svg-icon {
    height: 15px;
    width: 15px;
    color: var(--color-text);
    opacity: 0.28;
    margin: {
      left: 8px;
      right: 8px;
    }
  }

  input {
    font-size: 16px;
    border: none;
    background: transparent;
    width: 96%;
    font-weight: 600;
    margin-top: -1px;
    color: var(--color-text);
  }

  .active {
    background: var(--color-primary-bg-for-transparent);

    input,
    .svg-icon {
      opacity: 1;
      color: var(--color-primary);
    }
  }
}

[data-theme='dark'] {
  .search-box-likepage {
    .active {
      input,
      .svg-icon {
        color: var(--color-text);
      }
    }
  }
}

@media (max-width: 1336px) {
  .search-box-likepage {
    right: 8vw;
  }
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.play {
  margin-right: 5px;
}
</style>
