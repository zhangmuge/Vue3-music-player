<template>
  <div class="cover-row" :style="rowStyles">
    <div
        v-for="item in items"
        :key="item.id"
        class="item"
        :class="{ artist: type === 'artist' }"
    >
      <Cover
          :id="item.id"
          :image-url="getImageUrl(item)"
          :type="type"
          :play-button-size="type === 'artist' ? 26 : playButtonSize"
      />
      <div class="text">
        <div v-if="showPlayCount" class="info">
          <span class="play-count"
          ><el-icon><play/></el-icon>{{
              filter(item.playCount)
            }}
          </span>
        </div>
        <div class="title" :style="{ fontSize: subTextFontSize }">
          <span v-if="isExplicit(item)" class="explicit-symbol"
          ><ExplicitSymbol
          /></span>
          <span v-if="isPrivacy(item)" class="lock-icon">
            <el-icon class="lock-icon"><lock size="12"/></el-icon></span>
          <router-link :to="getTitleLink(item)">{{ item.name }}</router-link>
        </div>
        <div v-if="type !== 'artist' && subText !== 'none'" class="info">
          <span v-html="getSubText(item)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed} from "vue";
import {Play, Lock} from "@icon-park/vue-next";
import Cover from "@/components/Cover.vue";

const props = defineProps({
  items: {type: Array, required: true},
  type: {type: String, required: true},
  subText: {type: String, default: 'null'},
  subTextFontSize: {type: String, default: '16px'},
  showPlayCount: {type: Boolean, default: false},
  columnNumber: {type: Number, default: 5},
  gap: {type: String, default: '44px 24px'},
  playButtonSize: {type: Number, default: 22},
})
const rowStyles = computed(() => {
  return {
    'grid-template-columns': `repeat(${props.columnNumber}, 1fr)`,
    gap: props.gap,
  }
})
const getSubText = (item: any) => {
  if (props.subText === 'copywriter') return item.copywriter;
  if (props.subText === 'description') return item.description;
  if (props.subText === 'updateFrequency') return item.updateFrequency;
  if (props.subText === 'creator') return 'by ' + item.creator.nickname;
  if (props.subText === 'releaseYear')
    return new Date(item.publishTime).getFullYear();
  if (props.subText === 'artist') {
    if (item.artist !== undefined)
      return `<a href="/#/artist/${item.artist.id}">${item.artist.name}</a>`;
    if (item.artists !== undefined)
      return `<a href="/#/artist/${item.artists[0].id}">${item.artists[0].name}</a>`;
  }
  if (props.subText === 'albumType+releaseYear') {
    let albumType = item.type;
    if (item.type === 'EP/Single') {
      albumType = item.size === 1 ? 'Single' : 'EP';
    } else if (item.type === 'Single') {
      albumType = 'Single';
    } else if (item.type === '专辑') {
      albumType = 'Album';
    }
    return `${albumType} · ${new Date(item.publishTime).getFullYear()}`;
  }
}
const isPrivacy = (item: any) => {
  return props.type as string === 'playlist' && item.privacy === 10;
}
const isExplicit = (item: any) => {
  return props.type as string === 'album' && item.mark === 1056768;
}
const getTitleLink = (item: any) => {
  return `/${props.type}/${item.id}`;
}
const getImageUrl = (item: any) => {
  if (item.img1v1Url) {
    let img1v1ID = item.img1v1Url.split('/');
    img1v1ID = img1v1ID[img1v1ID.length - 1];
    if (img1v1ID === '5639395138885805.jpg') {
      return 'https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=512y512';
    }
  }
  let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
  return `${img?.replace('http://', 'https://')}?param=512y512`;
}
</script>

<style lang="scss" scoped>
.cover-row {
  display: grid;
}

.item {
  color: var(--color-text);

  .text {
    margin-top: 8px;

    .title {
      font-size: 16px;
      font-weight: 600;
      line-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-all;
    }

    .info {
      font-size: 12px;
      opacity: 0.68;
      line-height: 18px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-word;
    }
  }
}

.item.artist {
  display: flex;
  flex-direction: column;
  text-align: center;

  .cover {
    display: flex;
  }

  .title {
    margin-top: 4px;
  }
}

@media (max-width: 834px) {
  .item .text .title {
    font-size: 14px;
  }
}

.explicit-symbol {
  opacity: 0.28;
  color: var(--color-text);
  float: right;

  .el-icon {
    margin-bottom: -3px;
  }
}

.lock-icon {
  opacity: 0.28;
  color: var(--color-text);
  margin-right: 4px;
  // float: right;
}

.play-count {
  font-weight: 600;
  opacity: 0.58;
  color: var(--color-text);
  font-size: 12px;

  .el-icon {
    margin-right: 3px;
    height: 8px;
    width: 8px;
  }
}
</style>
