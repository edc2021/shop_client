<template>
  <div class="shop-cart">
    <div
      v-show="showShopCart"
      class="shop-cart-float flex-center"
      @click="openShopCart"
    >
      <div class="shop-cart-float-count">
        <i class="el-icon-shopping-cart-full"></i>
        <span>
          &nbsp;{{ totalCount }}&nbsp;{{
            this.$t("message.home.item" /**物品 */)
          }}
        </span>
      </div>
      <!--      <el-button size="mini">${{ totalAmount }}</el-button>-->
      <el-button size="mini">${{ totalCheckAmount }}</el-button>
    </div>
    <el-drawer
      :visible.sync="shopCartDrawer"
      direction="rtl"
      size="400px"
      custom-class="shop-cart-drawer"
    >
      <div class="flex-start shop-cart-drawer-title" slot="title">
        <i class="el-icon-shopping-cart-full"></i>
        <div>
          <h3>
            {{ totalCount }}&nbsp;{{ this.$t("message.home.item" /**物品 */) }}
          </h3>
          <p class="site-name">{{ this.$t("message.home.myCart") }}</p>
        </div>
      </div>
      <div class="shop-cart-drawer-list" v-if="shopCart.length">
        <div
          v-for="(item, index) in shopCart"
          :key="index"
          class="shop-cart-drawer-content flex-start"
        >
          <el-checkbox v-model="checkMap[item.tempId]" :disabled="!item.isShelf"></el-checkbox>
          <img :src="item.goodsIcon ? item.goodsIcon : item.goodsIcon" alt="" :style="!item.isShelf?'filter: grayscale(100%);':''"/>
          <span class="removed" v-if="!item.isShelf">
           {{ $t("message.home.已下架") }}
            </span>
          <!--  -->
          <div>
            <p class="tit-cart" :style="!item.isShelf?'color:#ccc':''">
              {{ item.goodsName }}
            </p>
            <p v-if="item.attributes" class="tit-cart" >
              <span v-for="i in item.attributes" :key="i.attrNameId" :style="!item.isShelf?'color:#ccc':''">
                {{ i.attrName }}:{{i.attrValue}}
              </span>
            </p>
            <el-input-number
              size="mini"
              :key="item.buyMin"
              :min="item.buyMin"
              :precision="0"
              :max="maxNum"
              :disabled="!item.isShelf"
              v-model="shopCardNumMap[item.tempId]"
              :class="item.isShelf?'':'number-disabled'"
              @change="((val)=>{handleChange(val,item)})"> </el-input-number>
          </div>
          <span class="price" v-if="item.price" :style="!item.isShelf?'color:#ccc':''">
            ${{ numberFormat(shopCardNumMap[item.tempId] * item.price) }}
          </span>
          <span class="price" v-else :style="!item.isShelf?'color:#ccc':''">
            ${{
              numberFormat(
                  (!item.isShelf ? 0 :item.discountPrice ?? item.sellingPrice)
              )
            }}
          </span>
          <i class="el-icon-delete" @click="del(item)" style="cursor: pointer;"></i>
        </div>
      </div>
      <div class="shop-cart-drawer-list no-cart" v-else>
        <img :src="noCart" alt="" />
        <div>{{this.$t('message.home.购物车还没有商品')}}</div>
        <div class="go-shopping" @click="goShopping">{{this.$t('message.home.去购物')}}</div>
      </div>
      <div class="shop-cart-drawer-buy flex-center">
        <el-button type="primary" @click="pay">
          {{ this.$t("message.home.checkout") }} ${{ totalCheckAmount }}
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { getShopCartLocal } from "@/util/shop";
import { numberFormat } from "@/util";
import { ES_VUEX } from "@/common";
import { cartList,updateCart } from "@/api/home"
import Bus from '@/util/bus';
export default {
  name: "EsShopCart",
  data() {
    return {
      num: 1,
      count: 0,
      total: 0,
      shopCartDrawer: false,
      testData: new Array(30).fill(""),
      showShopCartRouterPath: [
        "/index",
        "/classification",
        "/commodity",
        "/information",
        "/productDetails",
        "/store",
        "/discounted",
        "/userInfo/dashboard"
      ],
      showShopCart: false,
      checkMap: {},
      shopCardNumMap: {},
      allNumber: 0,
      noCart: require("@/assets/image/no-cart-item.jpg"),
      shopCart:[],
      maxNum: 0
    };
  },
  created() {
    this.$nextTick(() => {
      // this.init();
    });
    setTimeout(()=>{
      this.maxNum = Number(localStorage.getItem('maxBuy') || 500) 
    },1500)
    
  },
  mounted(){
    this.getShopCartList()
    Bus.$on('Add',(val)=>{
      this.getShopCartList()
    })
  },
  computed: {
    ...mapGetters("shopCart", ["shopCart"]),
    ...mapGetters(["isLogin"]),
    totalAmount() {
      return numberFormat(
        this.shopCart.reduce(
          (a, b) => a + (!b.isShelf ? 0 :b.price ?? b.discountPrice ?? b.sellingPrice),
          0
        )
      );
    },
    totalCount() {
      let amount = 0;
      amount = this.shopCart.length;
      return amount;
    },
    totalCheckAmount() {
      let amount = 0;
      const checkData = this.shopCart.filter(
        (item) => this.checkMap[item.tempId]
      );

      checkData.forEach((item) => {
        // console.log('item ->', item);
        amount = this.$big(amount).plus(
          this.$big(this.shopCardNumMap[item.tempId]).times(
            !item.isShelf ? 0 : item.sellingPrice
          ))
          // numberFormat(item.price ?? item.discountPrice ?? item.sellingPrice);
      });
      
      return numberFormat(amount);
    },
  },
  watch: {
    $route: {
      handler(newValue) {
        this.showShopCart =
          this.showShopCartRouterPath.indexOf(newValue.path) >= 0;
      },
      deep: true,
    },
    shopCart: {
      handler(newValue) {
        console.log("shopCart发生更新", newValue);
        let obj = {};
        let numObj = {};
        newValue.forEach((item) => {
          obj[item.tempId] = true;
          numObj[item.tempId] = item.goodsNum || 1;
        });

        this.checkMap = { ...obj, ...this.checkMap };
        this.shopCardNumMap = { ...numObj, ...this.shopCardNumMap };
        console.log('this.shopCardNumMap ->', this.shopCardNumMap);
      },
      deep: true,
      immediate: true,
    },
    checkMap() {
      console.log("checkMap");
    },
    shopCartDrawer(val) {
      function handler(e) {
        // e.preventDefault();
      }
      if (val) {
        document.body.style.overflow = "hidden";
        document.addEventListener("scroll", handler, false);
      } else {
        document.body.style.overflow = "";
        document.addEventListener("scroll", handler, true);
      }
    },
  },
  methods: {
    ...mapMutations("shopCart", ["updateShopCart", "updateCheckProductPay"]),
    numberFormat,
    async getShopCartList(){
      let param = {
        pageNum: 1,
        pageSize: 100
      }

      const res = await cartList(param)
      
      this.shopCart = res.data.pageList
    },
    openShopCart() {
      this.shopCartDrawer = true;
      setTimeout(() => {}, 500);
    },
    chlick(i) {
      console.log("i ->", i);
    },
    goShopping(){
      this.shopCartDrawer = false;
      this.$router.push('/index')
    },
    /**
     * 不清楚为什么更新那么缓慢，先采用临时方案处理问题
     */
    init() {
      setTimeout(() => {
        this.initShopCartData();
        this.initCheckProductPay();
      }, 1500);
    },
    initShopCartData() {
      const shopCart = getShopCartLocal().then(result =>{
        return result;
      });
      // console.log(' shopCart->', shopCart);
      if (shopCart && shopCart.length) {
        // console.log('shopCart.length ->', shopCart.length);
        this.updateShopCart(shopCart);
      }
    },
    initCheckProductPay() {
      const vuexData = localStorage.getItem(ES_VUEX);
      if (vuexData) {
        const vuexObj = JSON.parse(vuexData);
        const checkProductPay = vuexObj.shopCart.checkProductPay;
        if (checkProductPay && checkProductPay.length) {
          this.updateCheckProductPay(checkProductPay);
        }
      }
    },
    getCheckInfo() {
      let checkByStore = {};
      const checkData = this.shopCart.filter(
        (item) => this.checkMap[item.tempId] && item.isShelf
      );
      console.log('checkData111 ->', checkData);
      checkData.forEach((item) => {
        if (!checkByStore[item.sellerName]) {
          checkByStore[item.sellerName] = {
            title: item.sellerName,
            checkList: [],
            checkAll: true,
            isIndeterminate: false,
            list: [],
          };
        }
        checkByStore[item.sellerName].checkList.push(item.tempId);
        checkByStore[item.sellerName].list.push({
          ...item,
          ...{ checkTotal: this.shopCardNumMap[item.tempId] },
        });
      });
      return Object.values(checkByStore);
    },
    pay() {
      if (this.getCheckInfo().length === 0) {
        this.$message({
          message: this.$t(
            "message.home.unSelectedProduct" /**您还未选中商品 */
          ),
          type: "error",
        });
        return;
      }
      console.log('this.getCheckInfo() ->', this.getCheckInfo());
      if (this.totalCheckAmount) {
        this.shopCartDrawer = false;
        this.updateCheckProductPay(this.getCheckInfo());
        this.$router.push("/settlement?isCart=1");
      }
    },
    async handleChange(num,item){
      let param = {
          skuId: item.skuId,
          sellerGoodsId:item.goodsId,
          buyNum: num
      }
     await updateCart(param)
     this.getShopCartList()
    },
  async del(item) {
      // const data = JSON.parse(JSON.stringify(this.shopCart));
      // data.splice(index, 1);
      // this.updateShopCart(data);
      let param = {
          skuId: item.skuId,
          sellerGoodsId:item.goodsId,
          buyNum: item.goodsNum,
          isMove:1
      }
     await updateCart(param)
     this.getShopCartList()
      // const delItem = this.shopCart.splice(index, 1);
      // let shopCartData = getShopCartLocal();

      // console.log('delItem', delItem)
      // console.log('shopCartData', shopCartData)
      // if (shopCartData && shopCartData.length) {
      //   shopCartData = shopCartData.filter(
      //     (item) => item.tempId !== delItem.tempId
      //   );
      //   this.updateShopCart(shopCartData);
      //   this.$delete(this.checkMap, delItem.tempId);
      // }
    },
  },
};
</script>

<style lang="scss">
html[dir="rtl"]{
  .el-icon-shopping-cart-full{
    margin-right: 0;
    margin-left: 16px;
  }
  .shop-cart-drawer-content .price{
    padding-left: 0;
    padding-right: 15px;
  }
  .shop-cart {
  &-float {
    right: auto;
    left: 0;
    border-radius: 0px 40px 40px 0px;
    padding-left: 0;
    padding-right: 15px;
  }
  .el-drawer.rtl{
    right: auto;
    left: 0;
  }
  }
}
.shop-cart {
  &-float {
    width: 108px;
    height: 76px;
    background-color: var(--color-main);
    border-radius: 40px 0px 0px 40px;
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    flex-direction: column;
    padding-left: 15px;
    cursor: pointer;
    z-index: 999;

    &-count {
      font-size: 12px;
      color: var(--color-white);
      margin-bottom: 10px;

      .el-icon-shopping-cart-full {
        font-size: 16px;
      }
    }

    .el-button {
      overflow:hidden; //超出的文本隐藏
text-overflow:ellipsis; //溢出用省略号显示
white-space:nowrap; 
      width: 67px;
      height: 23px;
      color: var(--color-main);
      background-color: var(--color-white);
      border: 1px solid var(--color-white);
      padding: 0;
    }
  }
}

.shop-cart-drawer {
  position: relative;

  &-title {
    .el-icon-shopping-cart-full {
      font-size: 24px;
      color: var(--color-main);
      margin-right: 16px;
    }

    h3 {
      font-weight: 500;
      font-size: 14px;
      color: var(--color-title);
    }

    .site-name {
      font-size: 12px;
      font-weight: 400;
      color: var(--color-subtitle);
      margin-top: 4px;
    }
  }

  &-list {
    height: calc(100vh - 150px);
    overflow: auto;

    &.no-cart {
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
        width: 320px;
      }

      div {
        // width: 320px;
        text-align: center;
        font-size: 24px;
      }
      .go-shopping{
        border: 1px solid var(--color-main);
        border-radius: 4px;
        padding: 10px 20px;
        font-size: 14px;
        color: var(--color-main);
        font-weight: 500;
        margin-top: 20px;
        cursor: pointer;
      }
    }
  }

  &-content {
    padding: 0 12px;
    margin-bottom: 30px;
    position: relative;
    .removed{
      position: absolute;
      background-color: rgba(0,0,0,.4);
      border-radius: 4px;
      color: #fff;
      padding: 5px 10px;
      font-size: 12px;
      margin-left: 25px;
    }
    img {
      width: 60px;
      height: 60px;
      margin: 0 10px;
      object-fit: contain;
    }

    > div {
      width: 170px;
    }

    .tit-cart {
      flex: 1;
      max-width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 400;
      font-size: 12px;
      color: var(--color-black);
      margin-bottom: 10px;
    }

    .price {
      color: var(--color-price);
      font-size: 14px;
      font-weight: 400;
      flex: 1;
      padding-left: 15px;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }

    .el-icon-delete {
      font-size: 18px;
      color: var(--color-subtitle);
    }

    .el-input-number__decrease,
    .el-input-number__increase {
      background-color: var(--color-main) !important;
      color: var(--color-white);
      border: 1px solid var(--color-main) !important;
      border-radius: 4px !important;
      width: 20px !important;
      height: 20px !important;
      line-height: 20px;
    }
     .number-disabled .el-input-number__decrease,
     .number-disabled .el-input-number__increase{
      background-color: #E4E7ED !important;
      border: #E4E7ED !important;
      color: #ccc !important;
    }
    .el-input-number--mini {
      width: 80px;
    }

    .el-input__inner {
      border: 0 !important;
      padding: 0 20px !important;
      height: 20px !important;
      line-height: 20px !important;
      position: relative;
      top: -3px;
    }

    .el-input-number__decrease:hover,
    .el-input-number__increase:hover {
      color: var(--color-white);
    }
  }

  &-buy {
    width: 100%;
    position: absolute;
    bottom: 10px;
    left: 0;

    .el-button {
      width: 312px;
      height: 40px;
      font-weight: 700;
      font-size: 14px;
    }
  }

  .el-drawer__header {
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 14px;
    margin-bottom: 15px;
  }
}

</style>
