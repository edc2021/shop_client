<template>
  <div ref="scroll" style="min-height: 100vh;">

    <div class="home">
      <img class="christmas_bg" v-if="isChristmas" src="@/assets/christmas/bg.png" alt="">
      <van-nav-bar safe-area-inset-top fixed @click-left="onClickLeft" @click-right="onClickRight"
        :style="isChristmas && { background: `#152840 url(${require('@/assets/christmas/bbg.png')}) no-repeat center / 100% 100%` }">
        <div slot="left" class="logo-wrap">
          <img :class="['logo-img', isAr && 'top_logo_img']" :src="logo"
            :style="itemData.logoHeight && { height: itemData.logoHeight + 'px' }" />
        </div>
        <div slot="right" class="nav-bar-right">
          <template v-if="!isPutApp">
            <router-link to="/language">
              <div class="cn-wrap">
                <img class="cn-img" :src="languageIcon" />
                <img class="down-img" src="@/assets/image/index/down-icon.png" />
              </div>
            </router-link>
          </template>
          <!-- <router-link to="/customerServiceIndex">
            <div class="new-wrap">
              <img class="tongzhi-img" src="@/assets/image/index/kefu.png" />
            </div>
          </router-link> -->

          <!-- <router-link to="/information"> -->
          <div class="new-wrap" @click="information">
            <van-badge :content="queryMessages" max="9" v-if="queryMessages > 0">
              <img class="tongzhi-img" :src="notifyIcon" />
            </van-badge>
            <img class="tongzhi-img" v-else :src="notifyIcon" />
            <!-- <div class="tips">
                {{msgNum}}
              </div> -->
          </div>
          <div class="audio_box" v-if="isChristmas && !['TikTok-Wholesale', 'INT Overstock'].includes(itemName)"
            @click="$store.state.app.audioPlay = !$store.state.app.audioPlay">
            <img v-show="audioPlay" src="@/assets/christmas/audio-play.svg" alt="">
            <img v-show="!audioPlay" src="@/assets/christmas/audio-close.svg" alt="">
          </div>
          <!-- </router-link> -->
        </div>
      </van-nav-bar>
      <!-- 搜索 -->
      <div class="search-contain" :class="isChristmas && 'christmas-search-contain'">
        <router-link to="/search">
          <van-search shape="round" input-align="center" class="van-search" left-icon="" readonly>
            <template #right-icon>
              <div class="search-placeholder">
                <img :src="searchIcon" alt="" class="search-icon" />
                <div>{{ $t("找货源/商品/供应商/求购") }}</div>
              </div>
            </template>
          </van-search>
        </router-link>
      </div>
      <!-- banner -->
      <div class="banner-div">
        <van-skeleton :row="1" class="big_picture skeleton" :loading="loading.banner">
          <van-swipe class="my-swipe" style="border-radius: 10px; direction: ltr;" :autoplay="3000"
            indicator-color="white" v-if="banner.length !== 0">
            <van-swipe-item v-for="(item, index) in banner" :key="index" style="border-radius: 10px">
              <van-image radius="10px" :src="item.imgUrl" @click="handleBannerJump(item)" fit="cover"
                class="swiper_image">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </van-swipe-item>
          </van-swipe>
        </van-skeleton>
      </div>
      <!-- 顶部菜单 -->
      <div>
        <div class="ks_daohang">
          <van-skeleton :row="15" class="list_skeleton skeleton" :loading="loading.list">
            <swiper ref="mySwiper" class="swiper" :options="swiperOptions">
              <swiper-slide v-for="item in categoryList" :key="item.categoryId" class="ks_daohang-item">
                <div class="ks_danghang_img_contain" @click="openClass(item)">
                  <img v-lazy="item.iconImg || $defaultGoodsImage" class="ks_danghang_img"
                    :src="item.iconImg || $defaultGoodsImage" />
                </div>
                <div class="ks_daohang-item-text nowrap2" :class="isChristmas && 'ks_daohang-item-text-christmas'">
                  {{ item.name }}</div>
              </swiper-slide>
            </swiper>
          </van-skeleton>
        </div>

      </div>
      <!-- 每日上新 -->
      <div class="Member-text" style="display: flex; justify-content: center; align-items: center"
        v-if="dailyNewArrivalList.length > 0">
        <div style="flex: 1">{{ $t("每日上新") }}</div>
      </div>
      <div class="touzi-zhuanjia">
        <van-skeleton :row="1" class="newest_skeleton skeleton" :loading="loading.newest">
          <swiper class="swiper" :options="swiperOptions">
            <swiper-slide v-for="(item, index) in dailyNewArrivalList" :key="index" class="zhuanjia-item2">
              <div class="img-div" @click="openProduct(item)">
                <van-image lazy-load :src="item.imgUrl1 || $defaultGoodsImage" class="day_new_van_image">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </div>
              <div class="t1">
                ${{ priceFormat(item?.discountPrice || item.sellingPrice) }}
              </div>
            </swiper-slide>
          </swiper>
        </van-skeleton>
      </div>

      <!-- 推荐产品 -->
      <div class="Member-text" style="display: flex; justify-content: center; align-items: center"
        v-if="productList.length > 0">
        <div style="flex: 1">{{ $t("推荐产品") }}</div>
      </div>
      <div class="banner-product">
        <van-skeleton :row="4" class="product_skeleton skeleton" :loading="loading.product">
          <van-swipe @change="handleChangeSwiper">
            <van-swipe-item v-for="page in prodctPage" :key="page">
              <div class="swipe-product">
                <div class="swipe-product-item" style="background: #fff" v-for="item in productList.filter(
                  (it, n) => (page - 1) * 4 <= n && n < page * 4
                )" @click="openProduct(item)" :key="item.id">
                  <div class="img-div">
                    <van-image lazy-load :src="item.imgUrl1 || $defaultGoodsImage" class="product_van_image">
                      <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                      </template>
                    </van-image>
                  </div>
                  <div class="content">
                    <span class="price">
                      ${{ priceFormat(item.discountPrice || item.sellingPrice) }}
                    </span>
                    <p class="sold">{{ $t('销量') }} {{ priceFormatInt(item?.soldNum) }}</p>
                    <p class="describe">
                      {{ $textOmit(item.name, 24) }}
                    </p>
                  </div>
                  <!-- 活动折扣 -->
                  <div class="discount_box" v-if="item.discountRatio >= 0.01">
                    <span>{{ (item.discountRatio * 100).toFixed(0) }}%</span>
                    <span>OFF</span>
                  </div>
                </div>
              </div>
            </van-swipe-item>
            <template #indicator>
              <ul class="indicators indicator">
                <li v-for="(item, index) in prodctPage" :key="index" :class="{ active: checkActive(index) }">
                </li>
              </ul>
            </template>
          </van-swipe>
        </van-skeleton>

      </div>
      <!-- 推荐店铺 -->
      <div class="Member-text" style="display: flex; justify-content: center; align-items: center">
        <div style="flex: 1">{{ $t("推荐店铺") }}</div>
      </div>
      <div class="recommended-store">
        <van-skeleton :row="4" class="product_skeleton skeleton" :loading="loading.shop">
          <div v-for="item in recomendedStoreShopList" :key="item.key" class="recommended-store-shop-item">
            <div class="top">
              <div class="left-img">
                <img v-lazy="item.avatar" class="img" />
              </div>

              <div class="content">
                <div class="left">
                  <span class="title">{{ item.name }}</span>
                  <p class="fallow">
                    {{ $t("关注") }}: {{ priceFormatInt((+item?.fake || 0) + (+item?.focusNum || 0),
                      true)
                    }}
                  </p>
                  <p>{{ $t("浏览") }}: {{ priceFormatInt(item.viewsNum, true) }}</p>
                </div>
                <div
                  :class="['button', ['Laz', 'JNMIA', 'INT Overstock', 'TikTok-Wholesale', 'AntMall', 'SM-wholesaleShop'].includes(itemName) && 'distinguish_btn']"
                  @click="jumpShop(item)" :style="buttonStyle">
                  {{ $t("访问商店") }} &nbsp;>
                </div>
              </div>
            </div>
            <div class="bottom">
              <span>{{ $t("好评率") }}: {{ priceFormatInt(item.highOpinion * 100, 1) }}%</span>
            </div>
          </div>
        </van-skeleton>
      </div>
      <!-- 推荐店铺 -->

      <!-- 热销产品 -->
      <div class="recommended-store" v-if="recomendedStoreProductList.length > 0">
        <div class="store_title">{{ $t('热销产品') }}</div>
        <div class="recommended-store-product">
          <div v-for="item in recomendedStoreProductList" @click="openProduct(item)" :key="item.key"
            class="recommended-store-product-item">
            <div class="img-div">
              <van-image lazy-load :src="item.imgUrl1 || $defaultGoodsImage" class="hot_van_image">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </div>

            <div class="content">
              <span class="price">${{
                priceFormat(item.discountPrice)
                  ? priceFormat(item.discountPrice)
                  : priceFormat(item.sellingPrice)
              }}</span>
              <p>{{ $t("销量") }}:{{ priceFormatInt(item.soldNum) }}</p>
              <!-- <p>{{$t('浏览量')}}:{{ item.pageviews }}</p> -->
              <div class="describe">
                {{ $textOmit(item.name) }}
              </div>
            </div>
            <!-- 活动折扣 -->
            <div class="discount_box" v-if="item.discountRatio >= 0.01">
              <span>{{ (item.discountRatio * 100).toFixed(0) }}%</span>
              <span>OFF</span>
            </div>
          </div>
        </div>
      </div>

      <!-- <div style="width: 100%; height: 56px"></div> -->
    </div>
    <transition name="fade">
      <!-- <img class="to_top" v-show="isShowTopBtn" @click="handleToTop" src="@/assets/image/commodity/dingbu.png" /> -->
      <van-icon v-show="isShowTopBtn" @click="handleToTop" class="to_top" class-prefix="icon" name="huidaodingbu" />
    </transition>
    <div class="lottery_box" v-if="lotteryShow">
      <img @click="lotteryShow = false" class="close" src="@/assets/image/choujiangclose.svg" alt="">
      <img @click="handleLotteryJump" class="lottery" src="@/assets/image/choujiang.svg" alt="">
      <div class="text">
        {{ $t('幸运抽奖') }}
      </div>
    </div>
    <Footer />
    <FloatingVideo v-if="['SM-wholesaleShop'].includes(itemName)" />
    <template v-if="isChristmas">
      <div class="snowflake" v-for="item of 50" :key="item"></div>
    </template>
    <!-- <div ref="snow_background" class="snow_background" id="snow_background"></div> -->
  </div>
</template>
<script>
// import HeahNavigation from "@/components/HeahNavigation"
import {
  Search,
  Swipe,
  SwipeItem,
  NoticeBar,
  Skeleton,
  Image as VanImage,
  loading,
  Dialog,
  Overlay,
  PasswordInput,
  NumberKeyboard,
  Badge,
  Icon
} from "vant";
import { shouyexinxi_post, huoquyue_post } from "@/API/user";
import { apiQueryMessages, apiUnreadSystemMessage } from "@/API/common";
import { apiGetNewGoods, apiGetRecommendGoods } from '@/API/home'
import Footer from '@/components/Footer'
import FloatingVideo from '@/components/FloatingVideo'
import {
  home_index,
  home_category,
  apiGetActivity,
  home_sellerGoods,
  getSellerList,
  apiGetBannerList
} from "@/API/home";

// import { Skeleton } from "vant";
import { priceFormat, priceFormatInt, isLogin } from "@/utils/utis";

export default {
  name: "HomePage",
  components: {
    // HeahNavigation,
    Footer,
    FloatingVideo,
    [Search.name]: Search,
    [SwipeItem.name]: SwipeItem,
    [Swipe.name]: Swipe,
    [NoticeBar.name]: NoticeBar,
    [Skeleton.name]: Skeleton,
    [VanImage.name]: VanImage,
    [loading.name]: loading,
    [Dialog.Component.name]: Dialog.Component,
    [Overlay.name]: Overlay,
    [PasswordInput.name]: PasswordInput,
    [NumberKeyboard.name]: NumberKeyboard,
    [Badge.name]: Badge,
    [Icon.name]: Icon,
  },
  created() {
    this.init();
    const code = this.$route.query.code;
    if (code) {
      sessionStorage.setItem('ac_code', code)
    }
  },

  data() {
    return {
      priceFormat,
      priceFormatInt,
      isShelves: !process.env.VUE_APP_PUT_ON_SHELVES,
      isChristmas: process.env?.VUE_APP_IS_CHRISTMAS,
      itemName: process.env.VUE_APP_ITEM_NAME,
      isPutApp: process.env.VUE_APP_PUT_ON_SHELVES,
      itemData: this.$store.state.multiItem[process.env.VUE_APP_ITEM_NAME],
      isAr: localStorage.getItem("lang") == "ar",
      isApp: !window?.plus ? true : false,
      isShowTopBtn: false,
      msgNum: 0, //未读消息数量
      current: 0, //product index
      searchValue: "",
      gundongtongzhi: "",
      banner: [],
      vipData: [],
      lotteryShow: false,
      lotteryPath: "",
      show: false,
      showNotify: !!localStorage.getItem('sellerId'),
      searchIcon: require("@/assets/image/index/sousuo.png"),
      vip_zhifu_data: {},
      zijin: {},
      showKeyboard: true,
      snow_background: null,
      show1: false,
      dailyNewArrivalList: [], //新品
      index_homeProject: [],
      index_homeProject_index: 0,
      bonus: "",
      bonus_show: false,
      recomendedStoreShopList: [],
      recomendedStoreProductList: [],
      productList: [], //推荐
      categoryList: [], //分类
      prodctPage: 1, //推荐轮播页数
      queryMessages: 0, // 未读消息
      time: null,
      scrollTop: 0,
      swiperOptions: {
        slidesPerView: 3.5,
        autoplay: {
          delay: 3500000,
          disableOnInteraction: false,
        },
      },
      swiperOptions2: {
        loop: true,
        // slidesPerView: 3.5,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
      },
      loading: {
        banner: true,
        list: true,
        product: true,
        newest: true,
        shop: true
      },
      isCn: localStorage.getItem('lang') === 'cn',
      topBgColor: 'transparent'
    };
  },
  mounted() {
    // this.scrollTop = sessionStorage.getItem("scrollTopCount") || 0;
    // this.$nextTick(() => {
    //     console.log(`scrollTopCount ::->`, +this.scrollTop);
    //     window.scrollTo(0, +this.scrollTop);
    // })
    setTimeout(() => {
      window.addEventListener("scroll", this.handleScroll);
    }, 1000);
    // const { Snow, Mod } = SnowFalls;
    // setTimeout(() => {
    //     // 实例化Snow类
    //     new Snow({
    //         // 要添加动画的容器
    //         view: this.$refs.snow_background,
    //         snowflakeTextureSrcs: [
    //             require("@/assets/image/snow.svg"),
    //         ],
    //         snowflakeSize: [10, 6],
    //         graphicsRotation: [3, 0],
    //         // 加载需要的功能模块
    //         modules: [
    //             // 载入风力模块，雪花将受风力影响
    //             new Mod.Wind(),
    //             // 载入元素积雪效果，使用传入的css类名的元素将产生积雪效果
    //             // 默认每个元素的积雪数量为当前元素的宽度值，如果当前总积雪数量超过了屏幕里存在的最大的雪花粒子数量，将不在产生下雪效果，请提高snowflakeNum的值解决，过多的边界将产生严重的性能影响

    //             // new Mod.EleBorder("border"),
    //         ],
    //         // 屏幕里存在的最大的雪花粒子数量, 默认200。当maxRenderSnow为false时，屏幕中渲染的粒子数量和帧率有关，一般不超过200个
    //         snowflakeNum: 200,
    //     });
    // }, 1000)

  },
  computed: {
    audioPlay() {
      return this.$store.state.app.audioPlay
    },
    notifyIcon() {
      if (this.isChristmas) {
        if (this.topBgColor == 'transparent') {
          return require(`@/assets/christmas/tongzhi.svg`)
        } else {
          // return require(`@/assets/image/index/tongzhi.png`)
          return require(`@/assets/christmas/tongzhi.svg`)
        }
      } else {
        return require(`@/assets/image/index/tongzhi.png`)
      }
    },
    logo() {
      if (this.itemName == 'EShop' && this.isChristmas) {
        return require(`@/assets/${process.env.VUE_APP_ITEM_NAME}/logo.${this.$store.state.multiItem[process.env.VUE_APP_ITEM_NAME].suffix}`)
      }
      if (['AntMall', 'INT Overstock', 'Shop2u', 'JNMIA', 'SM-wholesaleShop', 'Laz', 'Iceland', 'TikTok-Wholesale', 'SIMON', 'TEXM', 'Alibaba-wholesales'].includes(this.itemName) && this.isChristmas) {
        return require(`@/assets/${process.env.VUE_APP_ITEM_NAME}/logo2.${this.$store.state.multiItem[process.env.VUE_APP_ITEM_NAME].suffix}`)
      }
      return require(`@/assets/${process.env.VUE_APP_ITEM_NAME}/logo.${this.$store.state.multiItem[process.env.VUE_APP_ITEM_NAME].suffix}`)
    },
    classOption() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 8, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 0, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
    buttonStyle() {
      if (this.itemName === 'JNMIA') {
        return {
          background: '#000000',
          color: '#fff'
        }
      }
    },
    languageIcon() {
      const language = localStorage.getItem('lang') || "en";
      if (language == 'en-US' || language == '"en-US"') {
        language = 'en'
      } else if (language == 'zh-CN' || language == "'zh-CN'") {
        language = 'cn'
      } else if (language == 'zh-TW' || language == "'zh-TW'") {
        language = 'tw'
      }
      const icon = {
        "cn": require("@/assets/image/language/cn.png"),
        "en": require("@/assets/image/language/usa.png"),
        "tw": require("@/assets/image/language/tw.png"),
        "de": require("@/assets/image/language/de.png"),
        "ja": require("@/assets/image/language/ja.png"),
        "ms": require("@/assets/image/language/ms.png"),
        "th": require("@/assets/image/language/th.png"),
        "pt": require("@/assets/image/language/pt.png"),
        "es": require("@/assets/image/language/es.png"),
        "ru": require("@/assets/image/language/ru.png"),
        "el": require("@/assets/image/language/el.png"),
        "it": require("@/assets/image/language/it.png"),
        "tr": require("@/assets/image/language/tr.png"),
        "af": require("@/assets/image/language/af.png"),
        "fr": require("@/assets/image/language/fr.png"),
        "ko": require("@/assets/image/language/ko.png"),
        "ph": require("@/assets/image/language/ph.png"),
        "ar": require("@/assets/image/language/ar.png"),
        "vi": require("@/assets/image/language/vi.png"),
        "hi": require("@/assets/image/language/hi.png"),
        "id": require("@/assets/image/language/id.png"),
      };
      return language ? icon[language] : icon['en'];
    },
  },
  methods: {
    // 获取当前活动信息
    async requestActivity() {
      const res = await apiGetActivity();
      const langParam = `lang=${localStorage.getItem('lang')}&token=${localStorage.getItem('token')}`;
      if (!res?.detailUrl) return
      this.lotteryPath = `${res.detailUrl}${res.detailUrl.includes('?') ? '&' : '?'}${langParam}`;
      this.lotteryShow = !!res.detailUrl
    },
    handleLotteryJump() {
      if (window.plus) {
        window.plus.runtime.openURL(encodeURI(this.lotteryPath + '&wt=app'))
      } else {
        location.href = this.lotteryPath
      }
    },

    information() {
      if (!isLogin()) {
        // Dialog.confirm({
        //     title: this.$t("您还未登录"),
        //     message: this.$t("是否跳转到登录页面"),
        //     confirmButtonText: this.$t("确认"),
        //     cancelButtonText: this.$t("取消"),
        // }).then(() => {
        //     this.$router.push("/login");
        // });
        this.$notifyWarn(this.$t("请先登录"));
        this.$router.push("/login");
      } else {
        //   this.$router.push("/information");
        this.$router.push("/message/list");
      }
    },
    async init() {
      this.requestBanner();
      this.requireRecommendNew()

      this.requestHomeCategory();
      // this.home_sellerGoods();
      this.home_SellerList();
      if (isLogin()) {
        // 查询未读消息
        this.getMessageNum();
        this.time = setInterval(() => {
          this.getMessageNum();
        }, 10000);
      }
      // 活动
      if (['EShop', 'Shop2u', 'JNMIA', 'TikTok-Wholesale'].includes(this.itemName)) {
        this.requestActivity()
      }

    },
    async getMessageNum() {
      this.queryMessages = await apiQueryMessages({ loginType: 'user' });
      apiUnreadSystemMessage({
        type: 3,
        module: '0',
      }).then(res => {
        this.queryMessages = +this.queryMessages + +res.count
      })
    },
    // 获取推荐/新品
    async requireRecommendNew() {
      /**
       * type 0:每日新品 1:推荐产品 2:热销产品
       */
      if (sessionStorage.getItem("index_recomendedStoreProductList")) {
        this.recomendedStoreProductList = JSON.parse(sessionStorage.getItem("index_recomendedStoreProductList"));
        this.loading.product = false;
      }
      if (sessionStorage.getItem("index_dailyNewArrivalList")) {
        this.dailyNewArrivalList = JSON.parse(sessionStorage.getItem("index_dailyNewArrivalList"));
        this.loading.newest = false;
      }
      if (sessionStorage.getItem("index_productList")) {
        this.productList = JSON.parse(sessionStorage.getItem("index_productList"));
        this.prodctPage = Math.ceil(this.productList.length / 4);
        this.loading.product = false;
      }
      const [recommendRes, dailyNewArrivalRes, recomendedStoreProductRes] = await Promise.all([
        apiGetNewGoods({ pageNum: 1, pageSize: 24, type: 1 }),
        apiGetNewGoods({ pageNum: 1, pageSize: 24, type: 0 }),
        apiGetNewGoods({ pageNum: 1, pageSize: 24, type: 2 })
      ]);

      this.productList = recommendRes.result;
      this.prodctPage = Math.ceil(this.productList.length / 4);
      this.loading.product = false;

      this.dailyNewArrivalList = [...dailyNewArrivalRes.result, ...dailyNewArrivalRes.result];
      this.loading.newest = false;

      this.recomendedStoreProductList = recomendedStoreProductRes.result;
      sessionStorage.setItem("index_productList", JSON.stringify(this.productList));
      sessionStorage.setItem("index_dailyNewArrivalList", JSON.stringify(this.dailyNewArrivalList));
      sessionStorage.setItem("index_recomendedStoreProductList", JSON.stringify(this.recomendedStoreProductList));
    },
    async requestHomeCategory() {
      if (sessionStorage.getItem("index_categoryList")) {
        this.categoryList = JSON.parse(sessionStorage.getItem("index_categoryList"));
        this.loading.list = false
      }
      const { pageList } = await apiGetRecommendGoods({ pageNum: 1, pageSize: 20 })
      this.categoryList = pageList;
      this.loading.list = false
      sessionStorage.setItem("index_categoryList", JSON.stringify(this.categoryList));

    },
    handleBannerJump(item) {
      if (window.plus) {
        window.plus.runtime.openURL(encodeURI(item.link + '?wt=app'))
      } else {
        window.open(item.link)
      }
    },
    handleDownload(n) {
      if (this.itemName == 'Shop2u') {
        if (n == 0) {
          window.open('https://play.google.com/store/apps/details?id=com.commerce.app')
        } else {
          window.open('https://apps.apple.com/my/app/shop2u/id6448880380')
        }
      }
      window.open(location.origin + "/app.html?r=" + Math.random())
    },
    // banner
    async requestBanner() {
      if (this.itemName == 'INT Overstock') {
        // this.banner = result
        if (localStorage.getItem('lang') === 'cn') {
          this.banner.unshift({ imgUrl: require('@/assets/image/int-banner-cn.jpg'), link: 'javascript:;' })
        } else {
          this.banner.unshift({ imgUrl: require('@/assets/image/int-banner-en.jpg'), link: 'javascript:;' })
        }
        this.loading.banner = false
        return
      }
      if (sessionStorage.getItem('index_banner')) {
        this.banner = JSON.parse(sessionStorage.getItem('index_banner'))
        this.loading.banner = false
      }
      try {
        const { result } = await apiGetBannerList({
          type: 'h5',
          pageNum: 1,
          pageSize: 10
        })

        if (result.length === 0) {
          this.banner = [
            { imgUrl: require('@/assets/image/index/banner0.png') },
            { imgUrl: require('@/assets/image/index/banner1.jpg') },
            { imgUrl: require('@/assets/image/index/banner2.png') }
          ]
        } else {
          this.banner = result
        }
      } catch (error) {
        this.banner = [
          { imgUrl: require('@/assets/image/index/banner0.png') },
          { imgUrl: require('@/assets/image/index/banner1.jpg') },
          { imgUrl: require('@/assets/image/index/banner2.png') }
        ]
      }
      sessionStorage.setItem('index_banner', JSON.stringify(this.banner))
      const Image = document.createElement('img')
      Image.src = this.banner[0].imgUrl
      Image.onload = () => this.loading.banner = false
    },
    home_SellerList() {
      if (sessionStorage.getItem('index_recomendedStoreShopList')) {
        this.recomendedStoreShopList = JSON.parse(sessionStorage.getItem('index_recomendedStoreShopList'))
        this.loading.shop = false
      }
      let dataJson = {
        pageNum: 1,
        pageSize: 5,
        isRec: 1,
      };
      getSellerList(dataJson).then((res) => {
        this.recomendedStoreShopList = res.pageList;
        this.loading.shop = false
        sessionStorage.setItem("index_recomendedStoreShopList", JSON.stringify(this.recomendedStoreShopList));
      });
    },
    home_sellerGoods() {
      let data1 = {
        recTime: Date.now(),
      };
      home_sellerGoods(data1).then((res) => {
        //推荐产品
        this.productList = res.pageList
        this.loading.product = false

        this.prodctPage =
          this.productList.length > 0 &&
          Math.ceil(this.productList.length / 4);
      });
      let data2 = {
        newTime: Date.now(),
      };
      home_sellerGoods(data2).then((res) => {
        //新品推荐
        this.dailyNewArrivalList = res.pageList;
        this.loading.newest = false
      });
      home_sellerGoods({}).then((res) => {
        //商品底部
        this.recomendedStoreProductList = res.pageList;
      });
    },

    touzi2() {
      this.$router.push("/invest");
      location.reload();
    },
    touzi(e) {
      document.body.scrollTop = 0;
      // firefox
      document.documentElement.scrollTop = 0;
      this.$router.push("/ProductDetails?projectId=" + e);
    },
    shouyexinxi() {
      shouyexinxi_post({}).then((res) => {
        this.gundongtongzhi = res.announcement.toString();
        this.banner = res.banner;
        this.vipData = res.vip_level;
      });
    },
    handleToTop() {
      scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    },
    onClickLeft() { },
    onClickRight() { },
    huoquyue() {
      huoquyue_post({}).then((res) => {
        console.log(res);
        this.zijin = res;
      });
    },
    vip_zhifu_list(e) {
      this.show = true;
      this.vip_zhifu_data = e;
    },
    kefutiaozhuan() { window.openSiteCustomerService(); },
    //监听product轮播index
    handleChangeSwiper(index) {
      this.current = index;
    },
    checkActive(index) {
      return index === this.current; // current为监听的轮播index
    },
    //跳转商铺
    jumpShop(item) {
      sessionStorage.removeItem("shopState");
      this.$router.push(`/shop?sellerId=${item.id}&index=0`);
    },
    //跳转商品详情
    openProduct(item) {
      this.$router.push("/CommodityDetails?sellerGoodsId=" + item.id);
    },
    //跳转分类商品
    openClass(item) {
      sessionStorage.removeItem("classificationState");
      const query = {
        categoryId: item.categoryId,
        className: item.name
      }
      this.$router.push({
        path: "/Classification",
        query
      });
    },
    // 记录滚动条位置
    handleScroll() {
      if (this.isChristmas && this.scrollTop > 1) {
        this.topBgColor = `#152840 url(${require('@/assets/christmas/bbg.png')}) no-repeat center / 100% 100%`
        // this.topBgColor =  `#152840`
      } else {
        this.topBgColor = 'transparent'
      }
      this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      this.isShowTopBtn = this.scrollTop > 500
    },
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    sessionStorage.setItem('scrollTopCount', this.scrollTop)
    clearInterval(this.time);
  },
  watch: {
    $route: {
      handler: function (to, form) {
        if (form.path == '/language') {
          this.init()
        }
      },
      deep: true
    }
  },
};
</script>
<style lang="scss" scoped>
.audio_box {
  background: url(@/assets/christmas/audio-box.svg) no-repeat center / 100% 100%;
  width: 30px;
  height: 30px;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 10px;
    height: 10px;
    transform: translate(-2.4px, -1.4px);
  }
}

.christmas_bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  pointer-events: none;
}

.snow_background {
  width: 100vw;
  height: 100vh;
  margin: 0;
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  pointer-events: none;
}

.lottery_box {
  position: fixed;
  top: 60%;
  right: -10px;
  transform: scale(.7) translateY(-50%);
  width: 135px;
  z-index: 88;
  transition: all .3s;

  .text {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 86px;
    height: 23px;
    background: url(@/assets/image/choujiangtext.svg) no-repeat center / 100% 100%;
    color: #fff;
    font-size: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.home {
  width: 100%;
  // background: #fff;
  padding: 0 15px;
  box-sizing: border-box;
  color: #333333;

  .christmas-search-contain {
    /deep/ .van-search {
      border-radius: 20px !important;
    }

    /deep/ .van-cell {
      background: #fff !important;
      border-radius: 20px !important;
    }
  }

  .search-contain {
    margin-top: 63px;

    // /deep/ .van-cell {
    //     border-radius: 20px !important;
    // }

    /deep/ .search-placeholder {
      font-size: 12px;
      color: #999999;
    }
  }

  .recommended-store {
    width: 100%;
    margin-top: 15px;

    .store_title {
      color: #333;
      font-size: 14px;
      margin-bottom: 11px;
    }

    .recommended-store-shop-item {
      border: 1px solid rgba(238, 238, 238, 1);
      margin-bottom: 15px;
      border-radius: 4px;

      .top {
        display: flex;
        // justify-content: space-evenly;
        align-items: center;
        padding: 10px;

        .left-img {
          width: 60px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            border-radius: 50%;
            width: 60px;
            height: 60px;
            margin-top: 13px;
          }
        }

        // .img {
        //   display: inline-block;
        //   // width: 50px;
        //   width: auto;
        //   height: 50px;
        //   border: 1px solid rgba(238, 238, 238, 1);
        // }

        .content {
          display: flex;
          flex: 1;
          // flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding-left: 12px;
          min-height: 60px;
          padding-bottom: 5px;

          .left {
            height: 60px;
            display: flex;
            flex-direction: column;
            margin-top: 6px;

            .title {
              font-size: 14px;
              font-weight: 500;
            }

            .fallow {
              margin-top: 8px;
            }

            p {
              font-size: 10px;
              color: #333;
            }
          }
        }

        .button {
          height: 17px;
          padding: 2px 10px;
          // flex: 0 0 71px;
          margin-left: 10px;
          line-height: 17px;
          border: 1px solid var(--main-color);
          border-radius: 27px;
          font-size: 10px;
          text-align: center;
          background: #fcf2e2;
          color: var(--main-color);
          white-space: nowrap;
        }
      }

      .bottom {
        margin: 0 10px;
        padding: 8px 0;
        font-size: 10px;
        display: flex;
        color: #333333;
        justify-content: space-between;
        border-top: 1px solid #eee;
      }
    }

    .recommended-store-product {
      margin-bottom: 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .recommended-store-product-item {
        width: calc(50% - 15px);
        border: 1px solid rgba(238, 238, 238, 1);
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 4px;
        border-radius: 4px;
        position: relative;

        .img-div {
          height: 156px;
          display: flex;
          align-items: center;
          justify-content: center;

          .img {
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
            transform: translateY(1px);
          }
        }

        .content {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          // padding-left: 10%;
          margin-top: 10px;

          .price {
            color: var(--main-color);
            font-size: 16px;
            font-weight: 500;
            padding: 0 6px;
            box-sizing: border-box;
          }

          p {
            font-size: 11px;
            color: #999;
            margin: 4px 0;
            padding: 0 6px;
            box-sizing: border-box;
          }

          .describe {
            font-size: 14px;
            color: #000;
            width: 100%;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -moz-box-orient: vertical;
            box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0 6px;
            box-sizing: border-box;
          }
        }
      }
    }
  }



  .banner-product {
    width: 100%;
    margin-top: 21px;
    // filter: drop-shadow(0px 6px 12px rgba(55, 63, 69, 0.1));
    // border-radius: 4px;
    position: relative;

    .swipe-product {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0 1px;

      .swipe-product-item {
        width: calc(50% - 15px);
        height: 245px;
        border: 1px solid rgba(238, 238, 238, 1);
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 6px 4px;
        border-radius: 4px;
        position: relative;

        .img-div {
          height: 156px;
          display: flex;
          align-items: center;
          justify-content: center;

          .img {
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
          }
        }

        .content {
          width: 90%;
          // padding-left: 10%;
          padding: 0 6px;

          .price {
            color: var(--main-color);
            font-size: 16px;
            font-weight: 500;
          }

          .sold {
            font-size: 10px;
            color: #999;
          }

          .describe {
            font-size: 14px;
            color: #000;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -moz-box-orient: vertical;
            box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }

    //指示器
    .indicators {
      position: absolute;
      bottom: 0;
      left: 50%;
      display: flex;
      transform: translateX(-50%);
    }

    .indicator li {
      display: inline;
      width: 12px;
      height: 2px;
      background-color: rgb(93, 91, 88);
      border-radius: 20%;
      opacity: 0.3;
      transition: opacity 0.5s,
        //@animation-duration-fast
        background-color 0.5s; //@animation-duration-fast

      &:not(:last-child) {
        margin-right: 6px;
      }

      &.active {
        background-color: var(--main-color);
        opacity: 1;
      }
    }
  }

  .nav-bar-right {
    display: flex;
    align-items: center;

    .cn-wrap {
      display: flex;
      align-items: center;

      .cn-img {
        height: 22px;
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
        border-radius: 50%;
      }

      .down-img {
        height: 7px;
        margin-left: 3px;
      }
    }

    .new-wrap {
      position: relative;

      .van-badge__wrapper {
        top: 3px;
      }

      .tongzhi-img {
        height: 20px;
        margin-left: 15px;
        display: block;
      }

      .tips {
        position: absolute;
        right: -6px;
        top: -2px;
        width: 15px;
        height: 15px;
        background: #ff3e3e;
        border-radius: 50%;
        line-height: 15px;
        font-size: 12px;
        color: #fff;
      }
    }
  }

  .logo-wrap {
    display: flex;
    align-items: center;
  }

  .logo-img {
    width: auto;
    height: 50px;
  }

  .top_logo_img {
    transform: scaleX(-1) !important;
  }

  .banner-div {
    width: 100%;
    //background: white;
    filter: drop-shadow(0px 6px 12px rgba(55, 63, 69, 0.1));
    border-radius: 4px;

    .swiper_image {
      width: 100%;
      border-radius: 10px;
      height: auto;
      max-height: 500px;
    }
  }

  .Bar {
    margin-top: 15px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 54px;

    .Bar-img {
      padding: 8px 9px 7px 10px;
      width: 18px;
      height: 16px;
    }

    .Bar-flex {
      flex: 1;
      margin-right: 18px;
    }
  }

  .ks_daohang {
    margin-top: 5px;
    width: 100%;
    min-height: 130px;
    display: flex;
    // flex-wrap: wrap;
    // justify-content: flex-start;
    align-items: flex-end;
    //background: #FFFFFF;
    // overflow-x: scroll;
    // overflow-y: hidden;
    // scrollbar-width: none;
    // -ms-overflow-style: none;
    // &::-webkit-scrollbar {
    //     display: none;
    // }

    .ks_daohang-item {
      // width: 80px;
      display: flex;
      flex-direction: column;
      background: transparent !important;
      // justify-content: center;
      // align-items: center;
      // margin: 0px 8px;

      // &:first-child {
      //     margin-left: 10px;
      // }

      .ks_danghang_img_contain {
        min-width: 80px;
        min-height: 65px;
        // padding: 4px 22px;
        border: 1px solid rgba(238, 238, 238, 1);
        border-radius: 2px;
        display: table-cell;
        vertical-align: middle;
        background: #fff;
      }

      .ks_danghang_img {
        max-width: 65px;
        max-height: 65px;
        display: block;
        margin: auto;
      }

      .ks_daohang-item-text-christmas {
        color: #fff !important;
      }

      .ks_daohang-item-text {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-top: 8px;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        min-height: 14px;
        line-height: 14px;
        max-width: 90%;
        /* identical to box height */

        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        text-align: center;
        color: #000000;
      }
    }
  }

  .touzi-xm {
    margin-top: 15px;
    background: #ffffff;
    border-radius: 4px;
    padding: 15px;
    box-sizing: border-box;
    width: 100%;

    .xm-title {
      font-style: normal;
      font-weight: 600;
      font-size: 16px;

      color: #000000;
    }

    .xm-xinxi {
      margin-top: 15px;
      display: flex;

      .k-n {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        /* identical to box height */
        color: #333333;
        //text-align: center;
      }

      .k-title {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        //line-height: 14px;
        /* identical to box height */

        //text-align: center;

        color: #999999;
      }

      .xinxi-k1 {
        flex: 1;
      }
    }

    .jindu {
      margin-top: 15px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;

      .jindu-t {
        margin-top: 2px;
        width: 140px;
        height: 8px;
        background: #eeeeee;
        border-radius: 27px;

        .xuanzhong {
          height: 8px;
          background: #1552f0;
          border-radius: 27px;
        }

        .xuanzhong2 {
          height: 8px;
          background: #999999;
          border-radius: 27px;
        }
      }

      .jindu-title {
        width: 140px;
        margin-top: 8px;
        display: flex;
        justify-content: space-between;

        .t1 {
          font-style: normal;
          font-weight: 400;
          font-size: 12px;
          color: #000000;
        }

        .t2 {
          font-style: normal;
          font-weight: 400;
          font-size: 12px;
          color: #000000;
        }
      }

      .tj {
        width: 96px;
        height: 36px;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 36px;
        /* identical to box height, or 114% */

        text-align: center;

        color: #ffffff;

        border-radius: 4px;
      }

      .tj-lan {
        background: #1552f0;
      }

      .tj-hui {
        background: #999999;
      }
    }
  }

  .touzi-zhuanjia {
    //box-sizing: border-box;
    //width: 200px;
    // height: 160px;
    margin-top: 15px;
    text-align: center;
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      display: none !important;
    }

    .sanjiao {
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: -11px;
      width: 0;
      //height: 60px;
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 12px solid #ffffff;
      transform: rotate(180deg);
    }

    .sanjiao2 {
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: -11px;
      width: 0;
      //height: 60px;
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 12px solid #e5e8ed;
      transform: rotate(180deg);
    }

    .t1 {
      margin-top: 10px;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 16px;
      text-align: center;

      color: var(--main-color);
    }

    .t2 {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      //line-height: 16px;
      text-align: center;
      color: #333333;
      margin-top: 2px;
    }

    .item-avatar {
      width: 80px;
      // height: 130px;
      margin: 2px auto;
    }

    .zhuanjia-item {
      width: 130px !important;
      border-radius: 4px;
      white-space: nowrap;
      display: inline-block;
      box-sizing: border-box;
      margin-right: 15px;
      position: relative;

      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
      // align-items: center;
      .img-div {
        width: 130px;
        height: 130px;
        display: flex;
        align-items: center;
        justify-content: center;

        .img {
          width: auto;
          height: auto;
          max-width: 90%;
          max-height: 90%;
        }
      }
    }

    .zhuanjia-item2 {
      flex: 0 0 120px;
      border-radius: 4px;
      white-space: nowrap;
      display: inline-block;
      box-sizing: border-box;
      margin-right: 15px;
      position: relative;
      padding-bottom: 10px;

      .img-div {
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;

        .img {
          width: auto;
          height: auto;
          max-width: 90%;
          max-height: 90%;
        }
      }
    }
  }

  .zhuanjia-nr {
    margin-top: 10px;
    background: #ffffff;
    padding: 15px;
    box-sizing: border-box;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #000000;
  }

  .Member-text {
    margin-top: 25px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #333;
  }
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  //width: 100%;
}

.dingbu {
  position: fixed;
  bottom: 100px;
  right: 10px;
  width: 30px;
  height: 30px;
  transition: all .3s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zhengti {
  width: 100%;
  max-width: 570px;
  padding: 0 30px;
  //padding-top: 60px;
  box-sizing: border-box;

  .zhengti-top {
    box-sizing: border-box;
    padding: 10px 15px 20px 15px;
    background: #ffffff;
    border-radius: 6px;
    position: relative;

    .zhengt1 {
      display: flex;
      justify-content: center;
      align-items: center;
      font-style: normal;
      font-weight: 400;
      font-size: 17.2866px;
      line-height: 20px;
      text-align: center;

      /* 999 */

      color: #999999;

      img {
        width: 48px;
      }
    }

    .zhengti2 {
      margin-top: 20px;
      font-style: normal;
      font-weight: 600;
      font-size: 28.811px;
      line-height: 34px;
      /* identical to box height */
      text-align: center;
      color: #000000;
    }

    .NewcomerBonus-div {
      margin-top: 20px;
      width: 100%;
      height: 110px;
      position: relative;
    }

    .NewcomerBonus {
      width: 100%;
      height: 100%;
      //height: 92px;
    }

    .s1 {
      position: absolute;
      left: 12px;
      top: 17px;
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;

      color: #ffffff;
    }

    .s2 {
      position: absolute;
      left: 12px;
      bottom: 18px;
      width: 114px;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;

      color: #ffffff;
    }

    .s3 {
      position: absolute;
      right: 19px;
      top: 25px;
      font-style: normal;
      font-weight: 600;
      font-size: 24.9695px;
      line-height: 29px;
      color: #000000;
    }

    .s4 {
      position: absolute;
      right: 19px;
      bottom: 23px;
      font-style: normal;
      font-weight: 600;
      font-size: 16.5854px;
      line-height: 19px;
      /* identical to box height, or 112% */

      color: #000000;
    }

    .chakan {
      margin-top: 20px;
      width: 100%;
      height: 44px;
      /* 主题色 */
      background: #1552f0;
      border-radius: 4px;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 44px;
      /* identical to box height, or 114% */
      text-align: center;
      color: #ffffff;
    }
  }

  .guanbi {
    width: 24px;
    height: 24px;
    margin-top: 20px;
  }
}

.van-search {
  padding: 0 !important;
  margin-bottom: 15px;

  .van-cell {
    padding: 12px 12px 12px 0 !important;
    height: 44px;
  }
}

/deep/ .van-search__content {
  background: #f6f6f6;
  padding: 0 !important;

  input::placeholder {
    text-align: start;
    padding-left: calc(23% + 35px);
  }
}

/deep/ .van-field__right-icon {
  width: 100%;
  position: absolute;
  left: -2%;
  top: -10%;
}

/deep/ .van-swipe__track {
  align-items: center;
}

.search-placeholder {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .search-icon {
    width: 17px;
    height: 17px;
    margin-right: 6px;
  }
}

.home .van-nav-bar__text {
  color: #999999;
}

.home .van-notice-bar {
  background: none;
  height: 36px;
  color: #333333;
}

// .home .van-skeleton__row,
// .van-skeleton__title {
//     background: #b0b0b0;
// }

.home .van-overlay {
  z-index: 1999 !important;
}

.search-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.download_wrap {
  width: 100%;
  padding: 21px 17px 21px 17px;
  background: url(@/assets/image/index/downloadbg.png) no-repeat center / 100% 100%;
  box-sizing: border-box;

  .down_title {
    font-weight: 600;
    font-size: 20px;
    color: #000;
  }

  .sub_title {
    font-weight: 600;
    font-size: 15px;
    color: #000;
  }

  .btns {
    margin-top: 20px;
    display: flex;
    align-items: center;
    min-height: 10px;

    .btn {
      // width: 93px;
      // height: 27px;
      padding: 6px 11px;
      border: 1px solid #000000;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;

      &:nth-child(2) {
        margin-right: 0px;
      }

      img {
        width: 12px;
        height: 14px;
      }

      span {
        font-weight: 600;
        font-size: 10px;
        color: #333;
        margin-left: 6px;
      }
    }
  }
}

/*.van-swipe__indicator{*/

/*  background: rgba(0, 0, 0, 0.4);*/
/*  opacity: 0.6;*/
/*}*/
/*.van-swipe__indicator--active{*/
/*  !*background: #1552F0!important;*!*/
/*  background: rgba(0, 0, 0, 0.6)!important;*/
/*}*/
.distinguish_btn {
  background: var(--main-color) !important;
  color: #fff !important;
}
</style>
