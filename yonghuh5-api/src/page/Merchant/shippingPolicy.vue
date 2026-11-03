<template>
  <div class="merchantSettled">
    <mer-chant-header
      id="product"
      :title="$t('shopping-shippingPolicy')"
    ></mer-chant-header>
    <div class="merchantSettled-wap">
      <div class="step-div">
        <div class="content">
          <div>
            <p>
              {{ $t("shopping-info") }}
            </p>
            <p v-if="itemname == 'Argos'">{{ $t("shopping-info1-0")}}<span class="shopLink" @click="goShop"> ArgosShop</span></p>
            <p v-else>{{ $t("shopping-info1-1", { name: itemname }) }}</p>
            <p>{{ $t("shopping-info1") }}</p>
          </div>
          <div class="">
            <h2 class="title">{{ $t("shopping-title1") }}</h2>
            <p>
              {{ $t("shopping-title1info") }}
            </p>
            <p>{{ $t("shopping-title1info-1") }}</p>
            <p>
              {{ $t("shopping-title1info-2") }}
            </p>
            <!-- <p>{{ $t("shopping-title1info-3") }}</p> -->
          </div>
          <div>
            <h2 class="title">{{ $t("shopping-title2") }}</h2>
            <div>
              <p>
                {{ $t("shopping-title2info") }}
              </p>
              <p>
                {{ $t("shopping-title2info-1") }}
              </p>
              <el-table
                :data="tableData"
                :span-method="objectSpanMethod"
                border
                style="width: 100%; margin-top: 20px"
              >
                <el-table-column
                  prop="id"
                  :label="$t('shopping-table1-header')"
                  width="180"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  :label="$t('shopping-table1-header-1')"
                >
                </el-table-column>
                <el-table-column
                  prop="amount1"
                  :label="$t('shopping-table1-header-2')"
                >
                </el-table-column>
              </el-table>
            </div>
            <div v-if="itemname !== 'GreenMall'">
              <h2 class="title">
                3、{{ $t("shopping-title3") }}
              </h2>
              <el-table
                :data="tableData2"
                border
                style="width: 100%; margin-top: 20px"
              >
                <el-table-column
                  prop="name"
                  :label="$t('shopping-table2-header')"
                  width="180"
                >
                </el-table-column>
                <el-table-column prop="lev1" label="5" align="center">
                </el-table-column>
                <el-table-column prop="lev2" label="10" align="center">
                </el-table-column>
                <el-table-column prop="lev3" label="15" align="center">
                </el-table-column>
                <el-table-column prop="lev4" label="20" align="center">
                </el-table-column>
                <el-table-column prop="lev5" label="25" align="center">
                </el-table-column>
                <el-table-column prop="lev6" label=">25" align="center">
                </el-table-column>
              </el-table>
            </div>
            <div>
              <h2 class="title">{{itemname=='GreenMall'?'3、' : '4、'}}{{ $t("shopping-title4") }}</h2>
              <p class="">{{ $t("shopping-title4-qs1") }}</p>
              <p>
                {{ $t("shopping-title4-d") }}
              </p>
              <p class="">{{ $t("shopping-title4-qs2") }}</p>
              <p>{{ $t("shopping-title4-d1") }}</p>
              <p>
                {{ $t("shopping-title4-d2") }}
              </p>
            </div>
            <div>
              <h2 class="title">{{itemname=='GreenMall'?'4、' : '5、'}}{{ $t("shopping-title5") }}</h2>
              <p class="">{{ $t("shopping-title5-qs") }}</p>
              <p>
                {{ $t("shopping-title5-d", { name: itemname }) }}
              </p>
              <p>{{ $t("shopping-title5-d1") }}</p>
              <p>{{ $t("shopping-title5-d1-tit") }}</p>
              <p>
                {{ $t("shopping-title5-d1-tit-1") }}
              </p>
              <p>{{ $t("shopping-title5-d1-tit-2") }}</p>
              <p>
                {{ $t("shopping-title5-d1-tit-2-1", { name: itemname }) }}
              </p>
              <p>
                {{ $t("shopping-title5-d1-tit-2-2", { name: itemname }) }}
              </p>
              <p>
                {{ $t("shopping-title5-d1-tit-2-3") }}
              </p>
              <p>{{ $t("shopping-title5-d1-tit-2-4",{time:itemname == "Inchoi" || itemname == 'GreenMall' || itemname == 'Ant Mall'?'48':'72'}) }}</p>
              <p>{{ $t("shopping-title5-d1-tit-2-5", { name: itemname }) }}</p>
              <!-- <p>{{ $t("shopping-title5-d1-tit-3") }}</p>
              <p>
                {{ $t("shopping-title5-d1-tit-3-1", { name: itemname }) }}
              </p> -->
            </div>

            <div v-if="itemname !== 'AntMall'">
              <h2 class="title">{{itemname=='GreenMall'?'5、' : '6、'}}{{ $t("shopping-title6") }}</h2>
              <p v-if="itemname !== 'GreenMall'">
                {{ $t("shopping-title6info") }}
              </p>
              <p v-else>
                {{$t("shopping-title6info1")}}
              </p>
            </div>

            <div>
              <h2 class="title">{{itemname=='GreenMall' || itemname == 'AntMall'?'6、' : '7、'}}{{ $t("shopping-title7") }}</h2>
              <p>
                {{ $t("shopping-title7-1", { name: itemname }) }}
              </p>
              <p>
                {{ $t("shopping-title7-2", { name: itemname }) }}
              </p>
              <p>{{ $t("shopping-title7-3") }}</p>
              <p>
                <span>{{ $t("shopping-title6img1") }}</span>
              </p>
              <img
                src="@/assets/image/argos1.png"
                alt=""
                v-if="itemname == 'Argos' || itemname == 'ArgosShop'"
              />
              <img v-else src="@/assets/image/Merchant/mjzc_1.png" alt="" />

              <p>
                <span>{{ $t("shopping-title6img2") }}</span>
              </p>
              <img
                src="@/assets/image/argos2.png"
                alt=""
                v-if="itemname == 'Argos' || itemname == 'ArgosShop'"
              />
              <img src="@/assets/image/Merchant/mjzc_2.png" alt="" v-else />

              <p>
                <span>{{ $t("shopping-title6img3") }}</span>
              </p>
              <img
                src="@/assets/image/argos3.png"
                alt=""
                v-if="itemname == 'Argos' || itemname == 'ArgosShop'"
              />
              <img src="@/assets/image/Merchant/mjzc_3.png" alt="" v-else />
            </div>
            <div>
              <h2 class="title">{{itemname=='GreenMall' || itemname == 'AntMall'?'7、' : '8、'}}{{ $t("shopping-title8") }}</h2>
              <p>
                {{ $t("shopping-title8-1") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <mer-chant-footer></mer-chant-footer>
  </div>
</template>

<script>
import merChantHeader from "./components/mer-chant-header";
import merChantFooter from "@/components/Footer";
import { mapGetters } from "vuex";
// import { Table, TableColumn } from "element-ui";
export default {
  components: {
    merChantHeader,
    merChantFooter,
    // Table,
  },
  data() {
    return {
      itemname:
        process.env.VUE_APP_ITEM_NAME == "Mbuy"
          ? "Argos"
          : process.env.VUE_APP_ITEM_NAME,
      lang: [
        {
          title: "简体中文",
          key: "cn",
          icon: require("@/assets/image/language/cn.png"),
        },
        {
          title: "English",
          key: "en",
          icon: require("@/assets/image/language/usa.png"),
        },
        {
          title: "繁体中文",
          key: "tw",
          icon: require("@/assets/image/language/tw.png"),
        },
      ],
    };
  },
  mounted(){
    if(this.itemname == 'Argos') {
      this.$router.push('/AShippingPolicy')
    }
  },
  computed: {
    tableData2(){
      return [
        {
          name: this.$t("shopping-table2-header2"),
          lev1: "1" + this.$t("shopping-table2-j"),
          lev2: "2" + this.$t("shopping-table2-j"),
          lev3: "3" + this.$t("shopping-table2-j"),
          lev4: "4" + this.$t("shopping-table2-j"),
          lev5: "5" + this.$t("shopping-table2-j"),
          lev6: "6" + this.$t("shopping-table2-j"),
        },
        {
          name: this.$t("shopping-table2-row", { name: this.itemname }),
          lev1: "●",
          lev2: "●",
          lev3: "●",
          lev4: "●",
          lev5: "●",
          lev6: "●",
        },
        {
          name: this.$t("shopping-table2-row1", { name: this.itemname }),
          lev1: "",
          lev2: "●",
          lev3: "●",
          lev4: "●",
          lev5: "●",
          lev6: "●",
        },
        {
          name: this.$t("shopping-table2-row2"),
          lev1: "",
          lev2: "●",
          lev3: "●",
          lev4: "●",
          lev5: "●",
          lev6: "●",
        },
        {
          name: this.$t("shopping-table2-row3"),
          lev1: "",
          lev2: "",
          lev3: "●",
          lev4: "●",
          lev5: "●",
          lev6: "●",
        },
        {
          name: this.$t("shopping-table2-row4"),
          lev1: "",
          lev2: "",
          lev3: "",
          lev4: "●",
          lev5: "●",
          lev6: "●",
        },
        {
          name: this.$t("shopping-table2-row5"),
          lev1: "",
          lev2: "",
          lev3: "",
          lev4: "",
          lev5: "●",
          lev6: "●",
        },
      ]
    },
    tableData(){
      return [
        {
          id: this.$t("shopping-table1-row"),
          name: this.$t("shopping-table1-row1-clo1"),
          amount1: this.$t("shopping-table1-row1-clo3"),
        },
        {
         id: this.$t("shopping-table1-row1"),
          name: this.$t("shopping-table1-row1-clo2",{time:process.env.VUE_APP_ITEM_NAME == "Inchoi" || process.env.VUE_APP_ITEM_NAME == "GreenMall" || process.env.VUE_APP_ITEM_NAME == 'AntMall'?'48':process.env.VUE_APP_ITEM_NAME == "INT Overstock"?"24":'72'}),
          // amount1: this.$t("shopping-table1-row1-clo3"),
        },
        {
          id: this.$t("shopping-table1-row2"),
          name: this.$t("shopping-table1-row2-clo1"),
          amount1: this.$t("shopping-table1-row2-clo4"),
        },
        {
          // id: "客户服务",
          name: this.$t("shopping-table1-row2-clo2",{num:process.env.VUE_APP_ITEM_NAME == 'AntMall'?'3':'5'}),
          amount1: this.$t("shopping-table1-row1-clo3"),
        },
        {
          id: this.$t("shopping-table1-row3"),
          name: this.$t("shopping-table1-row2-clo3"),
          amount1: this.$t("shopping-table1-row1-clo3"),
        },
        {
          // id: "违背承诺",
          name: this.$t("shopping-table1-row3-clo1"),
          amount1: this.$t("shopping-table1-row1-clo3"),
        },
      ]
    }, 
    isPC() {
      let userAgentInfo = navigator.userAgent;
      let Agents = [
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod",
      ];
      let flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    languageIcon() {
      const language = this.$store.getters.language || "CN";
      const icon = {
        "cn": require("@/assets/image/language/cn.png"),
        "en": require("@/assets/image/language/usa.png"),
        "tw": require("@/assets/image/language/tw.png"),
      };
      return icon[language];
    },
    ...mapGetters({
      activeLang: "language",
    }),
  },
  // computed:[]
  methods: {
    goShop(){
      window.open('#/#/index','_black')
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      console.log("columnIndex ->", columnIndex);
      if (columnIndex === 0 ) {
        console.log('rowIndex ->', rowIndex);
        if(rowIndex === 0 || rowIndex  === 1){
          return {
            rowspan: 1,
            colspan: 1,
          }
          } else if (rowIndex % 2 === 0 && rowIndex  !== 1) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      if(columnIndex === 2){
        if(rowIndex === 0 || rowIndex  === 1){
          return {
            rowspan: 2,
            colspan: 1,
          }}else{
          return {
            rowspan: 1,
            colspan: 1,
          };
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.shopLink{
  color: blue;
  position: relative;
  z-index: 9;
  cursor: pointer;
}
.merchantSettled-wap {
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1200px;
  margin: 0 auto 20px auto;

  .step-div {
    width: 1197px;
    background: #fff;

    border-radius: 4px;
    margin-top: -86px;

    .content {
      padding: 20px 30px;
      border: 1px solid #eeeeee;
      h2 {
        margin-top: 14px;
      }
      .title {
        font-size: 24px;
        color: #0f1111;
        font-weight: 500;
        margin-bottom: 14px;
      }
      .ask {
        color: dodgerblue;
      }
      p,
      ul li {
        font-family: "PingFang HK";
        font-style: normal;
        font-size: 14px;
        line-height: 20px;
        color: #333333;
        padding: 6px 0;
        list-style-type: disc;
      }
    }
    img {
      max-width: 100%;
    }
    .bottom {
      height: 140px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      margin: 20px 0;

      .button {
        width: 475px;
      }
    }
  }
}
@media screen and (max-width: 500px) {
  .merchantSettled {
    width: 100%;
    overflow: hidden;
    .merchantSettled-wap {
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100% !important;
      position: relative;

      .step-div {
        width: 100%;
        background: #fff;

        border-radius: 4px;
        margin-top: -86px;

        .content {
          padding: 20px 30px;
          border: 1px solid #eeeeee;

          .title p {
            font-family: "PingFang HK";
            font-style: normal;
            font-size: 14px;
            line-height: 20px;
            color: #333333;
            padding: 6px 0;
          }
        }

        // .content2 {
        //   // padding: 20Px 10Px;
        // }

        .bottom {
          height: 100px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          margin: 20px 0;

          .button {
            width: 80%;
          }
        }
      }
    }
  }
}
</style>
