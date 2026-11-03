<script>
import levela from "@/assets/level/a.png";
import levelb from "@/assets/level/b.png";
import levelc from "@/assets/level/c.png";
import levelo from "@/assets/level/o.png";
import levels from "@/assets/level/s.png";
import levelss from "@/assets/level/ss.png";
import levelsss from "@/assets/level/sss.png";
import {projectTitle} from "@/settings";
import FormatNumberShow from "@/components/FormatNumberShow/index.vue";
import e from "@/assets/level/e.png";
import r from "@/assets/level/r.png";
import PayModal from "@/components/payModal/index.vue";
import {buySellerLevel} from "@/api/user";
import {mapGetters} from "vuex";

export default {
  name: "Card",
  components: {PayModal, FormatNumberShow},
  props: {
    showTeamNum: {
      type: Boolean,
      default: false
    },
    levelList: {
      type: Array,
      default: () => {
        return []
      }
    },
    isBuySellerLevel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6],
      levela,
      levelb,
      levelc,
      levelo,
      levels,
      levelss,
      levelsss,
      e,
      r,
      projectTitle,
      payModalShow: false,
      buyLevel: '',
      //等级和index对应关系
      levelIndex: {
        'O': 0,
        'C': 1,
        'B': 2,
        'A': 3,
        'S': 4,
        'SS': 5,
        'SSS': 6,
      },
    }
  },
  computed: {
    ...mapGetters(['merchantInfo']),
  },
  methods: {
    getLevelIcon(level) {
      switch (level) {
        case 'O':
          return this.levelo
        case 'A':
          return this.levela
        case 'B':
          return this.levelb
        case 'C':
          return this.levelc
        case 'S':
          return this.levels
        case 'SS':
          return this.levelss
        case 'SSS':
          return this.levelsss
        default:
          return this.levelo
      }
    },
    payCallback(password) {
      buySellerLevel({
        level: this.buyLevel,
        safeword: password,
      }).then((res) => {
        if (res.code === "0") {
          this.$notify({
            message: this.$t("购买成功"),
            type: "success",
          });
          //刷新页面
          this.$emit('refresh')
        } else {
          this.$notify({
            type: 'danger',
            message: res.msg
          });
        }
      });
      this.payModalShow = false
    },
    payLevel(e) {
      this.buyLevel = e.level
      this.payModalShow = true
    },
    changeShowModel(e) {
      this.showModel = e
    },
  },
};
</script>

<template>
  <el-card>
    <div class="seller-level-list">
      <div :class="item.level+' seller-level-card'" v-for="(item,index) in levelList" :key="index">
        <div class="title">
          <div class="level-title-desc">
            <div class="level-title">{{ $t("{_$1} - 等级卖家", {_$1: item.level}) }}
              <!--      当前等级        -->
              <el-tag v-if="item.level === merchantInfo.mallLevel" type="danger" size="mini">{{
                  $t("当前等级")
                }}
              </el-tag>
            </div>
            <div class="level-desc">
              <div class="desc-content">
                <div class="desc-content-text" v-if="!['Shop2U'].includes(projectTitle)">{{ $t('运行资金') }}：<span
                  class="desc-content-text-span">
                  <FormatNumberShow :data="item.rechargeAmountCnd" :currency="true"/>
                </span></div>
                <div class="desc-content-text">{{ $t('分店数') }}：<span
                  class="desc-content-text-span">{{ item.popularizeUserCountCnd || 0 }}</span></div>
                <div class="desc-content-text" v-if="showTeamNum">{{ $t('团队人数') }}：<span
                  class="desc-content-text-span">{{ item.teamNum || 0 }}</span></div>
              </div>
            </div>
          </div>
          <div :class="showTeamNum?'desc-image':'mini desc-image'">
            <el-image :src="getLevelIcon(item.level)" fit="cover"/>
          </div>
        </div>
        <div class="content">
          <div class="content-item">
            <div class="content-item-left">
              <svg-icon icon-class="level-dollar" class-name="card-panel-icon"/>
              {{ $t('销售利润比') }}：
            </div>
            <div class="content-item-right">
              <span>{{
                  (item.profitRationMin * 100).toFloor(2)
                }}%</span>-<span>{{ (item.profitRationMax * 100).toFloor(2) }}%</span>
            </div>
          </div>
          <div class="content-item">
            <div class="content-item-left">
              <svg-icon icon-class="level-wavy" class-name="card-panel-icon"/>
              {{ $t('平台流量扶持量（每日）') }}：
            </div>
            <div class="content-item-right">
              {{ item.promoteViewDaily || 0 }}
            </div>
          </div>
          <div class="content-item">
            <div class="content-item-left">
              <svg-icon icon-class="level-earth" class-name="card-panel-icon"/>
              {{ $t('全球到货时间') }}：
            </div>
            <div class="content-item-right">
              {{ item.deliveryDays || 0 }}
            </div>
          </div>
          <div class="content-item">
            <div class="content-item-left">
              <svg-icon icon-class="level-purchase" class-name="card-panel-icon"/>
              {{ $t('采购优惠') }}：
            </div>
            <div class="content-item-right">
              <span>{{ (item.sellerDiscount * 100).toFloor(2) }}%</span>
            </div>
          </div>
          <div class="content-item" v-if="!['Inchoi'].includes(projectTitle)">
            <div class="content-item-left">
              <svg-icon icon-class="level-bonus" class-name="card-panel-icon"/>
              {{ $t('升级礼金') }}：
            </div>
            <div class="content-item-right">
             <span v-if="item.upgradeCash">
              <FormatNumberShow :data="item.upgradeCash" :currency="true"/>
              </span>
              <span v-else>
              <el-image :src="e" style="height: 14px;"/>
              </span>
            </div>
          </div>
          <div class="content-item" v-if="item.goodsNum>0">
            <div class="content-item-left">
              <svg-icon icon-class="level-class" class-name="card-panel-icon"/>
              {{ $t("可售商品数量") }}：
            </div>
            <div class="content-item-right">
              {{ item.goodsNum || 0 }}
            </div>
          </div>
          <div class="content-item">
            <div class="content-item-left">
              <svg-icon icon-class="level-customer-service" class-name="card-panel-icon"/>
              {{ $t('专属服务') }}：
            </div>
            <div class="content-item-right">
              <svg-icon icon-class="level-true" class-name="card-panel-icon" v-if="item.hasExclusiveService"/>
              <svg-icon icon-class="level-false" class-name="card-panel-icon" v-else/>
            </div>
          </div>
          <div class="content-item">
            <div class="content-item-left">
              <svg-icon icon-class="level-recommend" class-name="card-panel-icon"/>
              {{ $t('首页推荐') }}：
            </div>
            <div class="content-item-right">
              <svg-icon icon-class="level-true" class-name="card-panel-icon" v-if="item.recommendAtFirstPage"/>
              <svg-icon icon-class="level-false" class-name="card-panel-icon" v-else/>
            </div>
          </div>
          <div class="content-item" v-if="['FamilyShop'].includes(projectTitle)">
            <div class="content-item-left">
              <svg-icon icon-class="level-recommend" class-name="card-panel-icon"/>
              {{ $t('成为供货商') }}：
            </div>
            <div class="content-item-right">
              <svg-icon icon-class="level-true" class-name="card-panel-icon" v-if="item.level==='SS'"/>
              <svg-icon icon-class="level-false" class-name="card-panel-icon" v-else/>
            </div>
          </div>
          <div class="content-item" v-if="isBuySellerLevel">
            <div class="content-item-left card-pay-title">
              {{ $t('等级售价') }}：
              <FormatNumberShow :data="item.price" :currency="true"/>
            </div>
            <div class="content-item-right">
              <el-button type="primary" @click="payLevel(item)"
                         v-if="levelIndex[item.level]> levelIndex[merchantInfo.mallLevel]">{{ $t("购买等级") }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PayModal v-model="payModalShow" :payCallback="payCallback" @changeShowModel="changeShowModel"/>
  </el-card>
</template>

<style scoped lang="scss">
.seller-level-list {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.seller-level-card {
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  //宽带为33.33%减去48px
  width: calc(33.33% - 16px);
  margin-right: 24px;
  margin-bottom: 24px;

  &.C {
    .title::after {
      background: #D6F0F5;
    }

    background: linear-gradient(180deg, #F2FDFF 0%, #E9FAFF 100%);
  }

  &.B {
    .title::after {
      background: #E9EFA2;
    }

    background: linear-gradient(180deg, #FFFEF1 0%, #FBFFE0 100%);
  }

  &.A {
    .title::after {
      background: #EBD0F9;
    }

    background: linear-gradient(180deg, #F9EEFF 0%, #F3DFFF 100%);
  }

  &.O {
    .title::after {
      background: #EBD0F9;
    }

    background: linear-gradient(180deg, #F2F2FF 0%, #E9E9FF 100%);
  }

  &.S {
    .title::after {
      background: #FBE6E2;
    }

    background: linear-gradient(180deg, #FFF4F0 0%, #FFE5D9 100%);
  }

  &.SS {
    .title::after {
      background: #F9D2CB;
    }

    background: linear-gradient(180deg, #FFF5F1 0%, #FFD6D6 49.48%, #FFC5AB 100%);
  }

  &.SSS {
    .title::after {
      background: #EBD0F9;
    }

    background: linear-gradient(180deg, #FAE1FF 0%, #FAD7FF 49.48%, #F5B1FF 100%);
  }

  //每三个为一行
  &:nth-child(3n) {
    margin-right: 0;
  }

  &:nth-child(n+4) {
    margin-bottom: 0;
  }

  .title {
    display: flex;
    justify-content: space-between;
    color: #000;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    position: relative;
    margin-bottom: 18px;
    padding-bottom: 18px;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      position: absolute;
      bottom: 0;
    }

    .desc-image {
      width: 100px;
      height: 100px;

      &.mini {
        width: 80px;
        height: 80px;
      }
    }

    .level-title {
      font-weight: 700;
      margin-bottom: 12px;
    }

    .desc-content-text {
      line-height: 22px;
    }

    .level-desc {
      display: flex;
      justify-content: space-between;
      color: #333;
      font-family: Roboto;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;


      .desc-content-text-span {
        font-weight: 500;
      }


    }
  }

  .content {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;

    .content-item {
      display: flex;
      justify-content: space-between;
      color: #333;
      font-family: Roboto;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .content-item-right {
        font-weight: 500;
      }

      .card-pay-title {
        color: #1552F0;
        font-family: Roboto;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 36px; /* 24.064px */
      }
    }
  }
}


</style>
