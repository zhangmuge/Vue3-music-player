<template>
  <div v-show="show" ref="library">
    <h1>
      <img
          class="avatar"
          :src="resizeImage(data.user.avatarUrl)"
          loading="lazy"/>
      {{ data.user.nickname }}{{ '的音乐库' }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useStore} from "@/store";

const store = useStore()
const show = ref(true)
const data = computed(() => {
  return store.data
})
const resizeImage = (imgUrl: string, size = 512) => {
  if (!imgUrl) return '';
  let httpsImgUrl = imgUrl;
  if (imgUrl.slice(0, 5) !== 'https') {
    httpsImgUrl = 'https' + imgUrl.slice(4);
  }
  return `${httpsImgUrl}?param=${size}y${size}`;
}
</script>

<style scoped>

</style>
