<template>
  <div class="audio-content">
    <audio :src="AudioSounds.chat" ref="AudioChatRef" muted></audio>
    <audio :src="AudioSounds.notify" ref="AudioNotifyRef" muted></audio>
    <audio :src="AudioSounds.chat" ref="AudioServiceRef" muted></audio>
    <audio :src="AudioSounds.order" ref="AudioOrderRef" muted></audio>
  </div>

  <!-- <transition :name="routerTransType">
    <router-view v-slot="{ Component }">
      <keep-alive :include="keepaliveData">
        <component :is="Component" :key="$route.fullPath"/>
      </keep-alive>
    </router-view>
  </transition> -->
  <router-view v-slot="{ Component }">
    <transition :name="routerTransType" mode="out-in">
      <keep-alive :include="keepaliveData">
        <component :is="Component" :key="$route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>

  <fx-footer v-if="route.meta.tarbar" />
</template>

<script setup>
import fxFooter from '@/components/fx-footer/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { usekeepAliveStore } from '@/store/keepAlive.js'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouterStore } from '@/store/router.js'
import { useOrderStore } from '@/store/order.js'
import { useSystemStore } from '@/store/system.js'
import { isPassPage } from '@/utils'
import { Dialog } from 'vant'
import { pendingPopup, popupShown } from '@/service/user.api.js'
const route = useRoute()
window.router = useRouter()

const routerStore = useRouterStore()
const orderStore = useOrderStore()
const systemStore = useSystemStore()

const { locale } = useI18n()
systemStore.setIsArLang(locale.value === 'ar')
systemStore.setNotCnLang(!['cn', 'tw'].includes(locale.value))

// 获取系统客服链接
if (!isPassPage()) {
  systemStore.getServeceUrl()
  let popupTimer = null
  let popupVisible = false
  const checkPendingPopup = () => {
    if (popupVisible) return
    pendingPopup().then(data => {
      if (!data || !data.id) return
      popupVisible = true
      Dialog.alert({ title: data.title || 'System notification', message: data.content, confirmButtonText: 'OK' })
        .then(() => popupShown(data.id))
        .finally(() => { popupVisible = false })
    }).catch(() => {})
  }
  onMounted(() => {
    checkPendingPopup()
    popupTimer = setInterval(checkPendingPopup, 30000)
  })
  onUnmounted(() => popupTimer && clearInterval(popupTimer))
}

const routerTransType = computed(() => {
  return routerStore.routerTransType
})

const usekeepAlive = usekeepAliveStore()
const keepaliveData = computed(() => {
  return usekeepAlive.keepaliveData || []
  // return []
})

const AudioSounds = {
  chat: new URL('@/assets/audio/chat.mp3', import.meta.url),
  notify: new URL('@/assets/audio/notify.mp3', import.meta.url),
  order: new URL('@/assets/audio/order.mp3', import.meta.url)
}

// 请求未处理订单数
const orderInterval = ref()
const getNotDealOrder = () => {
  if (!orderInterval.value) {
    orderStore.getNoPushNum()
    orderInterval.value = setInterval(() => {
      orderStore.getNoPushNum()
    }, 60000)
  }
}

// 监听未处理订单请求触发
document.addEventListener(
  'getNotDealOrderHandle',
  () => {
    getNotDealOrder()
  },
  false
)

// 监听退出并停止请求未处理订单数的轮循请求
document.addEventListener(
  'logout',
  () => {
    clearInterval(orderInterval.value)
    orderInterval.value = null
  },
  false
)

// 默认触发一次播放
const defaultPlayFlag = ref(false)
const AudioChatRef = ref(null)
const AudioNotifyRef = ref(null)
const AudioServiceRef = ref(null)
const AudioOrderRef = ref(null)

const defaultPlay = () => {
  if (!defaultPlayFlag.value && !isPassPage()) {
    AudioChatRef.value.play()
    AudioNotifyRef.value.play()
    AudioServiceRef.value.play()
    AudioOrderRef.value.play()
    defaultPlayFlag.value = true

    setTimeout(() => {
      AudioChatRef.value.muted = false
      AudioNotifyRef.value.muted = false
      AudioServiceRef.value.muted = false
    }, 1500)

    // 因为订单声音有3秒，在这里开启声音
    setTimeout(() => {
      AudioOrderRef.value.muted = false
    }, 3500)
  }
}

// 系统点击默认触发一次声音播放
document.addEventListener('click', defaultPlay, false)
// 只触发一次默认播放
watch(defaultPlayFlag, (val) => {
  if (val) {
    document.removeEventListener('click', defaultPlay)
  }
})

// 播放
const playAudio = (dom) => {
  if (defaultPlayFlag.value) {
    dom.play()
  }
}

// 监听客服信息
document.addEventListener(
  'servicePlay',
  () => playAudio(AudioServiceRef.value),
  false
)
// 监听系统消息
document.addEventListener(
  'notifyPlay',
  () => playAudio(AudioNotifyRef.value),
  false
)
// 监听聊天消息
document.addEventListener(
  'chatPlay',
  () => playAudio(AudioChatRef.value),
  false
)
// 监听订单消息
document.addEventListener(
  'orderPlay',
  () => playAudio(AudioOrderRef.value),
  false
)

const modeType = import.meta.env.MODE
const mode = modeType === 'mbuy' ? 'argos' : modeType
console.log('mode', import.meta.env)
// console.log('VITE_TITLE', import.meta.env.VITE_APP_TITLE)

const siteTitle = import.meta.env.VITE_APP_TITLE
document.title = siteTitle
const link =
  document.querySelector("link[rel*='icon']") ||
  document.createElement('link')
link.type = 'image/x-icon'
link.rel = 'shortcut icon'
link.href = new URL(`./assets/ico/jnmia.ico`, import.meta.url).href
document.getElementsByTagName('head')[0].appendChild(link)
</script>
<style lang="scss">
@import './assets/css/border.css';

.van-toast {
  word-break: break-word !important;
}

.audio-content {
  width: 0;
  height: 0;
  overflow: hidden;
}

.nationList {
  .van-action-sheet {
    height: 80%;
  }
}

.van-search__content {
  background: #fff !important;
}

.van-dropdown-menu__bar {
  height: 44px !important;
}
</style>
