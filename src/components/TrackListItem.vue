<template>
  <div
      class="track"
      :class="trackClass"
      :title="track.reason"
      @mouseover="hover=true"
      @mouseleave="hover=false"
  >
    <img
        v-if="!isAlbum"
        :src="imgUrl"
        loading="lazy"
        @click="goToAlbum"/>
    <div v-if="showOrderNumber" class="no">
      <button v-show="playable&&!isPlaying" @click="playTrack">
        <el-icon
            class="play"
            style="height: 14px; width: 14px">
          <PlayOne/>
        </el-icon>
      </button>
      <span v-show="!hover">{{ track.no }}</span>
      <button v-show="isPlaying&&hover">
        <el-icon
            class="volume"
            style="height: 16px; width: 16px">
          <PlayOne/>
        </el-icon>
      </button>
    </div>
    <div class="title-and-artist">
      <div class="container">
        <div class="title">
          {{ track.name }}
          <span v-if="isSubTitle" :title="subTitle" class="sub-title">
            ({{ subTitle }})
          </span>
          <span v-if="isAlbum" class="featured">
            <ArtistsInLine
                :artists="track.ar"
                :exclude="$parent?.$props.albumObject.artist.name"
                prefix="-"
            />
          </span>
        </div>
        <div v-if="!isAlbum" class="artist">
          <ArtistsInLine :artists="artists"/>
        </div>
      </div>
      <div></div>
    </div>
    <div class="album" v-if="showAlbumName">
      <router-link v-if="album && album.id" :to="`/album/${album.id}`">
        {{ album.name }}
      </router-link>
      <div></div>
    </div>
    <div class="actions" v-if="showLikeButton">
      <button @click="likeThisSong">
        <el-icon class="heart" :style="{visibility:!isLiked?'visible':'hidden'}">
          <like/>
        </el-icon>
        <el-icon class="heart-solid" v-show="isLiked">
          <like theme="fill"/>
        </el-icon>
      </button>
    </div>
    <div class="time" v-if="showTrackTime">
      {{ formatTime(track.dt) }}
    </div>
    <div v-if="track.playCount" class="count">{{ track.playCount }}</div>
  </div>
</template>

<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, ref} from "vue";
import useStore from "@/store";
import {isNil} from "lodash";
import router from "@/router";
import {PlayOne, Like} from "@icon-park/vue-next";
import ArtistsInLine from "@/components/ArtistsInLine.vue";

const formatTime = (time: number) => {
  const minute = Math.floor(time / 1000 / 60);
  const second = Math.floor(time / 1000 % 60);
  return `${minute}:${second < 10 ? '0' + second : second}`;
}
const props = defineProps({
  trackProp: Object,
  highlightPlayingTrack: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'tracklist'
  },
  liked: {
    type: Object,
  },
})
const isLiked = (id: number) => {
  //@ts-ignore
  return props.liked.songs.include(track.value.id)
}
const showOrderNumber = computed(() => {
  return props.type === 'album'
})
const isPlaying = computed(() => {
  return store.player.currentTrack.id
})
const isMenuOpened = computed(() => {
  //@ts-ignore
  return false
})
const trackClass = () => {
  let trackClass = [props.type]
  if (!playable.value)
    trackClass.push('disable')
  if (isPlaying.value && props.highlightPlayingTrack)
    trackClass.push('playing')
  if (focus.value)
    trackClass.push('focus')
  return trackClass;
}
const store = useStore()
const hover = ref(false)
const trackStyle = ref({})
const settings = computed(() => {
  return store.settings
})
const showLikeButton = computed(() => {
  return props.type === 'tracklist' || props.type === 'cloudDisk'
})
const showAlbumName = computed(() => {
  return props.type !== 'tracklist' && props.type !== 'album'
})
const showTrackTime = computed(() => {
  return props.type !== 'tracklist'
})
const track = computed(() => {
  //@ts-ignore
  return props.type === 'cloudDisk' ? props.trackProp.simpleSong : props.trackProp
})
const playable = computed(() => {
  return track.value?.privilege?.pl > 0 || track.value?.playable
})
const imgUrl = computed(() => {
  let image = track.value?.al?.picUrl ?? track.value?.album?.picUrl ?? "https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg";
  return image + "?param=224y224"
})
const artists = computed(() => {
  const {ar, artists} = track.value
  if (!isNil(ar)) return ar
  if (!isNil(artists)) return artists
  return []
})
const album = computed(() => {
  return track.value.album || track.value.al || track.value?.simpleSong?.al
})
const subTitle = computed(() => {
      let tn = undefined;
      if (track.value?.tns?.length > 0 &&
          track.value.name !== track.value.tns[0]
      ) {
        tn = track.value.tns[0]
      }
      if (store.settings.subTitleDefault) {
        return track.value?.alia?.length > 0 ? track.value.alia[0] : tn
      } else {
        return tn === undefined ? track.value.alia[0] : tn
      }
    }
)
const isAlbum = computed(() => {
  return props.type === 'album'
})
const isSubTitle = computed(() => {
  return ((track.value?.tns?.length > 0 && track.value.name !== track.value.tns[0]) ||
      track.value.alia?.length > 0
  )
})
const goToAlbum = () => {
  if (track.value.al.id === 0)
    return;
  router.push({path: '/album' + track.value.al.id})
}

const emit = defineEmits(['playThisList', 'likeATrack'])
const playTrack = () => {
  emit("playThisList", track.value.id)
}
const likeThisSong = () => {
  emit("likeATrack", track.value.id)
}
</script>

<style scoped lang="scss">
button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background: transparent;
  border-radius: 25%;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.12);
  }

  .el-icon {
    color: var(--color-primary)
  }

  &:active {
    transform: scale(0.96);
  }
}

.track {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 12px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &:hover{
    transition: all 0.3s;
    background: var(--color-secondary-bg);
  }
  .no {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    margin: 0 20px 0 10px;
    width: 12px;
    color: var(--color-text);
    cursor: default;

    span {
      opacity: 0.58;
    }
  }

  img {
    border-radius: 8px;
    height: 46px;
    width: 46px;
    margin-right: 20px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    cursor: pointer;
  }
  img.hover {
    filter: drop-shadow(100 200 0 black);
  }
  .title-and-artist {
    flex: 1;
    display: flex;

    .container {
      display: flex;
      flex-direction: column;
    }

    .title {
      font-size: 18px;
      color: var(--color-text);
      font-weight: 600;
      cursor: default;
      padding-right: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;

      .featured {
        margin-right: 2px;
        font-weight: 500;
        font-size: 14px;
        opacity: 0.72;
      }

      .sub-title {
        color: #7a7a7b;
        opacity: 0.7;
        margin-left: 4px;
      }
    }

    .artist {
      margin-top: 2px;
      font-size: 13px;
      opacity: 0.68;
      color: var(--color-text);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;

      a {
        span {
          margin-right: 3px;
          opacity: 0.8;
        }

        &:hover {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }

  .album {
    flex: 1;
    display: flex;
    font-size: 16px;
    opacity: 0.88;
    color: var(--color-text);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .time,
  .count {
    font-size: 16px;
    width: 50px;
    cursor: default;
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
    font-variant-numeric: tabular-nums;
    opacity: 0.88;
    color: var(--color-text);
  }

  .count {
    font-weight: bold;
    font-size: 22px;
    line-height: 22px;
  }
}

.track.focus {
  transition: all 0.3s;
  background: var(--color-secondary-bg);
}

.track.disable {
  img {
    filter: grayscale(1) opacity(0.6);
  }

  .title,
  .artist,
  .album,
  .time,
  .no,
  .featured {
    opacity: 0.28 !important;
  }

  &:hover {
    background: none;
  }
}

.track.tracklist {
  img {
    height: 36px;
    width: 36px;
    border-radius: 6px;
    margin-right: 14px;
    cursor: pointer;
  }

  .title {
    font-size: 16px;
  }

  .artist {
    font-size: 12px;
  }
}

.track.album {
  height: 32px;
}

.actions {
  width: 80px;
  display: flex;
  justify-content: flex-end;
}

.track.playing {
  background: var(--color-primary-bg);
  color: var(--color-primary);

  .title,
  .album,
  .time,
  .title-and-artist .sub-title {
    color: var(--color-primary);
  }

  .title .featured,
  .artist,
  .explicit-symbol,
  .count {
    color: var(--color-primary);
    opacity: 0.88;
  }

  .no span {
    color: var(--color-primary);
    opacity: 0.78;
  }
}
</style>
