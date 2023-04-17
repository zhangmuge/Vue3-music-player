<template>
    <div v-show="show" class="album-page">
        <div class="playlist-info">
            <Cover
                    :id="album.id"
                    :image-url="resizeImage(album.picUrl,1024)"
                    :show-play-button="true"
                    :always-show-shadow="true"
                    :click-cover-to-play="true"
                    :fixed-size="288"
                    type="album"
                    :cover-hover="false"
                    :play-button-size="18"
            />
            <div class="info">
                <div class="title"> {{ title }}</div>
                <div v-if="subtitle !== ''" class="subtitle">{{
                    subtitle
                    }}
                </div>
                <div class="artist">
          <span>
            <span>{{ formatAlbumType(album.type, album) }} by </span
            ><router-link :to="`/artist/${album.artist.id}`">{{
              album.artist.name
              }}</router-link></span
          >
                    <!--                    <span v-else>Compilation by Various Artists</span>-->
                </div>
                <div class="date-and-count">
                    <span :title="formatDate(album.publishTime)">{{
                        new Date(album.publishTime).getFullYear()
                        }}</span>
                    <span> · {{ album.size }} 首歌</span
                    >,
                    {{ formatTime(albumTime, 'Human') }}
                </div>
                <!--                <el-popover-->
                <!--                        placement="bottom"-->
                <!--                        title="专辑介绍"-->
                <!--                        :width="800"-->
                <!--                        trigger="click"-->
                <!--                        :content="album.description"-->
                <!--                >-->
                <!--                    <template #reference>-->
                <!--                        -->
                <!--                    </template>-->
                <!--                </el-popover>-->
                <div class="description" @click="toggleFullDescription">
                    {{ album.description }}
                </div>
                <div class="buttons" style="margin-top: 32px">
                    <ButtonTwoTone
                            icon-class="play"
                            @click="playAlbumByID(album.id)"
                    >播放
                    </ButtonTwoTone>
                    <!--                    <ButtonTwoTone-->
                    <!--                            :icon-class="dynamicDetail.isSub ? 'heart-solid' : 'heart'"-->
                    <!--                            :icon-button="true"-->
                    <!--                            :horizontal-padding="0"-->
                    <!--                            :color="dynamicDetail.isSub ? 'blue' : 'grey'"-->
                    <!--                            :text-color="dynamicDetail.isSub ? '#335eea' : ''"-->
                    <!--                            :background-color="-->
                    <!--              dynamicDetail.isSub ? 'var(&#45;&#45;color-secondary-bg)' : ''-->
                    <!--            "-->
                    <!--                            @click.native="likeAlbum"-->
                    <!--                    >-->
                    <!--                    </ButtonTwoTone>-->
                </div>
            </div>
        </div>
        <div v-if="tracksByDisc.length > 1">
            <div v-for="item in tracksByDisc" :key="item.disc">
                <h2 class="disc">Disc {{ item.disc }}</h2>
                <TrackList
                        :id="album.id"
                        :tracks="item.tracks"
                        :type="'album'"
                        :album-object="album"
                />
            </div>
        </div>
        <div v-else>
            <TrackList
                    :id="album.id"
                    :tracks="tracks"
                    :type="'album'"
                    :album-object="album"
            />
        </div>
        <div class="extra-info">
            <div class="album-time"></div>
            <div class="release-date">
                发行于
                {{ formatDate(album.publishTime, 'MMMM D, YYYY') }}
            </div>
            <div v-if="album.company !== null" class="copyright">
                © {{ album.company }}
            </div>
        </div>
        <div v-if="filteredMoreAlbums.length !== 0" class="more-by">
            <div class="section-title">
                More by
                <router-link :to="`/artist/${album.artist.id}`"
                >{{ album.artist.name }}
                </router-link>
            </div>
            <div>
                <CoverRow
                        type="album"
                        :items="filteredMoreAlbums"
                        sub-text="albumType+releaseYear"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import CoverRow from "@/components/CoverRow.vue";
import Cover from "@/components/Cover.vue";
import {computed, onMounted, ref} from "vue";
import {groupBy, sortBy, toPairs} from "lodash";
import useStore from "@/store";
import {albumDynamicDetail, getAlbum, likeAAlbum} from "@/api/album";
import {isAccountLoggedIn} from "@/utils/auth";
import {splitAlbumTitle, splitSoundtrackAlbumTitle} from "@/utils/common";
import {getTrackDetail} from "@/api/track";
import {getArtistAlbum} from "@/api/artists";
import dayjs from "dayjs";
import ButtonTwoTone from "@/components/ButtonTwoTone.vue";
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import {onBeforeRouteUpdate} from "vue-router";
import {useRoute} from "vue-router";
import TrackList from "@/components/TrackList.vue";
import {ElMessageBox} from "element-plus";

const route = useRoute()

interface Album {
    id: number,
    picUrl: string,
    artist: {
        id: number,
        name?: string
    },
    name: string,
    type: string,
    publishTime: string,
    size: number,
    description: string,
    company: string | null,
    songs: any[],

}

const show = ref(false);
const album = ref({} as Album);
const showFullDescription = ref(false);
const moreAlbums = ref([]);
const title = ref('');
const tracks = ref([] as any[]);
const subtitle = ref('');
const dynamicDetail = ref({} as any);
const albumTime = computed(() => {
    let time = 0;
    tracks.value.map((item: any) => {
        time += item.dt;
    });
    return time;
});
const formatTime = (Milliseconds: number, format = 'HH:MM:SS') => {
    if (!Milliseconds) return '';
    dayjs.extend(duration);
    dayjs.extend(relativeTime);

    let time = dayjs.duration(Milliseconds);
    let hours = time.hours().toString();
    let mins = time.minutes().toString();
    //@ts-ignore
    let seconds = time.seconds().toString().padStart(2, '0');

    if (format === 'HH:MM:SS') {
        return hours !== '0'
            //@ts-ignore
            ? `${hours}:${mins.padStart(2, '0')}:${seconds}`
            : `${mins}:${seconds}`;
    } else if (format === 'Human') {
        const hoursUnit = '小时', minitesUnit = '分钟';
        return hours !== '0'
            ? `${hours} ${hoursUnit} ${mins} ${minitesUnit}`
            : `${mins} ${minitesUnit}`;
    }

}
const filteredMoreAlbums = computed(() => {
    let moreAlbums_t = moreAlbums.value.filter((a: any) => a.id !== album.value.id);
    let realAlbums = moreAlbums_t.filter((a: any) => a.type === '专辑');
    let eps = moreAlbums_t.filter(
        (a: any) => a.type === 'EP' || (a.type === 'EP/Single' && a.size > 1)
    );
    let restItems = moreAlbums_t.filter(
        (a: any) =>
            realAlbums.find((a1: any) => a1.id === a.id) === undefined &&
            eps.find((a1: any) => a1.id === a.id) === undefined
    );
    if (realAlbums.length === 0) {
        return [...realAlbums, ...eps, ...restItems].slice(0, 5);
    } else {
        return [...realAlbums, ...restItems].slice(0, 5);
    }
})
const tracksByDisc = computed(() => {
    if (tracks.value.length <= 1) return [];
    const pairs = toPairs(groupBy(tracks.value, 'cd'));
    return sortBy(pairs, p => p[0]).map((items: any[]) => ({
        disc: items[0],
        tracks: items[1],
    }));
})
const store = useStore();
const playAlbumByID = (id: number, trackID = 'first') => {
    store.player.playAlbumByID(id, trackID);
}
const formatTitle = () => {
    let splitTitle = splitSoundtrackAlbumTitle(album.value.name);
    let splitTitle2 = splitAlbumTitle(splitTitle.title);
    title.value = splitTitle2.title;
    if (splitTitle.subtitle !== '' && splitTitle2.subtitle !== '') {
        subtitle.value = splitTitle.subtitle + ' · ' + splitTitle2.subtitle;
    } else {
        subtitle.value =
            splitTitle.subtitle === ''
                ? splitTitle2.subtitle
                : splitTitle.subtitle;
    }
}
const toggleFullDescription = () => {
    ElMessageBox({
        title: '专辑介绍',
        message: album.value.description,
        showConfirmButton:false
    });
}
const loadData = (id: number) => {
    getAlbum(id).then(
        (res) => {
            album.value = res.album;
            tracks.value = res.songs;
            moreAlbums.value = res.moreAlbums;
            formatTitle();
            show.value = true;

            let trackIDs = tracks.value.map((item: any) => item.id);
            getTrackDetail(trackIDs.join(',')).then((res) => {
                tracks.value = res.songs;
            });

            getArtistAlbum({id: album.value.artist.id, limit: 100}).then((res) => {
                const data = res.data
                moreAlbums.value = data.hotAlbums;
            });
        }
    )
    albumDynamicDetail(id).then(data => {
        dynamicDetail.value = data.data;
    })
}
loadData(Number(route.params.id));
const resizeImage = (imgUrl: string, size = 512) => {
    if (!imgUrl) return '';
    let httpsImgUrl = imgUrl;
    if (imgUrl.slice(0, 5) !== 'https') {
        httpsImgUrl = 'https' + imgUrl.slice(4);
    }
    return `${httpsImgUrl}?param=${size}y${size}`;
}
const formatAlbumType = (type: string, album: any) => {
    if (!type) return '';
    if (type === 'EP/Single') {
        return album.size === 1 ? 'Single' : 'EP';
    } else if (type === 'Single') {
        return 'Single';
    } else if (type === '专辑') {
        return 'Album';
    } else {
        return type;
    }
}
const formatDate = (timestamp: string, format = 'MMM D, YYYY') => {
    if (!timestamp) return '';
    return dayjs(Number(timestamp)).format(format);
}
</script>

<style scoped lang="scss">
.album-page {
  user-select: none;
  margin-top: 32px;
}

.playlist-info {
  display: flex;
  width: 78vw;
  margin-bottom: 72px;

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    margin-left: 56px;
    color: var(--color-text);

    .title {
      font-size: 56px;
      font-weight: 700;
    }

    .subtitle {
      font-size: 22px;
      font-weight: 600;
    }

    .artist {
      font-size: 18px;
      opacity: 0.88;
      margin-top: 24px;

      a {
        font-weight: 600;
      }
    }

    .date-and-count {
      font-size: 14px;
      opacity: 0.68;
      margin-top: 2px;
    }

    .description {
      user-select: none;
      font-size: 14px;
      opacity: 0.68;
      margin-top: 24px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      overflow: hidden;
      cursor: pointer;
      white-space: pre-line;

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

.disc {
  color: var(--color-text);
}

.explicit-symbol {
  opacity: 0.28;
  color: var(--color-text);
  margin-right: 4px;

  .svg-icon {
    margin-bottom: -3px;
  }
}

.extra-info {
  margin-top: 36px;
  margin-bottom: 36px;
  font-size: 12px;
  opacity: 0.48;
  color: var(--color-text);

  div {
    margin-bottom: 4px;
  }

  .album-time {
    opacity: 0.68;
  }
}

.more-by {
  border-top: 1px solid rgba(128, 128, 128, 0.18);

  padding-top: 22px;

  .section-title {
    font-size: 22px;
    font-weight: 600;
    opacity: 0.88;
    color: var(--color-text);
    margin-bottom: 20px;
  }
}

.description-fulltext {
  font-size: 16px;
  margin-top: 24px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-line;
}
</style>
