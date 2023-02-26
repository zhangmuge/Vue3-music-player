<template>
  <div class="login">
    <div class="login-container">
      <div class="section-1">
        <img src="/img/logos/netease-music.png"/>
      </div>
      <div class="title">登录网易云音乐</div>
      <div class="section-2">
        <div>
          <div class="qr-code-container">
            <img :src="qrCodeSvg" loading="lazy"/>
          </div>
          <div class="qr-code-info">
            {{ qrCodeInformation }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {loginQrCodeKey} from "@/api/auth";

const qrCodeKey = ref('')
const qrCodeSvg = ref('')
const qrCodeCheckInterval = ref(null)
const qrCodeInformation = ref('打开网易云音乐APP扫码登录')

const getQrCodeKey = () => {
  return loginQrCodeKey().then(res => {
    console.log(res)
  })
}
getQrCodeKey()
</script>

<style scoped>

</style>
