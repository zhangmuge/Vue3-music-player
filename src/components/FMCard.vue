<template>
  <div class="fm" :style="{ background }" data-theme="dark">
    <img :src="nextTrackCover" style="display: none" loading="lazy"/>
    <img
        class="cover"
        :src="resideImage('https://p1.music.126.net/3zmjzsIbgqSiSXyuan-5uA==/109951168170954273.jpg')"
        loading="lazy"
        @click="goToAlbum"
    />
    <div class="right-part">
      <div class="info">
        <div class="title">{{ '测试' }}</div>
        <div class="artist">
          <ArtistsInLine :artists="['周杰伦']"/>
        </div>
      </div>
      <div class="controls">
        <div class="buttons">
          <el-button title="不喜欢">
            <template #icon>
              <el-icon :size="32">
                <dislike theme="filled"/>
              </el-icon>
            </template>
          </el-button>
          <el-button class="play">
            <template #icon>
              <el-icon :size="32">
                <play-one theme="filled"/>
              </el-icon>
            </template>
          </el-button>
          <el-button>
            <template #icon>
              <el-icon :size="32">
                <go-end theme="filled"/>
              </el-icon>
            </template>
          </el-button>
        </div>
        <div class="card-name">
          <el-icon :size="18">
            <radio-one theme="filled"/>
          </el-icon>
          私人FM
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import ArtistsInLine from "@/components/ArtistsInLine.vue";
import {Dislike, PlayOne, GoEnd, RadioOne} from "@icon-park/vue-next";

const background = ref('')
const nextTrackCover = ref('');
const resideImage = (imgUrl: string, size = 512) => {
  if (!imgUrl) return '';
  let httpsImgUrl = imgUrl;
  if (imgUrl.slice(0, 5) !== 'https') {
    httpsImgUrl = 'https' + imgUrl.slice(4);
  }
  return `${httpsImgUrl}?param=${size}y${size}`;
}
const goToAlbum = () => {

}
</script>

<style lang="scss" scoped>
.fm {
  padding: 1rem;
  background: var(--color-secondary-bg);
  border-radius: 1rem;
  display: flex;
  height: 198px;
  box-sizing: border-box;
}

.cover {
  height: 100%;
  clip-path: border-box;
  border-radius: 0.75rem;
  margin-right: 1.2rem;
  cursor: pointer;
  user-select: none;
}

.right-part {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--color-text);
  width: 100%;

  .title {
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 0.6rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }

  .artist {
    opacity: 0.68;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: -0.4rem;

    .buttons {
      display: flex;
    }

    .el-button {
      margin: 0 8px 0 0;
    }


    .card-name {
      font-size: 1rem;
      opacity: 0.18;
      display: flex;
      align-items: center;
      font-weight: 600;
      user-select: none;

      .el-icon {
        width: 18px;
        height: 18px;
        margin-right: 6px;
      }
    }
  }
}

.el-button {
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background: transparent;
  margin: 4px;
  border-radius: 25%;
  transition: 0.2s;
  border: none;

  .el-icon {
    color: var(--color-text);
    height: 16px;
    width: 16px;
  }

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    background: var(--color-secondary-bg-for-transparent);
  }

  &:active {
    transform: scale(0.92);
  }
}

</style>
