<script>
import ImageA from "@/assets/registration-bonus/a.png";
import ImageB from "@/assets/registration-bonus/b.png";
import {getUserBalance} from "@/api/user";
import FormatNumberShow from "@/components/FormatNumberShow/index.vue";

export default {
  name: "RegistrationBonus",
  components: {FormatNumberShow},
  data() {
    return {
      ImageA,
      ImageB,
      isShowMask: false,
      showImageA: false,
      showImageB: false,
      bonusData: {
        "sellerSignBonusRatio": 0,
        "money": 0,
        "signBonus": 0,
        "rechargeAmount": 0,
        "rebate": 0,
        "frozenMoney": 0
      },
      moneyA: 0,
      moneyB: 0,
    };
  },
  mounted() {
    //路由为 /dashboard 时才显示
    if (this.$route.path === '/dashboard')
      this.getUserBalance()
  },
  methods: {
    getUserBalance() {
      getUserBalance().then(res => {
        console.log(res.data)
        this.bonusData = res.data
        if (this.bonusData?.signBonus > 0) {
          this.isShowMask = true
          this.moneyA = (this.bonusData.signBonus * this.bonusData.sellerSignBonusRatio).toFloor(2)
          this.moneyB = (this.bonusData.signBonus * this.bonusData.sellerSignBonusRatio - this.bonusData.rechargeAmount).toFloor(2)
          if(this.moneyB < 0)
            this.moneyB = (0).toFloor(2)
        }
      })
    },
    handleImageLoadA() {
      this.showImageA = true;
    },
    handleImageLoadB() {
      this.showImageB = true;
    },
    intoPay() {
      this.isShowMask = false
      //跳转到充值页面
      this.$router.push({
        path: '/wallet/Recharge',
      })
    }
  },
};
</script>

<template>
  <div class="registration-bonus" v-if="isShowMask">
    <!--  全屏遮罩  -->
    <div class="mask"></div>
    <!--  弹窗内容  -->
    <div class="content">
      <div class="title">
        <div class="small-title">
          <span class="small-title-text">{{ $t("Hello ～ first meeting") }}</span>
        </div>
        <div class="big-title">{{ $t("Exclusive rewards for newcomers") }}</div>
      </div>
      <div class="content-body">
        <div class="content-body-main">
          <div class="content-body-main-line">
            <div class="content-body-item">
              <span class="dollar">$</span>
              <span>
                <FormatNumberShow :data="bonusData.signBonus" :decimalPlaces="2"/>
              </span>
            </div>
            <div class="content-body-text"
                 v-html='$t("To activate the gift, you need to recharge <span>${_$1}</span>,and there is still <span>${_$2}</span> left to activate.",
                 {_$1:moneyA,_$2:moneyB})'>
            </div>
          </div>
        </div>
        <el-image v-show="showImageA" :src="ImageA" class="image-a" fit="cover" @load="handleImageLoadA"></el-image>
        <el-image v-show="showImageB" :src="ImageB" class="image-b" fit="cover" @load="handleImageLoadB"></el-image>
      </div>
      <el-button type="primary" style="width: 100%;height: 46px" @click="intoPay">
        {{ $t("Activate now") }}
      </el-button>
      <div class="close" @click="isShowMask = false">
        <i class="el-icon-close"></i>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.registration-bonus {
  .close {
    position: absolute;
    bottom: -64px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 36px;
    display: flex;
    border-radius: 50%;
    border: solid 1px #ffffff;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    z-index: 9999999999;
    color: #FFFFFF;
    font-size: 24px;
    cursor: pointer;

    &:hover {
      background-color: #ffffff;
      color: #1552F0;
    }
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
  }

  .content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100000;
    min-width: 400px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .5);
    padding: 24px;
    box-sizing: border-box;

    .title {
      padding: 0 20px 20px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .small-title {
        display: flex;
        align-items: center;
        justify-content: center;

        .small-title-text {
          font-size: 14px;
          color: var(--999, #999);
          text-align: center;
          font-family: Roboto;
          font-size: 17.287px;
          font-style: normal;
          font-weight: 400;
          margin: auto 12px;
        }


        &::after {
          content: "";
          display: block;
          height: 1px;
          background: linear-gradient(90deg, #DDD 0%, rgba(221, 221, 221, 0.00) 92.16%);
          width: 50px;
        }

        &::before {
          content: "";
          display: block;
          background: linear-gradient(270deg, #DDD 0%, rgba(221, 221, 221, 0.00) 92.16%);
          height: 1px;
          width: 50px;
        }
      }

      .big-title {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 24px auto auto auto;
        color: #333;
        font-family: Roboto;
        font-size: 28px;
        font-style: normal;
        font-weight: 600;
        max-width: 260px;
        line-height: 28px;
      }
    }

    .content-body {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 6px;
      background-color: #1552F0;
      position: relative;
      padding: 8px 10px;
      box-sizing: border-box;
      margin-bottom: 24px;

      .image-a {
        position: absolute;
        top: -38px;
        right: -32px;
        width: 100px;
        height: 100px;
        //  鼠标放上去 缓慢放大
        transition: all .3s ease-in-out;

        &:hover {
          transform: scale(1.2);
        }
      }

      .image-b {
        position: absolute;
        bottom: -12px;
        left: -12px;
        width: 64px;
        height: 64px;
        //  鼠标放上去 缓慢放大
        transition: all .3s ease-in-out;

        &:hover {
          transform: scale(1.2);
        }
      }

      .content-body-main {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 6px;
        background: linear-gradient(180deg, #FFF 0%, #CEDCFF 100%);
        box-shadow: 0px 2px 6px 0px rgba(30, 39, 63, 0.15);
        padding: 4px;
        box-sizing: border-box;
      }

      .content-body-main-line {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 6px;
        min-width: 360px;
        min-height: 120px;
        border: solid 1px #ECEFF4;
      }

      .content-body-item {
        color: #1552F0;
        text-align: right;
        font-family: Roboto;
        font-size: 36px;
        font-style: normal;
        font-weight: 600;
        margin-top: 12px;
        //  鼠标放上去 缓慢放大
        transition: all .3s ease-in-out;

        &:hover {
          transform: scale(1.2);
        }

        .dollar {
          color: #1552F0;
          font-family: Roboto;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: 14px;
          position: relative;
          top: -6px;
          margin-right: 6px;
        }
      }

      .content-body-text {
        color: #333;
        text-align: center;
        font-family: Roboto;
        font-size: 12px;
        line-height: 16px;
        font-style: normal;
        font-weight: 500;
        width: 300px;
        margin: 12px 0;
      }
    }
  }


}
</style>
