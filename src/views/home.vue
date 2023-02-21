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
      <div class="title"> For You </div>
      <div class="for-you-row">
        <daily-tracks-card ref="DailyTracksCardRef"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CoverRow from "../components/CoverRow.vue";
import {onBeforeMount, ref} from "vue";
import {getRecommendPlayList} from "@/utils/playlist";
import axios from "axios";
import request from "@/utils/request";
import DailyTracksCard from "@/components/DailyTracksCard.vue";
const recommendPlayList = ref([]);
const show = ref(true);
const DailyTracksCardRef=ref();
onBeforeMount(() => {
  getRecommendPlayList(10, false).then(res => recommendPlayList.value = res.data.result)
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
