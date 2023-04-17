<template>
  <div class="track-list">
    <div :style="listStyles">
      <TrackListItem
          v-for="(track, index) in props.tracks"
          :key="itemKey === 'id' ? track.id : `${track.id}${index}`"
          :track-prop="track"
          :highlight-playing-track="highlightPlayingTrack"
          @dblclick="playThisList(track.id || track.songId)"
          :type="props.type"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import TrackListItem from "@/components/TrackListItem.vue";

const props = defineProps({
  tracks: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: 'tracklist',
  }, // tracklist | album | playlist | cloudDisk
  id: {
    type: Number,
    default: 0,
  },
  columnNumber: {
    type: Number,
    default: 4
  },
  dbclickTrackFunc: {
    type: String,
    default: 'default',
  },
  albumObject: {
    type: Object,
    default: () => ({
      artist: {
        name: '',
      },
    }),
  },
  itemKey: {
    type: String,
    default: 'id',
  },
  highlightPlayingTrack: {
    type: Boolean,
    default: true,
  },

})
const playThisList = (trackID: number) => {
  // if(props.type==='playlist'){
  //   //
  // }
}
const listStyles = ref({})
const rightClickedTrack = {
  id: 0,
  name: '',
  ar: [{name: ''}],
  al: {picUrl: ''}
}
const rightClickedIndex = ref(-1)
const playThisListDefault = (trackID: number) => {
  // if(props.type==='playlist'){
  //
  // }
}
const created = () => {
  if (props.type === 'tracklist') {
    listStyles.value = {
      display: 'grid',
      gap: '4px',
      gridTemplateColumns: `repeat(${props.columnNumber}, 1fr)`,
    };
  }
}
created()
</script>

<style scoped>

</style>
