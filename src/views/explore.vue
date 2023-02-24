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
  </div>
</template>

<script lang="ts" setup>
import {useStore} from "@/store";
import {More} from "@icon-park/vue-next";
import {computed, ref} from "vue";
import {playlistCategories} from "@/utils/staticData";

const store = useStore()
const settings = computed(() => store.settings)

const show = ref(false)
const playlists = ref([])
const activeCategory = ref('全部')
const loadingMore = ref(false)
const allBigCats = ref(['语种', '风格', '场景', '情感', '主题'])
const showCatOptions = ref(false)
const hasMore = ref(true)
const showLoadMoreButton = ref(false)

const loadData = () => {

}

const getCatsByBigCat = (name: string) => {
  return playlistCategories.filter((c: any) => c.bigCat === name)
}
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
</style>
