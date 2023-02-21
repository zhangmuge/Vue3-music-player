<template>
  <div>
    <transition name="fade">
      <div v-show="show"
           id="scrollbar"
           :class="{'on-drag':isOnDrag}"
           @click="handleClick">
        <div id="thumbContainer"
             :class="{active}"
             :style="thumbStyle"
             @mouseenter="handleMouseenter"
             @mouseleave="handleMouseleave"
             @mousedown="handleDragStart"
             @click.stop>
          <div></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {computed, getCurrentInstance, ref} from "vue";
import {useRoute} from "vue-router";

const show = ref<boolean>(false)
const isOnDrag = ref<boolean>(false);
const Instance = getCurrentInstance()
const {value: temp} = computed(() => {
      return Instance?.parent?.refs.main
    }
)
const main = temp as HTMLElement
const handleClick = (e: MouseEvent) => {
  let scrollTop;
  if (e.clientY < top.value + 84) {
    scrollTop = -256;
  } else {
    scrollTop = 256;
  }
  main.scrollBy({
    top: scrollTop,
    behavior: 'smooth'
  })
};
const thumbStyle=computed(()=>{
  return{
    transform:`translateY(${top.value}px)`,
    height: `${thumbHeight.value}px`
  }
})
const top = ref(0);
const thumbHeight = ref(0);
const positions ={
  home: {scrollTop: 0, params: {}},
}
const handleScroll = () => {
  const clintHeight = main.clientHeight - 128;
  const scrollHeight = main.scrollHeight - 128;
  const scrollTop = main.scrollTop;
  let temp_top = ~~((scrollTop / scrollHeight) * clintHeight);
  let temp_thumbHeight = ~~((clintHeight / scrollHeight) * clintHeight);
  if (temp_thumbHeight < 24) temp_thumbHeight = 24;
  if (temp_top > clintHeight - temp_thumbHeight) {
    temp_top = clintHeight - temp_thumbHeight;
  }
  top.value = temp_top
  thumbHeight.value = temp_thumbHeight
  if (show.value && clintHeight !== temp_thumbHeight) show.value = true
  setScrollbarHideTimeout()
  const route = useRoute()
  if (route.meta.savePosition) {
    let name = route.name as string
    positions.home={scrollTop: scrollTop,params: route.params}
    //可能有bug
  }
}
const active=ref(false)
const handleMouseenter=()=>{
  active.value=true;
}
const handleMouseleave=()=>{
  active.value=false;
  setScrollbarHideTimeout()
}
const onDragClientY=ref(0);
const handleDragStart=(e:MouseEvent)=>{
  onDragClientY.value=e.clientY;
  isOnDrag.value=true;
  const t=Instance?.parent as any;
  t.userSelectNone=true;
  document.addEventListener('mousemove',handleDragMove)
  document.addEventListener('mouseup',handleDragEnd)
}
const handleDragMove=(e:MouseEvent)=>{
  if(!isOnDrag.value)
    return;
  const clintHeight = main.clientHeight - 128;
  const scrollHeight = main.scrollHeight - 128;
  const scrollTop = main.scrollTop;
  const clientY=e.clientY;
  const offset=~~(((clientY-onDragClientY.value)/clintHeight)*scrollHeight);
  top.value=~~((scrollTop/scrollHeight)*clintHeight)
  main.scrollBy(0,offset)
  onDragClientY.value=clientY;
}
const handleDragEnd=()=>{
  isOnDrag.value=false;
  const t=Instance?.parent as any;
  t.userSelectNone=false;
  document.removeEventListener('mousemove',handleDragMove)
  document.removeEventListener('mouseup',handleDragEnd)
}
let hideTimer=ref<null|any>(null)
const setScrollbarHideTimeout = () => {
  if(hideTimer.value!==null)
    clearTimeout(hideTimer.value)
  hideTimer.value=setTimeout(()=>{
    if(!active.value) show.value=false;
    hideTimer.value=null;
  },4000);
}
</script>

<style scoped lang="scss">
#scrollbar {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 16px;
  z-index: 1000;

  #thumbContainer {
    margin-top: 64px;
    div {
      transition: background 0.4s;
      position: absolute;
      right: 2px;
      width: 8px;
      height: 100%;
      border-radius: 4px;
      background: rgba(128, 128, 128, 0.38);
    }
  }
  #thumbContainer.active div {
    background: rgba(128, 128, 128, 0.58);
  }
}

[data-theme='dark'] {
  #thumbContainer div {
    background: var(--color-secondary-bg);
  }
}

#scrollbar.on-drag {
  left: 0;
  width: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
