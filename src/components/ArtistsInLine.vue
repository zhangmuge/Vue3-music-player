<template>
  <span class="artist-in-line">
    {{ computedPrefix }}
    <span v-for="(ar,index) in filteredArtists" :key="index">
      <router-link v-if="ar.id!==0" :to="`/artist/${ar.id}`">
        {{ ar.name }}
      </router-link>
      <span v-else>{{ ar.name }}</span>
      <span v-if="index !==filteredArtists.length-1" class="separator">,</span>
    </span>
  </span>
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = defineProps({
  artists: {
    type: Array,
    required: true
  },
  exclude: {
    type: String,
    default: '',
  },
  prefix: {
    type: String,
    default: ''
  }
})
const filteredArtists = computed(() => {
  return props.artists?.filter((a: any) => a.name !== props.exclude);
})
const computedPrefix = computed(() => {
  if (filteredArtists.value.length !== 0)
    return props.prefix
  else
    return ''
})
</script>

<style scoped lang="scss">
.separator {
  margin-left: 1px;
  margin-right: 4px;
  position: relative;
  top: 0.5px;
}
</style>
