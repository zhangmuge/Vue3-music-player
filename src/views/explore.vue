<template>
    <div class="explore-page">
        <h1>发现</h1>
        <div class="buttons">
            <div v-for="category in settings.enabledPlaylistCategories"
                 :key="category"
                 class="button"
                 :class="{active:category===activeCategory&&!showCatOptions}"
                 @click="goToCategory(category)"
            >
                {{ category }}
            </div>
            <div class="button more" :class="{active:showCatOptions}"
                 @click="showCatOptions=!showCatOptions">
                <More/>
            </div>
        </div>

        <div v-show="showCatOptions" class="panel">
            <div v-for="bigCat in allBigCats" :key="bigCat" class="big-cat">
                <div class="name">{{ bigCat }}</div>
                <div class="cats">
                    <div v-for="cat in getCatsByBigCat(bigCat)"
                         :key="cat.name"
                         class="cat"
                         :class="{active:settings.enabledPlaylistCategories.includes(cat.name)}"
                         @click="toggleCat(cat.name)">
                        <span>{{ cat.name }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="playlists">
            <CoverRow type="playlist" :items="playlists" :sub-text="subText"
                      :show-play-count="activeCategory!=='排行榜'"
                      :show-play-button="true"
                      :image-size="activeCategory!=='排行榜'?512:1024"/>
        </div>
        <div v-show="['推荐歌单','排行榜'].includes(activeCategory)===false"
             class="load-more">
            <ButtonTwoTone
                    v-show="showLoadMoreButton &&hasMore"
                    color="grey"
                    :loading="loadingMore"
                    @click="getPlaylist">加载更多
            </ButtonTwoTone>
        </div>
    </div>
</template>

<script lang="ts" setup>
import useStore from "@/store";
import {More} from "@icon-park/vue-next";
import {computed, onActivated, ref} from "vue";
import {playlistCategories} from "@/utils/staticData";
import CoverRow from "@/components/CoverRow.vue";
//@ts-ignore
import NProcess from 'nprogress'
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {getRecommendPlayList} from "@/utils/playlist";
import {highQualityPlaylist, toplists, topPlaylist} from "@/api/playlist";
import ButtonTwoTone from "@/components/ButtonTwoTone.vue";
import router from "@/router";

const store = useStore()
const settings = computed(() => store.settings)

const show = ref(false)
const playlists = ref<any[]>([])
const activeCategory = ref('全部')
const loadingMore = ref(false)
const allBigCats = ref(['语种', '风格', '场景', '情感', '主题'])
const showCatOptions = ref(false)
const hasMore = ref(true)
const showLoadMoreButton = ref(false)
const route = useRoute()
const loadData = () => {
    setTimeout(() => {
        if (!show.value)
            NProcess.start()
    }, 1000);
    activeCategory.value = route.query.category === null || undefined ? '全部' : route.query.category as string
    getPlaylist();
}
const getPlaylist = () => {
    loadingMore.value = true
    if (activeCategory.value === '推荐歌单') {
        return getRecomPlayList()
    }
    if (activeCategory.value === '精品歌单') {
        return getHighQualityPlaylist();
    }
    if (activeCategory.value === '排行榜') {
        return getTopLists();
    }
    return getTopPlayList();
}

const getHighQualityPlaylist = () => {
    let playlist = playlists;
    let before =
        playlist.value.length !== 0 ? playlist.value[playlist.value.length - 1].updateTime : 0;
    highQualityPlaylist({limit: 50, before}).then(data => {
        const res = data.data
        updatePlaylist(res.playlists);
        hasMore.value = res.more;
    });
}
const getTopLists = () => {
    toplists().then(data => {
        const res = data.data
        playlists.value = [];
        updatePlaylist(res.list);
    });
}
const getTopPlayList = () => {
    topPlaylist({
        order: 'hot',
        cat: activeCategory.value,
        offset: playlists.value.length,
    }).then(data => {
        updatePlaylist(data.data.playlists);
        hasMore.value = data.data.more;
    });
}
const getRecomPlayList = () => {
    getRecommendPlayList(100, true).then((res: any) => {
        playlists.value = []
        updatePlaylist(res)
    })
}
const updatePlaylist = (playlist: []) => {
    playlists.value.push(...playlist)
    loadingMore.value = false
    showLoadMoreButton.value = true
    NProcess.done()
    show.value = true
}
const subText = computed(() => {
    if (activeCategory.value === '排行榜')
        return 'updateFrequency'
    if (activeCategory.value === '推荐歌单')
        return 'copywriter'
    return 'none';
})
const goToCategory = (Category: string) => {
    showCatOptions.value = false
    router.push({name: 'explore', query: {category: Category}}).catch(err => {
    })
}
const getCatsByBigCat = (name: string) => {
    return playlistCategories.filter((c: any) => c.bigCat === name)
}
const toggleCat = (name: string) => {
    store.togglePlaylistCategory(name);
}
onActivated(() => {
    loadData()
})
onBeforeRouteUpdate((to, from, next) => {
    showLoadMoreButton.value = false
    hasMore.value = true
    playlists.value = []
    activeCategory.value = to.query.category as string
    getPlaylist()
    next()
})
</script>

<style scoped lang="scss">
h1 {
  color: var(--color-text);
  font-size: 56px;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
}

.button {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  padding: 8px 16px;
  margin: 10px 16px 6px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  border-radius: 10px;
  background-color: var(--color-secondary-bg);
  color: var(--color-secondary);
  transition: 0.2s;

  &:hover {
    background-color: var(--color-primary-bg);
    color: var(--color-primary)
  }
}

.button.active {
  background-color: var(--color-primary-bg);
  color: var(--color-primary);
}

.panel {
  margin-top: 10px;
  background: var(--color-secondary-bg);
  border-radius: 10px;
  padding: 8px;
  color: var(--color-text);

  .big-cat {
    display: flex;
    margin-bottom: 32px;
  }

  .name {
    font-size: 24px;
    font-weight: 700;
    opacity: 0.68;
    margin-left: 24px;
    min-width: 54px;
    height: 26px;
    margin-top: 8px;
  }

  .cats {
    margin-left: 24px;
    display: flex;
    flex-wrap: wrap;
  }

  .cat {
    user-select: none;
    margin: 4px 0px 0 0;
    display: flex;
    // justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
    transition: 0.2s;
    min-width: 98px;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 6px 12px;
      height: 26px;
      border-radius: 10px;
      opacity: 0.88;

      &:hover {
        opacity: 1;
        background-color: var(--color-primary-bg);
        color: var(--color-primary);
      }
    }
  }

  .cat.active {
    color: var(--color-primary);
  }
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
