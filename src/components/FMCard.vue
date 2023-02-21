<template>
  <div class="fm" :style="{ background }" data-theme="dark">
    <img :src="nextTrackCover" style="display: none" loading="lazy" />
    <img
        class="cover"
        :src="track.album && track.album.picUrl | resizeImage(512)"
        loading="lazy"
        @click="goToAlbum"
    />
    <div class="right-part">
      <div class="info">
        <div class="title">{{ track.name }}</div>
        <div class="artist"><ArtistsInLine :artists="artists" /></div>
      </div>
      <div class="controls">
        <div class="buttons">
          <button-icon title="不喜欢" @click.native="moveToFMTrash">
            <svg-icon id="thumbs-down" icon-class="thumbs-down" />
          </button-icon>
          <button-icon
              :title="$t(isPlaying ? 'player.pause' : 'player.play')"
              class="play"
              @click.native="play"
          >
            <svg-icon :icon-class="isPlaying ? 'pause' : 'play'" />
          </button-icon>
          <button-icon :title="$t('player.next')" @click.native="next">
            <svg-icon icon-class="next" />
          </button-icon>
        </div>
        <div class="card-name"><svg-icon icon-class="fm" />私人FM</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";

const background=ref('')


</script>

<style scoped lang="scss">

</style>
