import router from '@/router/router.js'
import store from '@/store'

router.beforeEach(async (to, from, next) => {
  // userinfo
  // 用户 PC 端历史上使用 ES_TOKEN，商户端使用 token。同域访问时将两者
  // 统一为商户端可识别的 token，从用户端切换后无需再次登录。
  const TOKEN = localStorage.getItem('token') || localStorage.getItem('ES_TOKEN')
  if (TOKEN && !localStorage.getItem('token')) {
    localStorage.setItem('token', TOKEN)
  }
  let userInfo = store.getters.userInfo
  if (TOKEN && !store.getters.userInfo) {
    try {
      userInfo = await store.dispatch('getUserInfo')
    } catch (e) {
      userInfo = null
    }
  }

  // 商户 PC 端与入驻页位于同一站点时会共享 localStorage token。
  // 已审核通过的商户再次进入入驻页，直接进入商户后台，不重复显示申请表。
  const isApplicationPage = to.path === '/' || to.path === '/merchantSettled'
  const hasActiveSeller = userInfo && (
    (userInfo.has_seller === true && Number(userInfo.seller_status) === 1) ||
    Number(userInfo.kyc_status) === 2
  )
  if (TOKEN && isApplicationPage && hasActiveSeller) {
    window.location.replace('/ww/#/dashboard')
    return
  }

  next()
})
