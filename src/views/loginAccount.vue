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
import {loginQrCodeCheck, loginQrCodeKey} from "@/api/auth";
//@ts-ignore
import QRCode from 'qrcode'
//@ts-ignore
import NProgress from 'NProgress'
import {setCookies} from "@/utils/auth";
import {useStore} from "@/store";
import router from "@/router";

const qrCodeKey = ref('')
const store = useStore()
const qrCodeSvg = ref('')
const qrCodeCheckInterval = ref<any>(null)
const qrCodeInformation = ref('打开网易云音乐APP扫码登录')
const processing = ref(false)
const getQrCodeKey = () => {
  return loginQrCodeKey().then((res: any) => {
    if (res.data.code === 200) {
      qrCodeKey.value = res.data.data.unikey
      QRCode.toString(
          `https://music.163.com/login?codekey=${qrCodeKey.value}`,
          {
            width: 192,
            margin: 0,
            color: {
              dark: '#335eea',
              light: '#00000000'
            },
            type: 'svg',
          }
      ).then((svg: any) => {
        qrCodeSvg.value = `data:image/svg+xml;utf8,${encodeURIComponent(
            svg
        )}`
      }).catch((err: Error) => {
        console.error(err)
      }).finally(() => {
        NProgress.done()
      })
    }
    checkQrCodeLogin()
  })
}
const checkQrCodeLogin = () => {
  qrCodeCheckInterval.value = setInterval(() => {
    if (qrCodeKey.value === '')
      return;
    loginQrCodeCheck(qrCodeKey.value).then(res => {
      const data = res.data
      if (data.code === 800) {
        getQrCodeKey()
        qrCodeInformation.value = '二维码已失效,请重新扫码'
      } else if (data.code === 802) {
        qrCodeInformation.value = '扫码成功,请在手机上确认登录'
      } else if (data.code === 801)
        qrCodeInformation.value = '打开网易云音乐APP扫码登录'
      else if (data.code === 803) {
        clearInterval(qrCodeCheckInterval.value)
        qrCodeInformation.value = '登录成功,请稍等...';
        data.code = 200;
        data.cookie = data.cookie.replace('HTTPOnly', '')
        handleLoginResponse(data)
      }

    })
  })
}
const handleLoginResponse = (data: any) => {
  if (!data) {
    processing.value = false
    return
  }
  if (data.code === 200) {
    setCookies(data.cookie)
    store.updateData('loginMode', 'account')
    store.fetchUserProfile().then(() => {
      store.fetchLikedPlaylist().then(() => {
        router.push({path: '/library'})
      })
    })
  }
}
getQrCodeKey()
</script>

<style scoped>

</style>
