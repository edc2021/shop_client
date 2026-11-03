<template>
  <div class="merchandise">
    <SetBootSteps/>
    <el-card class="main">
      <div class="show-level">
        <div class="left-image">
          <el-image :src="getLevelIcon(merchantInfo.mallLevel||'O')" class="left-image-icon" fit="cover"></el-image>
          <div class="left-image-icon-text">{{ $t("等级{_$1}", {_$1: mallLevel}) }}</div>
        </div>
        <div class="show-level-text">
          <div class="show-level-text-title">{{ $t("{_$1}-等级卖家", {_$1: mallLevel}) }}</div>
          <div class="show-level-text-content">{{ $t('当前分店人数：') }}<span>{{
              merchantInfo.childNum || 0
            }}/{{
              merchantInfo.childNum > nextLevelData.popularizeUserCountCnd ? merchantInfo.childNum : (nextLevelData.popularizeUserCountCnd || 0)
            }}</span>
            <template v-if="showTeamNum"> {{ $t('，当前团队人数：') }}<span>{{
                merchantInfo.teamNum || 0
              }}/{{ currentLevelData.teamNum || 0 }}</span></template>
          </div>
          <div class="show-level-text-content">{{ $t("当前运行资金:") }}
            <FormatNumberShow style="color: #2C78F8" :data="merchantInfo.storeMoneyRechargeAcc" :currency="true"/>
            <template v-if="nextLevelMoney>0">
              {{ $t(`，距离等级{_$1}还需：`, {_$1: nextLevel(mallLevel)}) }}
              <FormatNumberShow style="color: #2C78F8" :data="nextLevelMoney" :currency="true"/>
            </template>
          </div>
          <div class="show-level-text-content">{{ $t("当前采购优惠") }}
            <FormatNumberShow style="color: #2C78F8" :data="currentLevelData.sellerDiscount*100"/>
            <span style="color: #2C78F8">%</span>
          </div>
        </div>
        <div class="show-level-slider">
          <div class="show-level-slider-text">
            <el-image :src="getLevelIcon(merchantInfo.mallLevel||'O')" class="left-image-icon" fit="cover"></el-image>
            <span>{{ mallLevel }}</span>
          </div>
          <div class="show-level-slider-main">
            <div class="show-level-slider-line">
              <div
                class="show-level-slider-line-inner" :style="{width:upgradeProgress+'%'}"></div>
            </div>
            <div class="show-level-slider-tips" :style="{left:upgradeProgress+'%'}">
              {{ upgradeProgress }}%
            </div>
          </div>
          <div class="show-level-slider-text">
            <el-image :src="getLevelIcon(nextLevel(merchantInfo.mallLevel||'O'))" class="left-image-icon"
                      fit="cover"></el-image>
            <span>{{ nextLevel(mallLevel) }}</span>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="main">
      <div class="seller-level-content">
        <div class="right">
          <div class="title">
            {{ $t('升级') }}<b>{{ $t('销量扶持') }}</b>
            &nbsp;&nbsp;{{ $t('轻松') }}<b>{{ $t('月入过万') }}</b>
          </div>
          <!--          <div style="display: flex;justify-content: flex-start;">-->
          <!--            <div style="color: #333333;font-size: 20px;margin-right: 24px;" v-if="merchantInfo.childNum">-->
          <!--              {{ $t('当前分店人数：') }}{{ merchantInfo.childNum || 0 }}-->
          <!--            </div>-->
          <!--            <div style="color: #333333;font-size: 20px" v-if="merchantInfo.teamNum">-->
          <!--              {{ $t('当前团队人数：') }}{{ merchantInfo.teamNum || 0 }}-->
          <!--            </div>-->
          <!--          </div>-->
          <div>
            <div>1.{{ $t('卖家等级介绍') }}</div>
            <span>
            {{
                $t('平台为鼓励广大创业者，为创业者提供更大的商业机会，让您与我与我们一同成长，助您在销售中获得更大的成功，创业过程中为您准备了丰厚的升级奖励和销售利润比例提升，无论您是新手还是经验丰富的销售员，我们都鼓励您参与升级计划，并诚挚的邀请您加入我们，实现您的销售梦想！')
              }}
            </span>
          </div>
          <div>
            <div>2.{{ $t('会员升级说明') }}</div>
            <span>
              <b>{{ $t('会员升级') }}：</b>
              {{
                ["Shop2U"].includes(defaultSettings.projectTitle) ? $t('会员升级是通过直属推分店数决会员级别，分店数越高，系统将自动升级。') : $t('会员升级是通过直属推分店数决会员级别，分店数越高或运行资金满足条件，系统将自动升级。')
              }}
            </span>
            <br/>
            <span>
            <b>{{ $t('分店人数') }}：</b>{{
                $t("直属下级中，累计充值金额超过{_$1}将视为有效人数", {_$1: '$' + (limitRechargeAmount * 1).toFloor(2)})
              }}
            </span><br/>
            <span>
            <b>{{ $t('团队人数') }}：</b>{{
                $t("所有下级中，累计充值金额超过{_$1}视为有效团队人数", {_$1: '$' + (teamRechargeAmount * 1).toFloor(2)})
              }}
            </span><br/>
            <span>
            <b>{{ $t('销售利润比例') }}：</b>{{ $t('等级越高，获得销售利润越高') }}
            </span><br/>
            <span>
            <b>{{ $t('平台流量扶持') }}：</b>{{ $t('系统将优先为您提供一定商品流量曝光，创造更多的销售机会') }}
            </span><br/>
            <span v-if="!['Inchoi'].includes(defaultSettings.projectTitle)">
            <b>{{ $t('升级礼金') }}：</b>{{ $t('每升级成功，系统将自动发放升级礼金') }}
            </span>
          </div>
          <div>
            <div>3.{{ $t('成长规则') }}</div>
            <span>
            {{ $t('会员等级从升级那一刻开始计算，等级身份将终生有效；') }}
            </span>
          </div>
        </div>
      </div>
    </el-card>
    <SellerLevelCard
                     :levelList="sellerLevelList"
                     @refresh="refresh"
                     :isBuySellerLevel="isBuySellerLevel"
                     :showTeamNum="showTeamNum"/>

    <el-card v-if="false">
      <el-table :data="sellerLevelList" style="width: 100%">
        <el-table-column prop="level" :label="$t('卖家等级')" align="center">
          <template slot-scope="scope">
            <div style="display: flex;justify-content: center;align-items: center;">
              <el-image :src="getLevelIcon(scope.row.level)" style="height: 20px;margin-right: 6px;"/>
              <span style="line-height: 20px;">{{ scope.row.level }}&nbsp;{{ $t('级') }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="!['Shop2U'].includes(defaultSettings.projectTitle)" prop="rechargeAmountCnd"
                         :label="$t('运行资金')" align="center"></el-table-column>
        <el-table-column prop="popularizeUserCountCnd" :label="$t('分店数')" align="center"></el-table-column>
        <el-table-column prop="teamNum" :label="$t('团队人数')" align="center" v-if="showTeamNum">
          <template slot-scope="scope">
            <span>{{ scope.row.teamNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="profitRationMin" :label="$t('销售利润比')" align="center">
          <template slot-scope="scope">
            <span>{{
                (scope.row.profitRationMin * 100).toFloor(2)
              }}%</span>-<span>{{ (scope.row.profitRationMax * 100).toFloor(2) }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="promoteViewDaily" :label="$t('平台流量扶持量（每日）')" align="center"></el-table-column>
        <el-table-column prop="deliveryDays" :label="$t('全球到货时间')" align="center"></el-table-column>
        <el-table-column prop="sellerDiscount" :label="$t('采购优惠')" align="center">
          <template slot-scope="scope">
            <span>{{ (scope.row.sellerDiscount * 100).toFloor(2) }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="upgradeCash" :label="$t('升级礼金')" align="center"
                         v-if="!['Inchoi'].includes(defaultSettings.projectTitle)">
          <template slot-scope="scope">
           <span v-if="scope.row.upgradeCash">
              <FormatNumberShow :data="scope.row.upgradeCash" :currency="true"/>
            </span>
            <span v-else>
              <el-image :src="e" style="height: 14px;"/>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="hasExclusiveService" :label="$t('专属服务')" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.hasExclusiveService">
              <el-image :src="r" style="height: 14px;"/>
            </span>
            <span v-else>
              <el-image :src="e" style="height: 14px;"/>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="recommendAtFirstPage" :label="$t('首页推荐')" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.recommendAtFirstPage">
              <el-image :src="r" style="height: 14px;"/>
            </span>
            <span v-else>
              <el-image :src="e" style="height: 14px;"/>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="recommendAtFirstPage" :label="$t('成为供货商')" align="center"
                         v-if="['FamilyShop'].includes(defaultSettings.projectTitle)">
          <template slot-scope="scope">
            <span v-if="scope.row.level==='SS'">
              <el-image :src="r" style="height: 14px;"/>
            </span>
            <span v-else>
              <el-image :src="e" style="height: 14px;"/>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {getSellerLevelList, getSysParaService, seller_info_action_post} from "@/api/user";
import levela from '@/assets/level/a.png'
import levelb from '@/assets/level/b.png'
import levelc from '@/assets/level/c.png'
import levelo from '@/assets/level/o.png'
import levels from '@/assets/level/s.png'
import levelss from '@/assets/level/ss.png'
import levelsss from '@/assets/level/sss.png'
import e from '@/assets/level/e.png'
import r from '@/assets/level/r.png'
import FormatNumberShow from "@/components/FormatNumberShow/index.vue";
import defaultSettings from "@/settings";
import {mapGetters} from "vuex";
import SellerLevelCard from "@/views/marketing/sellerLevelCard.vue";

export default {
  name: 'SellerLevel',
  components: {FormatNumberShow, SellerLevelCard},
  data() {
    return {
      defaultSettings,
      sellerLevelList: [],
      showTeamNum: false,
      levela,
      levelb,
      levelc,
      levelo,
      levels,
      levelss,
      levelsss,
      e,
      r,
      limitRechargeAmount: 0,
      teamRechargeAmount: 0,
      //下一等级还差多少钱
      nextLevelMoney: 0,
      //当前等级数据
      currentLevelData: {},
      //升级进度比例
      //下一级数据
      nextLevelData: {},
      upgradeProgress: 0,
      isBuySellerLevel: false //是否支持购买升级
    }
  },
  mounted() {
    this.getSysPara()
  },
  computed: {
    ...mapGetters(['merchantInfo']),
    mallLevel() {
      return this.merchantInfo.mallLevel || 'O'
    }
  },
  watch: {
    //当merchantInfo变化时，重新获取等级列表
  },
  methods: {
    refresh() {
      this.getSysPara()
      //更新 this.merchantInfo
      this.$store.dispatch('user/getInfo')
      seller_info_action_post({}).then((res) => {
        this.$store.commit('user/CHANGE_MERCHANT_INFO', res.data)
      })
    },
    //获取当前等级的数据
    getCurrentLevelData(mallLevel = (this.mallLevel)) {
      return this.sellerLevelList.find(item => item.level === (mallLevel || 'O')) || {}
    },
    nextLevel(level = 'O') {
      switch (level) {
        case 'O':
          return 'C'
        case 'C':
          return 'B'
        case 'B':
          return 'A'
        case 'A':
          return 'S'
        case 'S':
          return 'SS'
        case 'SS':
          return 'SSS'
        case 'SSS':
          return 'SSS'
        default:
          return 'O'
      }
    },
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
    getSellerLevelList() {
      getSellerLevelList().then(res => {
        this.sellerLevelList = res.data.result
        this.showTeamNum = !!this.sellerLevelList.find(item => item.teamNum > 0)
        if (['Shop2U'].includes(defaultSettings.projectTitle)) {
          //upgradeCash 写死
          this.sellerLevelList.forEach(item => {
            item.upgradeCash = this.webShowUpgradeCash(item.level)
          })
        }
        this.currentLevelData = this.getCurrentLevelData() || {}
        this.nextLevelMoney = this.getCurrentLevelData(this.nextLevel(this.mallLevel)).rechargeAmountCnd - this.merchantInfo.storeMoneyRechargeAcc
        let a = this.merchantInfo.storeMoneyRechargeAcc // 当前等级的运行资金
        let b = this.getCurrentLevelData(this.nextLevel(this.mallLevel)) || {} // 下一等级的数据
        this.nextLevelData = b
        let c = b.rechargeAmountCnd || 0 // 下一等级的运行资金
        this.upgradeProgress = (((a / c) > 1 ? 1 : (a / c)) * 100).toFloor(2)
      })
    },
    webShowUpgradeCash(level) {
      switch (level) {
        case 'A':
          return 700
        case 'B':
          return 500
        case 'C':
          return 100
        case 'O':
          return 0
        case 'S':
          return 1000
        case 'SS':
          return 1500
        case 'SSS':
          return 2000
        default:
          return 0
      }
    },
    getSysPara() {
      getSysParaService({code: 'valid_recharge_amount_for_seller_upgrade,valid_recharge_amount_for_team_num,level_is_support_purchase'}).then(res => {
      // getSysParaService({code: 'valid_recharge_amount_for_seller_upgrade,valid_recharge_amount_for_team_num'}).then(res => {
        this.limitRechargeAmount = res.data.valid_recharge_amount_for_seller_upgrade
        this.teamRechargeAmount = res.data.valid_recharge_amount_for_team_num
        this.isBuySellerLevel = res.data.level_is_support_purchase === '1'
        this.getSellerLevelList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.merchandise {
  background-color: #f0f2f5;
  padding: 20px;
  height: 100%;

  .show-level {
    display: flex;
    align-items: center;

    .left-image {
      position: relative;

      .left-image-icon {
        width: 68px;
        height: 68px;
      }

      .left-image-icon-text {
        position: absolute;
        bottom: 0px;
        color: #FFF;
        font-family: PingFang SC;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        min-width: 65px;
        height: 20px;
        line-height: 20px;
        flex-shrink: 0;
        border-radius: 36px;
        background: linear-gradient(180deg, #FF965B 0%, #CE3925 100%);
      }
    }

    .show-level-text {
      text-align: left;
      margin: 0 120px 0 20px;

      .show-level-text-title {
        color: #333;
        font-family: Roboto;
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        margin-bottom: 6px;
      }

      .show-level-text-content {
        color: #333;
        font-family: PingFang SC;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;

        span {
          color: #2C78F8;
          font-family: PingFang SC;
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
      }
    }

    .show-level-slider {
      display: flex;
      align-items: center;
      flex: 1;

      .show-level-slider-text {
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.60);
        color: #FFF;
        font-family: PingFang SC;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        text-align: center;
        align-items: center;
        display: flex;
        justify-content: center;
        flex-shrink: 0;
        width: 30px;
        height: 30px;
        flex-direction: column;
        font-size: 12px;

        .el-image {
          width: 30px;
          height: 30px;
        }

        span {
          display: block;
          color: #ffffff;
          position: absolute;
          text-shadow: #000000 0px 0px 5px;
        }
      }

      .show-level-slider-main {
        position: relative;
        flex: 1;
        margin: 0 6px;

        .show-level-slider-line {
          width: 100%;
          height: 8px;
          background-color: #cccccc;
          border-radius: 4px;

          .show-level-slider-line-inner {
            width: 0%;
            transition: all 1s;
            height: 100%;
            background-color: #2C78F8;
            border-radius: 4px;
          }
        }

        .show-level-slider-tips {
          position: absolute;
          transition: all 1s;
          transform: translateX(-50%);
          border-radius: 4px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
          left: 0%;
          top: -30px;
          min-width: 40px;
          height: 20px;
          background-color: #2C78F8;
          color: #FFFFFF;
          font-size: 12px;
          padding: 4px 12px;
          text-align: center;

          &::after {
            //  倒三角形
            content: '';
            position: absolute;
            left: 50%;
            top: 100%;
            margin-left: -4px;
            border-width: 4px;
            border-style: solid;
            border-color: #2C78F8 transparent transparent transparent;
          }
        }
      }

      .show-level-slider-text {
      }
    }
  }

  .main {
    height: 100%;
    padding: 20px;
    background-color: #fff;
    text-align: center;

    .prize {
      width: 224px;
      text-align: left;
      margin-left: 60px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .main-l {
      display: grid;
      grid-template-columns: repeat(3, 313px);
      column-gap: 2%;
      row-gap: 3%;
      justify-content: center;
      margin-bottom: 30px;

      .main-b {
        box-sizing: border-box;
        color: #666666;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;

        p {
          font-size: 14px;
          margin-bottom: 10px;
        }

        .title {
          width: 100%;
          font-weight: bold;
          font-size: 18px;
          margin: 25px 0 15px;
          text-align: center;
        }
      }
    }
  }

  .six-digit-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-top: 30px;

    .input {
      display: flex;
      width: 35px;
      margin-left: 10px;
      height: 44px;
      font-size: 18px;
      color: #333333;
      background-color: #f2f2f2;
      text-align: center;
      outline: none; // 去除选中状态边框
      border: solid 1px #d2d2d2;
      border-top: 0px;
      border-left: 0px;
      border-right: 0px;
    }
  }

  .wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}

.seller-level-content {
  display: flex;
  justify-content: flex-start;

  .right {
    padding: 0 0 0 0px;
    box-sizing: border-box;

    .title {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 133.69%;
      color: #333333;

      > b {
        color: #2C78F8;
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 133.69%;
      }
    }

    > div {
      text-align: left;
      margin-bottom: 12px;

      > div {
        margin-bottom: 12px;
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;

        color: #2C78F8;
      }

      > span {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 19px;

        color: #333333;

        b {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 600;
          font-size: 14px;
          line-height: 16px;

          color: #333333;
        }

        &:nth-child(1) {
          font-size: 18px;
          font-weight: bold;
          margin-right: 20px;

        }
      }
    }
  }
}
</style>
