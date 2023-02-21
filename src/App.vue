<script setup lang="ts">
import {ref} from "vue";
import Scrollbar from "@/components/Scrollbar.vue";
import Navbar from "@/components/Navbar.vue";
import {useRoute} from "vue-router";
import Home from "@/views/home.vue";

let userSelectNone = ref<boolean>(false);
let showLyrics = ref(false)//标记
const route=useRoute();
</script>

<template>

  <div id="app1" :class="{'user-select-none': userSelectNone}">
    <Scrollbar v-show="!showLyrics" ref="scrollbar"/>
    <Navbar/>
    <main ref="main">
<!--      <keep-alive>-->
<!--        <router-view v-if="route.meta.keepAlive"></router-view>-->
<!--      </keep-alive>-->
<!--      <router-view v-if="route.meta.keepAlive"></router-view>-->
      <home></home>
    </main>
  </div>

</template>

<style scoped lang="scss">
main{
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: auto;
  padding: 64px 10vw 96px 10vw;
  box-sizing: border-box;
}
@media (max-width: 1336px) {
  main {
    padding: 64px 5vw 96px 5vw;
  }
}

main::-webkit-scrollbar {
  width: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s;
}

.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
