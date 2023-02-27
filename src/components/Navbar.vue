<template>
  <div>
    <nav>
      <div class="navigation-buttons">
        <el-button text :icon="ArrowLeftBold" round size="large"></el-button>
        <el-button text :icon="ArrowRightBold" round size="large"></el-button>
      </div>
      <div class="navigation-links">
        <router-link to="/" :class="{active:route.name==='home'}">首页</router-link>
        <router-link to="/explore" :class="{active:route.name==='explore'}">发现</router-link>
        <router-link to="/library" :class="{active:route.name==='library'}">音乐库</router-link>
      </div>
      <div class="right-part">
        <div class="search-box">
          <div class="container" :class="{active:inputFocus}">
            <div class="input">
              <el-input :clearable="true" v-model="keywords" ref="searchInput" :placeholder="inputFocus?'':'搜索'"
                        @keydown.enter="doSearch" @focus="inputFocus=true" @blur="inputFocus=false" type="search"
              >
                <template #prefix>
                  <el-icon size="18px">
                    <search/>
                  </el-icon>
                </template>
              </el-input>
            </div>
          </div>
        </div>
        <el-popover popper-class="popper">
          <template #reference>
            <el-avatar :src="avatarUrl" ref="avatar" shape="circle" :size="35"/>
          </template>
          <template #default>
            <el-button class="menu-button" v-if="isLooseLoggedIn" @click="toLogin()">
              <el-icon>
                <login/>
              </el-icon>
              登录
            </el-button>
            <el-button class="menu-button" v-if="!isLooseLoggedIn">
              <el-icon>
                <logout/>
              </el-icon>
              退出登录
            </el-button>
            <br>
            <el-button class="menu-button">
              <el-icon>
                <github-one/>
              </el-icon>
              github
            </el-button>
          </template>
        </el-popover>
      </div>
    </nav>

  </div>
</template>

<script lang="ts" setup>
import {ArrowLeftBold, ArrowRightBold} from '@element-plus/icons-vue'
import {useRoute} from "vue-router";
import {GithubOne, Logout, Search, Login} from "@icon-park/vue-next";
import {computed, ref, unref} from "vue";
import router from '@/router/index'
import {isLooseLoggedIn} from "@/utils/auth";

const route = useRoute();
const inputFocus = ref(false);
const keywords = ref<string>('');
const toLogin = () => {
  router.push({name: 'loginAccount'})
}
const avatarUrl = computed(() => {
  return 'http://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=60y60'
})
const isLoggedIn = computed(() => {
  return isLooseLoggedIn()
})
const avatar = ref();
const doSearch = () => {
  if (keywords.value === '')
    return;
  if (route.name === 'search' && route.params.keywords === keywords.value)
    return;
  router.push({
    name: 'search',
    params: {
      keywords: keywords.value
    }
  })
}
</script>

<style scoped lang="scss">
.popover {
  visibility: hidden;
  --el-popover-border-radius: 20px;
  --el-popper-border-radius: 20px;
  box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.08);
  //border: 4px solid rgba(0, 0, 0, 0.06);
  transition: background 125ms ease-out, opacity 125ms ease-out,
  transform 125ms ease-out;
  min-width: 136px;
  max-width: 240px;

  &:focus {
    outline: none;
  }
}

.menu-button {
  outline: none;
  width: 120px;
  height: 40px;
  margin: 1px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  border: 3px;
  --el-menu-item-font-size: 15px;
  color: var(--color-text);

  &:hover {
    color: var(--color-primary);
    background: var(--color-primary-bg-for-transparent);
    transition: opacity 125ms ease-out, transform 125ms ease-out;
  }

  &:active {
    opacity: 0.75;
    transform: scale(0.95);
  }

  .el-icon {
    margin-right: 5px;
  }
}

nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: {
    right: 10vw;
    left: 10vw;
  };
  backdrop-filter: saturate(180%) blur(20px);

  background-color: var(--color-navbar-bg);
  z-index: 100;
  -webkit-app-region: drag;
}

.right-part {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;

  .el-avatar {
    user-select: none;
    margin-left: 15px;
    cursor: pointer;

    &:hover {
      filter: brightness(80%);
    }
  }
}

.navigation-links {
  flex: 1;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  user-select: none;
  //margin-left: 100px;
  a {
    -webkit-app-region: no-drag;
    font-size: 18px;
    font-weight: 700;
    text-decoration: none;
    border-radius: 6px;
    color: var(---color-text);
    transition: 0.2s;
    -webkit-user-drag: none;
    margin: {
      right: 5px;
      left: 5px;
    }
    padding: 10px;

    &:hover {
      background-color: var(--color-secondary-bg-for-transparent);
    }

    &:active {
      transform: scale(0.92);
      transition: 0.2s;
    }
  }

  a.active {
    color: var(--color-primary);
  }
}

.search-box {
  display: flex;
  justify-content: flex-end;

  .container {
    display: flex;
    align-items: center;
    height: 32px;
    background: var(--color-secondary-bg-for-transparent);
    border-radius: 8px;
    width: 200px;
  }

  .el-icon {
    color: var(--color-text);
    opacity: 0.28;
  }

  .el-input {
    font-size: 16px;
    --el-input-border: none;
    font-weight: 600;
    margin-top: -1px;
    --el-input-bg-color: transparent;
    border: none;
  }

  .active {
    background: var(--color-primary-bg-for-transparent);

    .el-input {
      --el-input-color: var(--color-primary);
      opacity: 1;

      .el-icon {
        color: var(--color-primary);
      }
    }
  }


}

.navigation-buttons {
  flex: 1;
  display: flex;
  align-items: center;
}
</style>

