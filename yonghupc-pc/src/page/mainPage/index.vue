<template>
  <div class="home" id="home">
    <EsHeaderView />
    <!-- <div v-for="item of 500" :key="item" class="snowflake"></div> -->
    <MainBanner v-if="itemname !== 'Argos' && itemname !== 'INT Overstock'" />
    <MainArgosBanner v-else />
    <MainClassification ref="classification" />
    <MainDaily ref="mainDaily" />
    <div class="th_back" v-show="true" ref="navigationBar">
      <!-- <span>
        <img src="@/assets/image/home-icon1.png" alt="" />
      </span> -->
      <span @click="scrollToAnchor2" class="nav-bar">
        <img src="@/assets/image/home-icon2.png" alt="" />
        <div>
          {{ $t("message.home.上新") }}
        </div>
      </span>
      <span class="nav-bar" @click="scrollToAnchor3">
        <img src="@/assets/image/home-icon3.png" alt="" />
        <div>{{ $t("message.home.推荐") }}</div>
      </span>
      <span class="nav-bar" @click="scrollToAnchor4">
        <img src="@/assets/image/home-icon4.png" alt="" />
        <div>
          {{ $t("message.home.店铺") }}
        </div>
      </span>
      <span class="nav-bar" @click="scrollToAnchor5">
        <img src="@/assets/image/home-icon5.png" alt="" />
        <div>{{ $t("message.home.热门") }}</div>
      </span>
      <span @click="goTop">
        <img src="@/assets/image/home-icon6.png" alt="" />
      </span>
      <!-- <span @click="goTop">
                {{$t('message.home.返回顶部')}}
            </span> -->
    </div>
    <div
      v-if="bannerShow"
      :style="{ 'background-image': 'url(' + banner1 + ')' }"
      class="banner-content"
    >
      <div class="content">
        <p>{{ $t("message.home.homeBannertips1") }}</p>
        <p>{{ $t("message.home.homeBannertips2") }}</p>
        <h3>{{ $t("message.home.homeBannertips3") }} $100,000</h3>
        <div @click="joinStore">{{ $t("message.home.homeBannerbtn") }}</div>
      </div>
    </div>
    <MainRecommend @onload="bannerShow = true" ref="mainRecommend" />
    <MainRecommendStore

      ref="mainRecommendStore"
    />
    <EsIconTips />
    <EsFooterView />
  </div>
</template>

<script>
import config from "@/config/index";
import { mapGetters } from "vuex";
import MainRecommend from "./mainRecommend.vue";
import MainBanner from "./mainBanner.vue";
import MainArgosBanner from "./mainBannerArgos.vue";
import MainClassification from "./mainClassification.vue";
import MainDaily from "./mainDaily.vue";
import MainRecommendStore from "./mainRecommendStore.vue";
// import VueQr from "vue-qr";

import EsIconTips from "@/components/iconTips";
export default {
  name: "HomeView",
  components: {
    MainRecommend,
    MainBanner,
    MainClassification,
    MainDaily,
    MainRecommendStore,
    EsIconTips,
    MainArgosBanner,
    // VueQr,
  },
  data() {
    return {
      itemname: process.env.VUE_APP_ITEM_NAME,
      bannerShow: false,
      downloadShow: false,
      boxWidth: 200,
      banner1:
        process.env.VUE_APP_ITEM_NAME == "FamilyShop"
          ? require("@/assets/image/familyShop_banner.png")
          : process.env.VUE_APP_ITEM_NAME == "SM-wholesale shop"
          ? require("@/assets/image/SM-1.jpg")
          : require("@/assets/image/ads/banner_01.png"),
      banner2: require("@/assets/image/ads/banner_02.png"),
      android: require("@/assets/image/ads/android01.png"),
      iOS: require("@/assets/image/ads/ios01.png"),
      tipsData: [
        {
          icon: require("@/assets/image/ads/icon_01.png"),
          name: "message.home.homeIconTips1",
        },
        {
          icon: require("@/assets/image/ads/icon_02.png"),
          name: "message.home.homeIconTips2",
        },
        {
          icon: require("@/assets/image/ads/icon_03.png"),
          name: "message.home.homeIconTips3",
        },
        {
          icon: require("@/assets/image/ads/icon_04.png"),
          name: "message.home.homeIconTips4",
        },
      ],
      lang: "",
      top: 0,
      currentIndex: 1,
      flag: false,
    };
  },
  computed: {
    ...mapGetters({
      downAppUrl: "home/downAppUrl",
      userInfo: "userInfo",
    }),
  },
  mounted() {
    // window.addEventListener('scroll',this.scrollHandle);//绑定页面滚动事件
    window.onresize = () => {
        return (() => {
          this.$refs.navigationBar.style.left =
      (window.innerWidth - 1250) / 2 -
      this.$refs.navigationBar.offsetWidth +
      "px";
        })();
      };
    this.lang = localStorage.getItem("ES_LANG") || "en";
    const currentRouter = this.$router.currentRoute;
    if (currentRouter.query.code) {
      localStorage.setItem("agentCode", currentRouter.query.code);
    }
    // const mainDailyTop = this.$refs.mainDaily.$el.offsetTop - 116;
    // const classificationTop = this.$refs.classification.$el.offsetTop - 116;
    // const mainRecommendTop = this.$refs.mainRecommend.$el.offsetTop - 116
    // const mainRecommendStoreTop = this.$refs.mainRecommendStoreTop.$el.offsetTop - 116
    this.$refs.navigationBar.style.left =
      (window.innerWidth - 1250) / 2 -
      this.$refs.navigationBar.offsetWidth +
      "px";
    window.addEventListener("scroll", () => {
      //  console.log(document.documentElement.scrollTop);
      //获取页面滚动的高度
      let scrollTop = document.documentElement.scrollTop;

      //   if(scrollTop >= classificationTop && scrollTop <= mainDailyTop){
      //     this.currentIndex = 1
      //   }else if(scrollTop >= mainDailyTop && scrollTop <= mainRecommendTop){
      //     this.currentIndex = 2
      //  } else if(scrollTop >= mainRecommendTop && scrollTop <= mainRecommendStoreTop){
      //     this.currentIndex = 3
      //  } else if (scrollTop >= mainRecommendStoreTop){
      //     this.currentIndex = 4
      //  }

      if (scrollTop > 200) {
        this.flag = true;
      } else {
        this.flag = false;
        this.currentIndex = 1;
      }
    });
  },
  activated() {
    // console.log('sessionStorage.getItem("scrollY") ->', localStorage.getItem("scroll"));
    if (localStorage.getItem("scroll")) {
      document.documentElement.scrollTop = localStorage.getItem("scroll");
    }
    
    // document.documentElement.scrollTop = this.$route.meta.scrollY
  },
  beforeDestroy() {
    // console.log('离开 ->');
    localStorage.setItem("scroll", document.documentElement.scrollTop);
    // window.removeEventListener('scroll', this.scrollHandle)
  },
  methods: {
    // scrollHandle(e) {
    //    this.top = e.srcElement.scrollingElement.scrollTop; // 获取页面滚动高度
    //   console.log(this.top);
    // },
    joinStore() {
      window.open(
        config.HOST_URL +
          "/promote/#/" +
          "?lang=en" +
          "&avatar=" +
          this.userInfo.avatar
      );
    },
    scrollToAnchor1() {
      this.currentIndex = 1;
      const offset = 80;
      const top = this.$refs.classification.$el.offsetTop - offset;
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    },
    scrollToAnchor2() {
      this.currentIndex = 2;
      const offset = 80;
      const top = this.$refs.mainDaily.$el.offsetTop - offset;
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    },
    scrollToAnchor3() {
      this.currentIndex = 3;
      const offset = 70;
      const top = this.$refs.mainRecommend.$el.offsetTop - offset-33;
      console.log('top ->', top);
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    },
    scrollToAnchor4() {
      this.currentIndex = 4;
      const offset = 80;
      const top = this.$refs.mainRecommendStore.$el.offsetTop - offset;
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    },
    scrollToAnchor5() {
      this.currentIndex = 5;
      const offset = 112;
      const top = this.$refs.mainRecommendStore.$el.offsetTop + offset;
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    },
    goTop() {
      // this.flag = false

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    downClickA() {
      if (this.itemname == "Meta") {
        window.open(config.HOST_URL + "/android.apk", "_blank");
      } else if (this.itemname == "Inchoi") {
        window.open(
          "https://play.google.com/store/apps/details?id=com.in.ceapp.go",
          "_blank"
        );
      } else if (this.itemname == "Shop2u") {
        window.open(
          "https://play.google.com/store/apps/details?id=com.commerce.app",
          "_blank"
        );
      } else {
        window.open(config.HOST_URL + "/app.html", "_blank");
      }
    },
    downClickI() {
      if (this.itemname == "Meta") {
        window.open(config.HOST_URL + "/IOS.mobileconfig", "_blank");
      } else if (this.itemname == "Shop2u") {
        window.open(
          "https://apps.apple.com/my/app/shop2u/id6448880380",
          "_blank"
        );
      } else {
        window.open(config.HOST_URL + "/app.html", "_blank");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
html[dir="rtl"] {
  .banner-content {
    justify-content: flex-start;
  }
  .download-content {
    justify-content: flex-end;
  }
  .download-content > div.download > .btn-content > .item:nth-child(1) {
    margin-right: 0;
    margin-left: 20px;
  }
}
.home {
  position: relative;
}
// .snowflake {
// 		--size: 1vw;
// 		width: var(--size);
// 		height: var(--size);
// 		background: url(../../assets/image/snow.png) no-repeat;
//     border-radius: 100%; //雪花图片 也可以画圆
// 		background-size: 100% 100%;
// 		position: fixed;
// 		top: -5vh; //出事高度在屏幕外 效果更真实
// 		z-index: 10; //背景图层不遮挡上面元素
// 	}

// 	@keyframes snowfall {
// 		100% {
// 			transform: translate3d(var(--end), 100vh, 0);
// 		}
// 	}

// 	@for $i from 0 through 200 {
// 		.snowflake:nth-child(#{$i}) {
// 			//每个雪花的大小
// 			--size: #{random(6) * 0.08}vw;
// 			//雪花移动目标点 -70后是负数 这样雪花会向左下方飘落 
// 			--end: #{random(20) - 70}vw;
// 			//雪花初始位置 
// 			left: #{random(150)}vw;
// 			//雪花从顶到底移动的动画 动画时间可以调整雪花速度
// 			animation: snowfall #{5 + random(8)}s linear infinite;
// 			animation-delay: -#{random(10)}s;
// 		}
// 	}
.th_back {
  position: fixed;
  left: 2%;
  top: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 2000;
  span {
    font-size: 12px;
    // padding: 10px 5px;
    width: 44px;
    height: 40px;
    color: #ffffff;
    background-color: #d8d8d8;
    display: flex;
    // justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    margin-bottom: 4px;
    // &:nth-child(1) {
    //   // width: auto !important;
    //   cursor: default !important;
    //   justify-content: center;
    //   background-color: var(--color-main);
    // }
    &:nth-child(5) {
      // width: auto !important;
      justify-content: center;
      background-color: var(--color-main);
    }
    img {
      width: 28px;
      height: 28px;
      margin-left: 8px;
      margin-right: 8px;
      object-fit: contain;
    }
    div {
      padding: 0 5px;
      display: none;
    }
  }
  .nav-bar {
    transition: all 0.5s ease;
    &:hover {
      width: 150px;
      background-color: var(--color-main);
      div {
        display: flex;
        justify-content: center;
        text-align: center;
        flex: 1;
        white-space: nowrap;
        color: #ffffff;
        animation: textAmin 1s ease;
      }
    }
  }
  .active {
    background-color: var(--color-main);
  }
}
@keyframes textAmin {
  0% {
    color: transparent;
  }
  100% {
    color: #fff;
  }
}
.banner-content {
  width: 1200px;
  margin: 0 auto;
  height: 352px;
  overflow: hidden;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: flex-end;
  > .content {
    width: 650px;
    height: 352px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > p {
      color: #2e2e23;
      font-size: 42px;
    }
    > h3 {
      color: #fa3835;
      font-size: 42px;
    }
    > div {
      padding: 0 40px;
      height: 50px;
      border-radius: 50px;
      line-height: 50px;
      background-color: #2e2e2e;
      color: #f1ce5a;
      font-size: 16px;
      margin-top: 20px;
      cursor: pointer;
      &:hover {
        background-color: #181818;
      }
    }
  }
}

.download-content {
  width: 1200px;
  margin: 0 auto;
  margin-bottom: 60px;
  height: 297px;
  overflow: hidden;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: 0;
  transition: all 0.3s ease;
  &.active {
    opacity: 1;
  }
  > div {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    &.download {
      // margin-left: 72px;
      width: 730px;
      font-weight: bold;
      margin-left: 10px;
      > h3 {
        font-size: 40px;
        letter-spacing: 2px;
        margin-left: 5px;
      }
      > .tips {
        height: 35px;
        line-height: 35px;
        display: flex;
        font-size: 24px;
        margin-top: 10px;
        > .item {
          // width: 100px;
          padding: 0 8px;
        }
      }
      > .btn-content {
        display: flex;
        margin-top: 15px;
        margin-left: 10px;
        > .item {
          // width: 154px;
          height: 37px;
          line-height: 37px;
          background-color: #fff;
          // color: var(--color-main);
          border-radius: 4px;
          border: 1px solid #000;
          display: flex;
          font-size: 14px;
          align-items: center;
          justify-content: center;
          padding: 5px;
          will-change: filter;
          transition: filter 500ms;
          &:nth-child(1) {
            margin-right: 20px;
          }
          &:hover {
            filter: drop-shadow(0 0 4px #333);
          }
          cursor: pointer;
          > img {
            margin-right: 10px;
          }
          p {
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap;
          }
        }
      }
    }
    &.code-content {
      align-items: center;
      margin-right: 50px;
      padding-top: 20px;
      > .content {
        width: 108px;
        height: 108px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      > p {
        font-size: 14px;
        color: #fff;
        margin-top: 15px;
      }
    }
  }
}

.tips-content {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 60px;
  > .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    > p {
      font-size: 12px;
      color: #000;
      margin-top: 15px;
    }
  }
}
</style>
