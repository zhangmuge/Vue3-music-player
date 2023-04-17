<template>
    <div v-show="show" ref="library">
        <h1>
            <img
                    class="avatar"
                    :src="resizeImage(data.user.avatarUrl)"
                    loading="lazy"/>
            {{ data.user.nickname }}{{ '的音乐库' }}
        </h1>
        <div class="section-one">
            <div class="liked-songs" @click="goToLikedSongsList">
                <!--        <div class="top">-->
                <!--          <p>-->
                <!--&lt;!&ndash;            <span v-for="(line,index) in pickedLyric"&ndash;&gt;-->
                <!--            &lt;!&ndash;                  v-show="line!==''"&ndash;&gt;-->
                <!--            &lt;!&ndash;                  :key="`${line}${index}`">&ndash;&gt;-->
                <!--            &lt;!&ndash;              {{ line }}&ndash;&gt;-->
                <!--            &lt;!&ndash;              <br/>&ndash;&gt;-->
                <!--            &lt;!&ndash;            </span>&ndash;&gt;-->
                <!--          </p>-->
                <!--        </div>-->
                <div class="bottom">
                    <div class="titles">
                        <div class="title">
                            我喜欢的音乐
                        </div>
                        <div class="sub-title">
                            {{ liked.songs.length }}{{ " 首歌" }}
                        </div>
                    </div>
                    <button @click.stop="openPlayModeTabMenu">
                        <el-icon size="28">
                            <PlayOne/>
                        </el-icon>
                    </button>
                </div>
            </div>
            <div class="songs">
                <TrackList
                        :id="liked.playlists.length>0?liked.playlists[0].id:0"
                        :tracks="liked.songsWithDetails.songs"
                        :column-number="3"
                        type="tracklist"
                        dbclick-track-func="playPlaylistByID"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {PlayOne} from "@icon-park/vue-next";
import {computed, nextTick, ref} from "vue";
import useStore from "@/store";
import {randomNum} from "@/utils/common";
import {getLyric} from "@/api/track";
import router from "@/router/index"
import {storeToRefs} from "pinia";
import TrackList from "@/components/TrackList.vue";

const store = useStore()
const show = ref(true)
const data = computed(() => {
    return store.data
})
// console.log(data.value)
const liked = computed(() => {
    return store.liked
})
const goToLikedSongsList = () => {
    router.push({path: '/library/liked-songs'})
}
const resizeImage = (imgUrl: string, size = 512) => {
    if (!imgUrl) return '';
    let httpsImgUrl = imgUrl;
    if (imgUrl.slice(0, 5) !== 'https') {
        httpsImgUrl = 'https' + imgUrl.slice(4);
    }
    return `${httpsImgUrl}?param=${size}y${size}`;
}
const extractLyricPart = (rawLyric: string) => {
    //@ts-ignore
    return rawLyric.split(']').pop().trim();
}
const lyric = ref('')
const pickedLyric = computed(() => {
    const temp_lyric = lyric.value;

    // Returns [] if we got no lyrics.
    if (!temp_lyric) return [];

    const lyricLine = temp_lyric
        .split('\n')
        .filter((line: string) => !line.includes('作词') && !line.includes('作曲'));

    // Pick 3 or fewer lyrics based on the lyric lines.
    const lyricsToPick = Math.min(lyricLine.length, 3);

    // The upperBound of the lyric line to pick
    const randomUpperBound = lyricLine.length - lyricsToPick;
    const startLyricLineIndex = randomNum(0, randomUpperBound - 1);

    // Pick lyric lines to render.
    return lyricLine
        .slice(startLyricLineIndex, startLyricLineIndex + lyricsToPick)
        .map(extractLyricPart);
})
const getRandomLyric = () => {
    if (store.liked.songs.length === 0)
        return
    getLyric(store.liked.songs[randomNum(0, store.liked.songs.length - 1)]).then(data => {
        const res = data.data
        if (res.lrc !== undefined) {
            const isInstrumental = res.lrc.lyric.split('\n').filter((l: string) => l.includes('纯音乐，请欣赏'))
            if (isInstrumental.length === 0) {
                lyric.value = res.lrc.lyric
            }
        }
    })
}
const loadData = () => {
    if (store.liked.songsWithDetails.length > 0) {
        show.value = true
        store.fetchLikedSongsWithDetails()
        getRandomLyric()
    } else {
        store.fetchLikedSongsWithDetails().then(() => {
            show.value = true
            getRandomLyric()
        })
    }
    nextTick(() => {
        console.log(liked)
    })
    store.fetchLikedPlaylist()
    store.fetchLikedSongs()
    store.fetchLikedAlbums()
    store.fetchPlayHistory()
    store.fetchLikedArtists()
    store.fetchCloudDisk()
    store.fetchLikedMVs()
}
loadData()

</script>

<style scoped lang="scss">
h1 {
  font-size: 42px;
  color: var(--color-text);
  display: flex;
  align-items: center;

  .avatar {
    height: 44px;
    margin-right: 12px;
    vertical-align: -7px;
    border-radius: 50%;
    border: rgba(0, 0, 0, 0.2);
  }
}

.section-one {
  margin-top: 24px;

  .songs {
    flex: 7;
    margin-top: 8px;
    margin-left: 36px;
    overflow: hidden;
  }
}

.liked-songs {
  flex: 3;
  margin-top: 8px;
  cursor: pointer;
  border-radius: 16px;
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.4s;
  box-sizing: border-box;
  background: var(--color-primary-bg);

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-primary);

    .title {
      font-size: 24px;
      font-weight: 700;
    }

    .sub-title {
      font-size: 15px;
      margin-top: 2px;
    }

    button {
      margin-bottom: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 44px;
      width: 44px;
      background: var(--color-primary);
      border-radius: 50%;
      transition: 0.2s;
      box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.2);
      cursor: default;

      .el-icon {
        color: var(--color-primary-bg);
      }

      &:hover {
        transform: scale(1.06);
        box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.4);
      }

      &:active {
        transform: scale(0.94);
      }
    }
  }
}

.section-one{
  user-select: none;
}
</style>
