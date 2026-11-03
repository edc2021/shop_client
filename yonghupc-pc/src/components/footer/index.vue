<template>
  <div class="footer">
    <div class="app-container">
      <div class="footer-wrapper flex-start">
        <div class="footer-title flex-start">
          <img
            :src="itemname === 'JNMIA' ? require('@/assets/image/JNMIA/logo-white.png') : require(`@/assets/image/${itemname}/logo.png`)"
            :style="itemname === 'JNMIA'?'width: 276px;height: auto;' :''"
            alt=""
            @click="goHome"
          />
          <p>{{ $t("message.home.getCoupons") }}</p>
          <el-input
            v-model="email"
            :placeholder=" $t('message.home.yourEmail')"
            @input="identification"
          ></el-input>
          <div class="sub" @click="subScription">
            {{ $t("message.home.subscription") }}
          </div>
        </div>
        <div class="footer-nav">
          <div
            class="footer-nav-item"
            v-for="(item, index) in linkNav"
            :key="index"
          >
            <span>{{ item?.title }}</span>
            <ul>
              <el-tooltip
                v-for="(childItem, childIndex) in item?.nav"
                effect="light"
                :placement="
                  childItem.name == $t('message.home.contactUs') ? 'left' : ''
                "
                :key="childIndex"
              >
                <div slot="content" v-if="itemname !== 'SM-wholesale shop' && itemname !== 'Argos' && itemname!== 'INT Overstock'">
                  {{ $t("message.home.businessEmail") }}: {{bassEmail}}
                </div>
                <div slot="content" v-else-if="itemname == 'SM-wholesale shop'">
                   {{ $t("message.home.businessEmail") }}: {{'support@smwholesaleshop01.com'}}
                   <br>
                   {{ $t("message.home.businessEmail") }}2: {{'support@smwholesaleshop02.com'}}
                   <br>
                   {{ $t("message.home.businessEmail") }}2: {{'support@smwholesaleshop03.com'}}
                </div>
                <div slot="content" v-else-if="itemname == 'Argos'">
                   {{ $t("message.home.businessEmail") }}: {{bassEmail}}
                   <br>
                   Line: Argos061
                   <br>
                   WhatsApp: +44 7477 466470
                </div>
                <div slot="content" v-else>
                   {{ $t("message.home.businessEmail") }}: {{bassEmail}}
                   <br>
                   {{ $t("message.home.企业电话") }}: +1(840) 800-1088
                </div>
                <li @click="childItem.clickEvent">
                  {{ childItem.name }}
                </li>
              </el-tooltip>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom" v-if="itemname !== 'INT Overstock'">
        <p style="text-align: center; margin-bottom: 15px">
          {{ itemname !== 'JNMIA'?$t("message.home.footTip", { name: itemname }):$t("message.home.footTipTikTok") }}
        </p>
        <p :style="itemname == 'JNMIA'&& 'text-align:center'">
          {{itemname !== 'JNMIA'? $t("message.home.footTips", { name: itemname }):'©️2023 JNMIA Mall. All rights reserved.'}}
        </p>
      </div>
      <div class="footer-bottom" v-else>
        <p style="text-align: center; margin-bottom: 15px">
          © Copyright 2026 TTK Shop.
        </p>
        <p style="text-align: center;">
          799 Coliseum Way Midvale, UT 84047 | 1-840-800-1088
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { apiGetCustomerService } from "@/api/common";
import bn from "@/assets/image/bn.png";
import hb from "@/assets/image/hb.png";
import oy from "@/assets/image/oy.png";
import kk from "@/assets/image/kk.png";
import cb from "@/assets/image/cb.png";
import hl from "@/assets/image/hl.png";
import kc from "@/assets/image/kc.png";
import bf from "@/assets/image/bf.png";
import bit from "@/assets/image/bit.png";
import crypto from "@/assets/image/crypto.png";
import maicoin from "@/assets/image/maiCoin.png";
import Shop2u from "@/assets/image/Shop2u/logo.png"

import argos from "@/assets/image/argos.png";
import hab from "@/assets/image/hab.png";
import tu from "@/assets/image/tu.png";
import sains from "@/assets/image/sains.png";
import nectar from "@/assets/image/nectar.png";
import clogo from "@/assets/image/clogo.png";
import { sub } from "@/api/home";
import amazon from "@/assets/image/amazon.png";
import justeat from "@/assets/image/justeat.png";
import zd from "@/assets/image/zd.png"
import zelle from "@/assets/image/zelle.png"
import bdo from "@/assets/image/bdo.png"
export default {
  name: "EsFooter",
  data() {
    const JumpToLogin = () => {
      if (!this.isLogin) {
        this.$router.push("/register");
      } else {
        this.$router.push("/login");
      }
    };

    const JumpTo = (path, index) => {
      // console.log("this.$store ->", this.$store.state.user.currentIndex);
      if (this.isLogin) {
        this.$router.push(path);
        this.$store.state.user.currentIndex = index;
      } else {
        this.$router.push("/login");
      }
    };
    return {
      itemname: process.env.VUE_APP_ITEM_NAME,
      bassEmail: "",
      email: "",
      logoList: [
        {
          url: process.env.VUE_APP_ITEM_NAME == "Tongda" ? amazon :process.env.VUE_APP_ITEM_NAME == 'Shop2u'? Shop2u:process.env.VUE_APP_ITEM_NAME == 'SM-wholesale shop'? justeat : argos,
          clickEvent: () => {
            process.env.VUE_APP_ITEM_NAME == "Shop2u"
              ? '':
            process.env.VUE_APP_ITEM_NAME == "Tongda"
              ? window.open("https://www.amazon.com/", "_blank"): process.env.VUE_APP_ITEM_NAME == "SM-wholesale shop"
              ? window.open("https://www.smsupermalls.com/", "_blank")
              : location.reload();
          },
        },
        {
          url: process.env.VUE_APP_ITEM_NAME !== 'SM-wholesale shop' ? hab : bdo ,
          clickEvent: () => {
             process.env.VUE_APP_ITEM_NAME == "Shop2u"
              ? '':process.env.VUE_APP_ITEM_NAME !== 'SM-wholesale shop' ?window.open("https://www.bdo.com/", "_blank"):
            window.open("https://www.habitat.co.uk", "_blank");
          },
        },
        {
          url: tu,
          clickEvent: () => {
             process.env.VUE_APP_ITEM_NAME == "Shop2u"
              ? '':
            window.open("https://tuclothing.sainsburys.co.uk/", "_blank");
          },
        },
        {
          url: sains,
          clickEvent: () => {
             process.env.VUE_APP_ITEM_NAME == "Shop2u"
              ? '':
            window.open("https://www.sainsburys.co.uk", "_blank");
          },
        },
        {
          url: nectar,
          clickEvent: () => {
             process.env.VUE_APP_ITEM_NAME == "Shop2u"
              ? '':
            window.open("https://www.nectar.com ", "_blank");
          },
        },
        {
          url: clogo,
          clickEvent: () => {
             process.env.VUE_APP_ITEM_NAME == "Shop2u"
              ? '':
            window.open("#/ ", "_blank");
          },
        },
        {
          url: zd,
          clickEvent: () => {
             process.env.VUE_APP_ITEM_NAME == "Shop2u"
              ? '':
            window.open("https://www.sc.com/en/", "_blank");
          },
        },
        {
          url: zelle,
          clickEvent: () => {
             process.env.VUE_APP_ITEM_NAME == "Shop2u"
              ? '':
            window.open("#/", "_blank");
          },
        }
        
      ],
      linkNav: [
        {
          title: this.$t("message.home.App下载(买家端)"),
          nav: [
            // {
            //   name: this.$t("message.home.partner"),
            //   path: "",
            //   clickEvent: () => {},
            // },
            {
              name:process.env.VUE_APP_ITEM_NAME == "Hive" || process.env.VUE_APP_ITEM_NAME === 'TikTok-Wholesale' ? '' :process.env.VUE_APP_ITEM_NAME == 'INT Overstock' ? this.$t("message.home.客户端下载") : process.env.VUE_APP_ITEM_NAME == "Shop2u" ? this.$t("message.home.homeDownloadtips4") : this.$t("message.home.App下载(买家端)"),
              path: "",
              clickEvent: () => {
                if(process.env.VUE_APP_ITEM_NAME == 'Shop2u'){
                  window.open("https://play.google.com/store/apps/details?id=com.commerce.app","_blank")
                }else{
                   window.location.href = window.origin + "/app.html";
                }
              },
            },
            {
              name: process.env.VUE_APP_ITEM_NAME == "Hive" || process.env.VUE_APP_ITEM_NAME == 'INT Overstock'|| process.env.VUE_APP_ITEM_NAME === 'TikTok-Wholesale' ? '': process.env.VUE_APP_ITEM_NAME == "Shop2u" ? this.$t("message.home.homeDownloadtips5") : this.$t("message.home.App下载(卖家端)"),
              path: "",
              clickEvent: () => {
                if(process.env.VUE_APP_ITEM_NAME == "Shop2u"){
                  window.open("https://apps.apple.com/my/app/shop2u/id6448880380","_blank")
                }else{
                   window.location.href = window.origin + "/app.html";
                }
              },
            },
          ],
        },
        {
          title: this.$t("message.home.returnsAndEx"),
          nav: [
            {
              name: this.$t("message.home.privacyPolicy"),
              path: "",
              clickEvent: () => {
                window.location.href =
                  window.origin +
                    "/promote/#/privacyPolicy?lang=" +
                    this.lang || "en" + "&avatar=" + this.userInfo.avatar;
              },
            },
            {
              name: this.$t("message.home.returnPolicy"),
              path: "",
              clickEvent: () => {
                window.location.href =
                  window.origin + "/promote/#/returnPolicy?lang=" + this.lang ||
                  "en" + "&avatar=" + this.userInfo.avatar;
              },
            },
            {
              name: this.$t("message.home.delivery"),
              path: "",
              clickEvent: () => {
                window.location.href =
                  window.origin + "/promote/#/Delivery?lang=" + this.lang ||
                  "en" + "&avatar=" + this.userInfo.avatar;
              },
            },
            {
              name: this.$t("message.home.sellerRules"),
              path: "",
              clickEvent: () => {
                window.location.href =
                  window.origin +
                    "/promote/#/shippingPolicy?lang=" +
                    this.lang || "en" + "&avatar=" + this.userInfo.avatar;
              },
            },
          ],
        },
        {
          title: this.$t("message.home.user_Center"),
          nav: [
            {
              name: this.$t("message.home.userReg"),
              path: "",
              clickEvent: () => JumpToLogin(),
            },
            {
              name: this.$t("message.home.orderTrack"),
              path: "",
              clickEvent: () => JumpTo("/userInfo/my-order?index=2", 2),
            },
            {
              name: this.$t("message.home.myCommodityCollection"),
              path: "",
              clickEvent: () => JumpTo("/userInfo/collect-goods?index=3", 3),
            },
            {
              name: this.$t("message.home.myPurse"),
              path: "",
              clickEvent: () => JumpTo("/userInfo/money-package?index=1", 1),
            },
          ],
        },
        {
          title: this.$t("message.home.aboutUs"),
          nav: [
            {
              name: process.env.VUE_APP_ITEM_NAME == 'Alibaba'?this.$t("message.home.关于阿里巴巴"):this.$t("message.home.aboutUs"),
              path: "",
              clickEvent: () => {
                 process.env.VUE_APP_ITEM_NAME == 'Alibaba'? window.open(
                    "https://activities.alibaba.com/alibaba/following-about-alibaba.php?spm=a2700.trademark.0.0.605aUWseUWseXn",
                    "_blank"
                  ) :
                 process.env.VUE_APP_ITEM_NAME == 'SIMON'? window.open(
                    "https://business.simon.com/why-simon",
                    "_blank"
                  ) :process.env.VUE_APP_ITEM_NAME == 'TikTok-Wholesale' ?
                (window.location.href =
                      window.origin + "/promote/#/TikTok-about?lang=" + this.lang ||
                      "en" + "&avatar=" + this.userInfo.avatar):
                process.env.VUE_APP_ITEM_NAME == "Meta"
                  ? (window.location.href =
                      window.origin + "/promote/#/aboutUs?lang=" + this.lang ||
                      "en" + "&avatar=" + this.userInfo.avatar)
                  : process.env.VUE_APP_ITEM_NAME == "Hive"
                  ? (window.location.href =
                      window.origin + "/promote/#/Hive-about?lang=" + this.lang ||
                      "en" + "&avatar=" + this.userInfo.avatar)
                  : process.env.VUE_APP_ITEM_NAME == "FamilyMart" ? window.open(
                      "#/",
                      "_blank"
                    )
                  : process.env.VUE_APP_ITEM_NAME == 'Shop2u'? window.open(
                    "https://www.asiaone.com/business/shop2u-platform-officially-entered-southeast-asian-market-will-create-nearly-2-million",
                    "_blank"
                  ) 
                 : process.env.VUE_APP_ITEM_NAME == 'INT Overstock'? window.open(
                    "#/gw/#/about",
                    "_blank"
                  ) 
                  : process.env.VUE_APP_ITEM_NAME == 'SM-wholesale shop'? window.open(
                    "https://www.smsupermalls.com/about-us/",
                    "_blank"
                  ) : window.open(
                      "https://www.about.sainsburys.co.uk/brands-that-deliver/argos",
                      "_blank"
                    );
              },
            },
            {
              name: process.env.VUE_APP_ITEM_NAME == 'Alibaba'?this.$t("message.home.企业责任"):process.env.VUE_APP_ITEM_NAME == 'SIMON'? this.$t("message.home.西蒙基金会"):process.env.VUE_APP_ITEM_NAME == 'Shop2u'? this.$t("message.home.企业证明"):process.env.VUE_APP_ITEM_NAME == 'INT Overstock'? this.$t("message.home.职业机会"):this.$t("message.home.Recruitment"),
              path: "",
              clickEvent: () => {
                 process.env.VUE_APP_ITEM_NAME == 'Alibaba'? window.open(
                    "https://www.alibabagroup.com/en-US/esg?spm=a2700.trademark.0.0.605aUWseUWseXn",
                    "_blank"
                  ) :
                process.env.VUE_APP_ITEM_NAME == 'SIMON'? window.open(
                    "https://syf.org/",
                    "_blank"
                  ) :
                process.env.VUE_APP_ITEM_NAME == 'SM-wholesale shop' ?
                window.open(
                  "https://www.smprimecareers.com/",
                  "_blank"
                ):
                process.env.VUE_APP_ITEM_NAME == 'Shop2u' ? window.location.href =
                  window.origin +
                    "/promote/#/enterprise-prove?lang=" +
                    this.lang || "en" + "&avatar=" + this.userInfo.avatar:
                    process.env.VUE_APP_ITEM_NAME == 'INT Overstock'? window.open("#/gw/#/","_blank"):
                window.open("https://sainsburys.jobs/ ", "_blank");
              },
            },
            {
              name: process.env.VUE_APP_ITEM_NAME == 'Alibaba'?this.$t("message.home.新闻中心"):process.env.VUE_APP_ITEM_NAME == 'SIMON' ? this.$t("message.home.零售商营销"):process.env.VUE_APP_ITEM_NAME == 'INT Overstock' ? '':this.$t("message.home.news"),
              path: "",
              clickEvent: () => {
                process.env.VUE_APP_ITEM_NAME == 'Alibaba'? window.open(
                    "https://reads.alibaba.com/?spm=a2700.trademark.0.0.605aUWseUWseXn",
                    "_blank"
                  ) :
                 process.env.VUE_APP_ITEM_NAME == 'SIMON'? window.open(
                    "https://business.simon.com/retailer-marketing",
                    "_blank"
                  ) :
                process.env.VUE_APP_ITEM_NAME == 'SM-wholesale shop' ?
                window.open(
                  "https://smstore.com/news-stories/",
                  "_blank"
                ):
                process.env.VUE_APP_ITEM_NAME == 'Shop2u' ?
                window.open(
                  "https://finance.yahoo.com/news/british-chambers-commerce-visited-shop2u-170000654.html?fr=sycsrp_catchall",
                  "_blank"
                ):
                window.open(
                  "https://www.about.sainsburys.co.uk/news/media-enquiries",
                  "_blank"
                );
              },
            },
            {
              name: process.env.VUE_APP_ITEM_NAME == 'Alibaba'?this.$t("message.home.职业机会"):process.env.VUE_APP_ITEM_NAME == 'SIMON' ? this.$t("message.home.职业生涯") :process.env.VUE_APP_ITEM_NAME == 'INT Overstock' ? '':process.env.VUE_APP_ITEM_NAME == 'Shop2u' ? 'YouTube' : this.$t("message.home.stateMent"),
              path: "",
              clickEvent: () => {
                 process.env.VUE_APP_ITEM_NAME == 'Alibaba'? window.open(
                    "https://talent.alibaba.com/en/home?lang=en&spm=a2700.trademark.0.0.605aUWseUWseXn",
                    "_blank"
                  ) :
                process.env.VUE_APP_ITEM_NAME == 'SIMON'? window.open(
                    "https://careers.simon.com/",
                    "_blank"
                  ) :
                process.env.VUE_APP_ITEM_NAME == 'SM-wholesale shop' ?
                window.open(
                  "https://www.smsupermalls.com/",
                  "_blank"
                ):
                process.env.VUE_APP_ITEM_NAME == 'Shop2u' ? window.open('https://www.youtube.com/@shop2u','_blank'):
                window.open(
                  "https://www.about.sainsburys.co.uk/sustainability/plan-for-better/our-stories/2017/standing-up-to-modern-slavery",
                  "_blank"
                );
              },
            },
          ],
        },
      ],
      payList: [
        {
          img: bn,
          name: "Binance",
          clickEvent: () => {
            window.open("#", "_blank");
          },
        },
        {
          img: hb,
          name: "Huobi",
          clickEvent: () => {
            window.open("#/en-us/", "_blank");
          },
        },
        {
          img: oy,
          name: "OKX",
          clickEvent: () => {
            window.open("#", "_blank");
          },
        },
        {
          img: kk,
          name: "KraKen",
          clickEvent: () => {
            window.open("#", "_blank");
          },
        },
        {
          img: cb,
          name: "Coinbase",
          clickEvent: () => {
            window.open("#", "_blank");
          },
        },
        {
          img: process.env.VUE_APP_ITEM_NAME == "Hive" || process.env.VUE_APP_ITEM_NAME === 'TikTok-Wholesale' ? bit : process.env.VUE_APP_ITEM_NAME == "Argos" ||process.env.VUE_APP_ITEM_NAME == "ArgosShop" ? crypto : hl,
          name: process.env.VUE_APP_ITEM_NAME == "Hive" ? 'Bitoex':process.env.VUE_APP_ITEM_NAME == "Argos" ||process.env.VUE_APP_ITEM_NAME == "ArgosShop" ? 'Crypto' : "MetaMask",
          clickEvent: () => {
            process.env.VUE_APP_ITEM_NAME == "Hive" || process.env.VUE_APP_ITEM_NAME === 'TikTok-Wholesale'? window.open("#/", "_blank"):
            process.env.VUE_APP_ITEM_NAME == "Argos" ||process.env.VUE_APP_ITEM_NAME == "ArgosShop" ? window.open("#/", "_blank"):
            window.open("#/", "_blank");
          },
        },
        {
          img: process.env.VUE_APP_ITEM_NAME == "Argos" ||process.env.VUE_APP_ITEM_NAME == "ArgosShop" ? bit : kc,
          name: process.env.VUE_APP_ITEM_NAME == "Argos" ||process.env.VUE_APP_ITEM_NAME == "ArgosShop" ? "Bitopro":"KuCoin",
          clickEvent: () => {
             process.env.VUE_APP_ITEM_NAME == "Argos" ||process.env.VUE_APP_ITEM_NAME == "ArgosShop" ? window.open("#", "_blank"):
            window.open("https://www.kucoin.com ", "_blank");
          },
        },
        {
          img:process.env.VUE_APP_ITEM_NAME == "Hive" || process.env.VUE_APP_ITEM_NAME === 'TikTok-Wholesale'? maicoin:process.env.VUE_APP_ITEM_NAME == "Argos" ||process.env.VUE_APP_ITEM_NAME == "ArgosShop" ? maicoin: bf,
          name: process.env.VUE_APP_ITEM_NAME == "Hive" || process.env.VUE_APP_ITEM_NAME === 'TikTok-Wholesale'? "Bitfinex":process.env.VUE_APP_ITEM_NAME == "Argos" ||process.env.VUE_APP_ITEM_NAME == "ArgosShop" ? "MaiCoin":"Bitfinex",
          clickEvent: () => {
            process.env.VUE_APP_ITEM_NAME == "Hive"|| process.env.VUE_APP_ITEM_NAME === 'TikTok-Wholesale' ? window.open("#/", "_blank"):
            process.env.VUE_APP_ITEM_NAME == "Argos" ||process.env.VUE_APP_ITEM_NAME == "ArgosShop" ? window.open("#/", "_blank"):
            window.open("#", "_blank");
          },
        },
      ],
      lang: "",
      showOnlieService: false,
      onlinePath: "",
    };
  },
  computed: {
    ...mapGetters(["existToken", "isLogin", "userInfo"]),
  },
  mounted() {
    // this.$set(
    //   this.linkNav[0].nav[0],
    //   "name",
    //   this.existToken
    //     ? this.$t("message.home.userCenter")
    //     : this.$t("message.home.login" /** 登录*/)
    // );
    // this.$set(
    //   this.linkNav[0].nav[0],
    //   "clickEvent",
    //   this.existToken
    //     ? () => this.$router.push("/userInfo/dashboard")
    //     : () => this.$router.push("/login")
    // );
    // console.log('isLogin ->', this.isLogin);
    this.lang = localStorage.getItem("ES_LANG");
    this.getOnlinePath();
    // console.log('this.logoList ->', this.logoList);
    this.bassEmail = this.$multiItem[process.env.VUE_APP_ITEM_NAME]?.mail;
     if(this.itemname == 'FamilyMart'){
      this.logoList = this.logoList.slice(1,6)
    }else if(this.itemname == 'Hive'|| process.env.VUE_APP_ITEM_NAME === 'TikTok-Wholesale'){
      this.logoList = this.logoList.slice(1,5)
      this.linkNav[3].nav = this.linkNav[3].nav.slice(0, 1)
    } else if( this.itemname == 'FamilyShop'){
      this.logoList = this.logoList.slice(0,6)
    } else if(this.itemname == 'SM-wholesale shop'){
      this.logoList = this.logoList.slice(0,2).concat(this.logoList.slice(4,8))
    }
    else {
      this.logoList = this.logoList.slice(0,5)
    }
   if(this.itemname == 'Green Mall'){
      this.linkNav = this.linkNav.slice(0,3)
   }
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    identification(val) {
      // let codeReg = new RegExp("/[^\w\.\/]/ig"), //正则 英文+数字；
      //   len = val.length,
      //   str = "";
      // for (var i = 0; i < len; i++) {
      //   if (codeReg.test(val[i])) {
      //     str += val[i];
      //   }
      // }
      this.email = val;
    },
     async getOnlinePath() {
      let res = await apiGetCustomerService({code:'customer_service_url'});
      // console.log('res ->', res);
      this.onlinePath = res.data.customer_service_url
    },
    async subScription() {
      // console.log("this.email ->", this.email);
      var reg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
      var ret = reg.test(this.email);
      // console.log("ret ->", ret);
      // console.log("this.email ->", this.email);
      if (ret) {
        const res = await sub({ email: this.email });
        if (res.code == 0) {
          this.$message.success(
            this.$t("message.home.subscription") +
              this.$t("message.home.successTips")
          );
        }
      } else {
        this.$message.warning(this.$t("message.home.mailboxCheck"));
      }

      // console.log("res ->", res);
    },
  },
};
</script>

<style lang="scss">
html[dir="rtl"]{
  .footer-nav{
    margin-left: 0;
    margin-right: 120px;
  }
  .tuodong{
    direction: ltr;
  }
}
.footer {
  background-color: var(--color-footer-bg);
  padding: 27px 20px;
  &-title {
    // border-bottom: 1px solid #3f3f3f;
    // padding-bottom: 30px;
    // margin-bottom: 27px;

    img {
      height: 65px;
      // height: 44px;
      margin-right: 9px;
      cursor: pointer;
    }
    h1 {
      color: var(--color-white);
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
  }

  &-wrapper {
    align-items: flex-start !important;
    border-bottom: 1px solid #3f3f3f;
    padding: 0 40px;
    .footer-title {
      display: flex;
      flex-direction: column;
      align-items: inherit;
      p {
        // color: var(--color-main);
        color: var(--color-footer);
        font-size: 12px;
        margin-top: 26px;
      }
      .el-input__inner {
        width: 287px;
        height: 44px;
        margin: 12px 0 25px 0;
      }
      .sub {
        width: 156px;
        height: 42px;
        // color: var(--color-main);
        color: var(--color-footer);
        line-height: 42px;
        font-size: 12px;
        text-align: center;
        // border: 1px solid var(--color-main);
        border: 1px solid var(--color-footer);
        border-radius: 4px;
        cursor: pointer;
        will-change: filter;
        transition: filter 1300ms;
        &:hover {
          // background-color: var(--color-main);
          // filter: brightness(--color-footer);
          background-color: var(--color-footer);
          color: #fff;
        }
      }

    }
  }
  &-nav {
    width: 100%;
    display: flex;
    margin-left: 120px;
    &-item {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      span {
        font-size: 16px;
        font-weight: 700;
        // color: var(--color-main);
        color: var(--color-footer);
        margin-bottom: 37px;
      }
      ul {
        display: flex;
        list-style: none;
        flex-direction: column;
        li {
          margin-bottom: 37px;
          font-size: 12px;
          font-weight: 300;
          color: var(--color-white);
          cursor: pointer;
          &:hover {
            // color: var(--color-main);
            color: var(--color-footer);
          }
        }
      }
    }
  }
  .sec {
    padding-top: 20px;
    padding-bottom: 10px;
    justify-content: space-between;
    .payment {
      .title-f {
        font-size: 14px;
        color: #fff;
        // margin: 0 !important;
      }
      .payment-methods {
        display: flex;
        width: 348px;
        flex-wrap: wrap;
        justify-content: space-between;
        .pay {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 35px;
          width: 42px;
          cursor: pointer;
          &:hover span {
            // color: var(--color-main);
            color: var(--color-footer);
          }
          img {
            width: 32px;
            height: 32px;
            margin-bottom: 6px;
            margin-top: 15px;
          }
          span {
            font-size: 10px;
            color: #ababab;
          }
        }
      }
    }
    .argos {
      display: flex;
      .left {
        margin-left: 58px;
        margin-right: 68px;
        color: #fff;
        font-size: 12px;
        .title {
          font-size: 20px;
          font-weight: 600;
          margin: 19px 0 10px 0;
          color: #fff !important;
        }
        .dec {
          text-align: left;
          white-space: normal;
          word-break: normal;
          overflow-wrap: normal;
          hyphens: none;
        }
      }
      .right{
        width: 230px;
        img{
          width: 230px;
        }
      }
    }
  }
  .sec-img {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 84px;
    margin-bottom: 28px;
    img {
      cursor: pointer;
      margin-right: 37px;
      max-height: 28px;
    }
  }
  .just-img {
    img {
      &:nth-child(5) {
        max-height: 58px !important;
      }
      &:nth-child(1) {
        max-height: 18px !important;
        margin-top: 4px;
      }
    }
  }
  .img-sec {
    img {
      &:nth-child(1) {
        transform: translate(4px, 7px);
      }
    }
  }
  &-bottom {
    font-size: 12px;
    padding: 22px 20px;
    color: #6b6b6b;
  }
}
</style>
