<template>
  <div
      class="track"
      :class="trackClass"
  >

  </div>
</template>

<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, ref} from "vue";
import {useStore} from "@/store";
import {isNil} from "lodash";

const props = defineProps({
  trackProp: Object,
  highlightPlayingTrack: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'tracklist'
  }
})
const store = useStore()
const hover = ref(false)
const trackStyle = ref({})
const settings = computed(() => {
  return store.settings
})
const track = computed(() => {
  //@ts-ignore
  return props.type === 'cloudDisk' ? props.trackProp.simpleSong : props.trackProp
})
const playable = computed(() => {
  return track.value?.privilege?.pl > 0 || track.value?.playable
})
const imgUrl = computed(() => {
  let image = track.value?.al?.picUrl ?? track.value?.album?.picUrl ?? "https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg";
  return image + "?param=224y224"
})
const artists = computed(() => {
  const {ar, artists} = track.value
  if (!isNil(ar)) return ar
  if (!isNil(artists)) return artists
  return []
})
const album = computed(() => {
  return track.value.album || track.value.al || track.value?.simpleSong?.al
})
const subTitle = computed(() => {
      let tn = undefined;
      if (track.value?.tns?.length > 0 &&
          track.value.name !== track.value.tns[0]
      ) {
        tn = track.value.tns[0]
      }
      if (store.settings.subTitleDefault) {
        return track.value?.alia?.length > 0 ? track.value.alia[0] : tn
      } else {
        return tn === undefined ? track.value.alia[0] : tn
      }
    }
)
const isAlbum = computed(() => {
  return props.type === 'album'
})
const isSubTitle = computed(() => {
  return ((track.value?.tns.length > 0 && track.value.name !== track.value.tns[0]) ||
      track.value.alia?.length > 0
  )
})

onMounted(() => {
  const isLiked = computed(() => {
    const parent = getCurrentInstance()?.parent
    //@ts-ignore
    return parent.liked.songs.includes(track.value.id)
  })
})
</script>

<style scoped>

</style>
