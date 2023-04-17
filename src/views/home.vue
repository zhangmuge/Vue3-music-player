<template>
  <div v-show="show" class="home">
    <div class="index-row">
      <div class="title">
        推荐歌单
        <router-link to="/explore?category=推荐歌单">
          查看更多
        </router-link>
      </div>
      <CoverRow
          :type="'playlist'"
          :items="recommendPlayList"
          sub-text="copywriter"/>
    </div>
    <div class="index-row">
      <div class="title"> For You</div>
      <div class="for-you-row">
        <daily-tracks-card ref="DailyTracksCardRef"/>
        <FMCard/>
      </div>
    </div>
    <div class="index-row">
      <div class="title">推荐艺人</div>
      <CoverRow type="artist" :items="recommendArtists.items" :column-number="6"/>
    </div>
    <div class="index-row">
      <div class="title">
        新专速递
        <router-link to="/new-album">查看更多</router-link>
      </div>
      <CoverRow type="album" :items="newReleasesAlbum.item" sub-text="artist"/>
    </div>
    <div class="index-row">
      <div class="title">
        排行榜
        <router-link to="/explore?category=排行榜">查看更多</router-link>
      </div>
      <CoverRow type="playlist" :items="topList.items" sub-text="updateFrequency"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CoverRow from "../components/CoverRow.vue";
import {onActivated, onBeforeMount, ref} from "vue";
import {getRecommendPlayList} from "@/utils/playlist";
import DailyTracksCard from "@/components/DailyTracksCard.vue";
import FMCard from "@/components/FMCard.vue";
import {toplistOfArtists} from "@/api/artists";
import {toplists} from "@/api/playlist";
import {newAlbums} from "@/api/album";
//@ts-ignore
import NProgress from 'nprogress'

const newReleasesAlbum = ref<{ item: any[] }>({item: []})
const recommendPlayList = ref([]);
const show = ref(false);
const recommendArtists = ref<{ items: any[], indexs: any[] }>({items: [], indexs: []})
const DailyTracksCardRef = ref();
const topList = ref<{ items: any[], ids: any[] }>({items: [], ids: [19723756, 180106, 60198, 3812895, 60131]})
onActivated(() => {
  getRecommendPlayList(10, false).then(res => {
    recommendPlayList.value = res
    show.value = true
  })
  toplistOfArtists().then((res: any) => {
    const data = res.data
    let indexs: any[] = [];
    while (indexs.length < 6) {
      let tmp = ~~(Math.random() * 100);
      if (!indexs.includes(tmp)) indexs.push(tmp);
    }
    recommendArtists.value.indexs = indexs;
    recommendArtists.value.items = data.list.artists.filter((l: any, index: any) =>
        indexs.includes(index)
    );
  })
  toplists().then((res: any) => {
    const data = res.data
    topList.value.items = data.list.filter((l: any) =>
        topList.value.ids.includes(l.id)
    )
  })
  newAlbums({
    area: "ALL",
    limit: 10
  }).then(((res: any) => {
    newReleasesAlbum.value.item = res.data.albums
  }))
})

</script>

<style scoped lang="scss">
.index-row {
  margin-top: 54px;
}

.index-row.first-row {
  margin-top: 32px;
}

.playlists {
  display: flex;
  flex-wrap: wrap;
  margin: {
    right: -12px;
    left: -12px;
  }

  .index-playlist {
    margin: 12px 12px 24px 12px;
  }
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);

  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
}

footer {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}

.for-you-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 78px;
}
</style>
