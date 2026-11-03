<template>
    <div class="mall">
        <van-nav-bar safe-area-inset-top fixed :title="$t('购物车')" :class="isChristmas && 'christmas-nav-bar'"  />
        <div style="width: 100%; height: 46px"></div>
        <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="mall-refresh" :pulling-text="$t('下拉即可刷新')"
            :loosing-text="$t('释放即可刷新')" :loading-text="$t('加载中')"> -->
        <template v-if="list.length > 0">
            <div v-for="(item, index) in list" :key="item.key" class="mall-detail">

                <van-checkbox class="mall-title" v-model="item.checkedAll"
                    @click="handleCheckItemAll(item.checkedAll, index)">{{ item.sort }}</van-checkbox>
                <div class="mall-item">
                    <van-checkbox-group v-model="item.checkedValue" @change="mathMoney">
                        <template v-for="(i, n) in item.child">
                            <van-checkbox :key="n" :name="i.tempId" class="mall-item-checkbox"
                                :class="i.isShelf == 0 && 'shelves_item'" v-if="n < item.moreNum" v-model="i.selected"
                                @click="handlecheckItemClick(item, index, n)">
                                <div class="shelves_text" v-if="i.isShelf == 0">
                                    {{ $t('已下架') }}
                                </div>
                                <div class="mall-item-child" @touchstart="handlerTouchstart(index, n, i)"
                                    @touchmove="handleClearInterval" @touchend="handleClearInterval">
                                    <div class="mall-item-child-img">
                                        <img :src="i.coverImg || i.img" class="img" />
                                    </div>
                                    <div style="width: 75%; margin-left: 6px">
                                        <p class="describe">
                                            {{
                                                i.describe?.length > 43
                                                ? i.describe.slice(0, 43) + "..."
                                                : i.describe
                                            }}
                                        </p>
                                        <p v-if="i.attributes" class="sku_box">
                                            <span class="attribute" v-for="(j, p) in i.attributes" :key="p">
                                                {{
                                                    j.attrName
                                                }}:{{ j.attrValue }}</span>
                                        </p>
                                        <div class="price">
                                            <span> $ {{ priceFormat(i.price) }} </span>
                                            <div class="stepper" @click.stop="mathMoney">
                                                <van-stepper v-model="i.count"
                                                    :disabled="item.checkedValue.length == 0" @change="mathMoney"
                                                    :max="maxBuyNum" integer @plus="handleStepper('add', i)"
                                                    @minus="handleStepper('minus', i)" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </van-checkbox>
                        </template>
                        <div class="show-more" v-show="item.child.length > 1 && item.moreNum < item.child.length
                            " @click="item.moreNum += 2">
                            <p>{{ $t("查看更多") }}</p>
                            <img src="../../assets/image/index/down-icon.png" />
                        </div>
                    </van-checkbox-group>
                </div>
            </div>
            <div class="mall-bottom">
                <van-checkbox class="checkbox_cn" v-model="checkedAllTotol" v-if="!isNewLine" @click="handleCheckAll">
                    {{ $t("全选") }}
                </van-checkbox>
                <div class="mid">
                    <van-checkbox class="checkbox" v-model="checkedAllTotol" v-if="isNewLine" @click="handleCheckAll">
                        {{ $t("全选") }}
                    </van-checkbox>
                    <span>{{ $t("总计") }}
                        <span class="price">${{ priceFormat(total.money) }}</span></span>
                    <span>{{ $t("选择") }} <span class="piece">{{ total.piece }}</span>
                        {{ $t("个") }}</span>
                </div>
                <van-button class="pay-btn" color="rgba(233, 157, 56, 1)" style="margin-right: 10px;" @click="toBuy">
                    {{ $t("立即购买") }}
                </van-button>
            </div>
        </template>
        <div class="mall-empty" v-else>
            <img src="../../assets/image/index/gouwuche1.png" class="img" />
            <p class="text">{{ $t("购物车空空") }}</p>
            <router-link to="/commodity">
                <van-button class="button" color="rgba(233, 157, 56, 1)">{{
                    $t("立即购物")
                }}</van-button>
            </router-link>
        </div>
        <!-- </van-pull-refresh> -->
        <div style="width: 100%; height: 118px"></div>
        <div class="snowflake" v-if="isChristmas" v-for="item of 50" :key="item"></div>
    </div>
</template>
<script>
import {
    // NavBar,
    // Tab,
    // Tabs,
    PullRefresh,
    List,
    Checkbox,
    CheckboxGroup,
    Stepper,
    Dialog,
    Toast,
} from "vant";
import { apiCartList, apiUpdateCart } from '@/API/commodity'
import {
    // goods_list_action_post,
    goods_points_action_post,
    // project_listProject_action_post,
} from "@/API/user";
import { ref } from "vue";
import { priceFormat, isLogin, getStorage } from '@/utils/utis'
export default {
    setup() {
        const checked = ref(["a", "b"]);
        const checkedAll = ref(false);
        const checkedAllTotol = ref(true);
        const checkboxGroup = ref(null);
        const checkAll = () => {
            checkboxGroup.value.toggleAll(true);
        };
        return {
            checked,
            checkedAll,
            checkAll,
            checkedAllTotol,
            checkboxGroup,
        };
    },
    data() {
        return {
            priceFormat,
            refreshing: false,
            loop: 0,
            list: [],
            total: {}, //金额计算数据
            lang: getStorage('lang'),
            isNewLine: ['it', 'de', 'ms', 'pt', 'es', 'ru', 'el', 'tr', 'fr'].includes(getStorage('lang')),
            maxBuyNum: localStorage.getItem('maxBuyNum') || 500,
            pageNum: 1,
            isChristmas: process.env?.VUE_APP_IS_CHRISTMAS,
        };
    },
    components: {
        [List.name]: List,
        [PullRefresh.name]: PullRefresh,
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]: CheckboxGroup,
        [Stepper.name]: Stepper,
        [Dialog.Component.name]: Dialog.Component,
    },
    created() {
        //获取购物车列表
        isLogin() && this.getCartlist();
        //计算总金额
        this.mathMoney();
    },
    methods: {
        handlerTouchstart(index, n, { id, skuId, count }) {

            let productList = this.$ls.get("productList") || [];
            this.loop = setTimeout(() => {
                this.loop = 0;
                // 执行长按要执行的内容
                Dialog.confirm({
                    title: this.$t("提示"),
                    message: this.$t("确认移除商品吗?"),
                    confirmButtonText: this.$t("确认"),
                    cancelButtonText: this.$t("取消"),
                }).then(async () => {
                    this.$toast.loading()
                    await apiUpdateCart({
                        skuId: skuId,
                        sellerGoodsId: id,
                        buyNum: count,
                        isMove: 1
                    })
                    this.$toast.clear()
                    // if (this.list[index].child.length == 1) {
                    //     this.list.splice(index, 1);
                    // } else {
                    //     this.list[index].child.splice(n, 1);
                    // }
                    // productList.forEach((item, index) => {
                    //     if (item.id == id) {
                    //         productList.splice(index, 1);
                    //     }
                    // });
                    // if (this.list.length == 0) {
                    //     this.$store.state.qiangdan.count = 0;
                    //     localStorage.setItem('CART_NUM', 0)
                    // }
                    this.$store.state.qiangdan.count = productList.length;
                    this.$ls.set("productList", productList);
                    this.list = []
                    this.pageNum = 1
                    this.getCartlist();
                    // location.reload()

                });
            }, 500); // 定时的时间
            // return false
        },
        handleClearInterval() {
            // 清除定时器
            clearTimeout(this.loop);
            this.loop = 0;
        },

        async handleStepper(val, item) {
            let n = this.total.piece;
            val == "add" ? (n += 1) : (n -= 1);
            this.$store.state.qiangdan.count = n;
            await apiUpdateCart({
                skuId: item.skuId,
                sellerGoodsId: item.id,
                buyNum: item.count + (val == "add" ? 1 : -1),
            })
        },
        mathMoney() {
            // apiUpdateCart
            let productList = this.$ls.get("productList") || [];
            this.total = {
                money: 0,
                piece: 0,
            };
            this.list.forEach((item) => {
                this.total.piece = this.total.piece += item.checkedValue.length
                item.child.length > 0 &&
                    item.child.forEach((child) => {
                        productList.forEach(x => {
                            if (x.id == child.id) x.count = child.count
                        })
                        //num<item.moreNum&&
                        if (item.checkedValue.includes(child.tempId)) {
                            this.total.money += child.price.toFixed(2) * child.count;
                            // this.total.piece += child.count;
                        }
                    });
            });
            this.total.money = this.total.money.toFixed(2);
            this.$ls.set("productList", productList)
            // this.list.length == this.total.piece && this.handleCheckAll()
        },
        async getCartlist() {
            // console.log(`this.$ls.get('cartList') ::->`, this.$ls.get('cartList'));
            const { pageList, pageInfo } = await apiCartList({
                pageNum: this.pageNum,
                pageSize: 20
            })
            localStorage.setItem('CART_NUM', pageInfo.totalElements)
            this.$store.state.qiangdan.count = pageInfo.totalElements;
            //初始list为空
            // this.list = [];
            let productList = pageList || [];
            if (productList && productList.length > 0) {
                productList.forEach((item) => {
                    if (this.list.length > 0) {
                        this.list.forEach((c) => {
                            let attributes = [];
                            if (item.attributes) {
                                attributes = item.attributes
                            }
                            if (c.sort == item.sellerName) {
                                let attributes = [];
                                if (item.attributes) {
                                    attributes = item.attributes
                                }
                                //同商铺添加子集合里
                                let childObj = {
                                    coverImg: item.goodsIcon,
                                    skuId: item.skuId,
                                    img: item.imgUrl1 || this.$defaultGoodsImage,
                                    price: item.discountPrice
                                        ? item.discountPrice
                                        : item.sellingPrice,
                                    describe: item.goodsName,
                                    count: item.goodsNum,
                                    id: `${item.goodsId}`,
                                    tempId: item.tempId,
                                    attributes,
                                    freightAmount: item.freightAmount || 0,
                                    goodsTax: item.goodsTax || 0,
                                    selected: true,
                                    isShelf: item.isShelf,
                                };
                                c.child.unshift(childObj);
                            } else {
                                // if (item.canSelectAttributes) {
                                //   attributes = item.canSelectAttributes.skus.filter(
                                //     (i) => i.skuId == item.skuId
                                //   )[0];
                                // }
                                // console.log("attributes ->", attributes);

                                let obj = {
                                    // skuId: item.skuId,
                                    key: item.sellerId,
                                    sort: item.sellerName,
                                    checkedAll: true,
                                    checkedValue: [],
                                    moreNum: 2,
                                    child: [],

                                };
                                let childObj = {
                                    coverImg: item.goodsIcon,
                                    skuId: item.skuId,
                                    img: item.imgUrl1 || this.$defaultGoodsImage,
                                    price: item.discountPrice
                                        ? item.discountPrice
                                        : item.sellingPrice,
                                    describe: item.goodsName,
                                    count: item.goodsNum,
                                    id: `${item.goodsId}`,
                                    tempId: item.tempId,
                                    freightAmount: item.freightAmount || 0,
                                    goodsTax: item.goodsTax || 0,
                                    selected: true,
                                    isShelf: item.isShelf,
                                    attributes,
                                };
                                obj.child.unshift(childObj);
                                this.list.push(obj);
                            }
                        });
                    } else {
                        let attributes = [];
                        if (item.attributes) {
                            attributes = item.attributes
                        }
                        let obj = {
                            // skuId: item.skuId,
                            key: item.sellerId,
                            sort: item.sellerName,
                            checkedAll: true,
                            checkedValue: [],
                            moreNum: 2,
                            child: [],

                        };
                        let childObj = {
                            coverImg: item.goodsIcon,
                            skuId: item.skuId,
                            img: item.imgUrl1 || this.$defaultGoodsImage,
                            price: item.discountPrice
                                ? item.discountPrice
                                : item.sellingPrice,
                            describe: item.goodsName,
                            count: item.goodsNum,
                            id: item.goodsId,
                            freightAmount: item.freightAmount || 0,
                            goodsTax: item.goodsTax || 0,
                            selected: true,
                            isShelf: item.isShelf,
                            attributes,
                        };
                        obj.child.unshift(childObj);
                        this.list.unshift(obj);
                    }
                });
                for (var i = 0; i < this.list.length - 1; i++) {
                    for (var j = i + 1; j < this.list.length; j++) {
                        if (this.list[i].sort == this.list[j].sort) {
                            this.list.splice(j, 1);
                            j--;
                        }
                    }
                }

            }
            if (pageList.length == 20) {
                this.pageNum++
                this.getCartlist()
            } else {
                this.$ls.set("cartList", this.list);
            }
            //全选
            setTimeout(() => {
                this.handleCheckAll();
            }, 100);
        },
        //跳转确认页,购买
        toBuy() {
            const tempList = this.list
                .map(item => ({
                    ...item,
                    child: item.child.filter(sub => sub.isShelf !== 0)
                }))
                .filter(item => item.child.length > 0);

            const notSelected = tempList.find((item) =>
                item.child.find((sub) => sub.selected)
            );
            if (!notSelected) return Toast(this.$t("未选中任何商品"));
            const tempArr = [];
            tempList.forEach((item) => {
                if (item.checkedAll) {
                    item.child = item.child.filter((sub) => sub.selected);
                    tempArr.push(item);
                }
            });
            // let productList = this.$ls.get("productList");
            // productList.map(item => {
            //     console.log('item.id ::>> ', item.id)
            // })
            // 清除productList
            this.$ls.set("cartList", tempArr);
            this.list = [];
            this.$router.push("/orderComnfirmation?isCart=1");
            // this.$router.push("/commodity");
        },
        // 单选
        handlecheckItemClick(item, index, n) {
            this.list[index].child[n].selected = !this.list[index].child[n].selected;
            let count = 0;
            let num = 0;
            let len = this.list[index].child.length;
            this.list[index].child.forEach((item) => {
                if (item.selected) count += 1;
                else num += 1;
                if (count != 0) this.list[index].checkedAll = true;
                if (num == len) this.list[index].checkedAll = false;
            });
        },
        //类全选
        handleCheckItemAll(value, index) {
            this.list[index].checkedValue = [];
            this.$nextTick(() => {
                this.list[index].child.forEach((item, num) => {
                    item.selected = value;
                    value && this.list[index].checkedValue.push(item.tempId);
                });
            });
            // if (value) {
            // if (num < this.list[index].moreNum) {
            //     this.list[index].checkedValue.push(item.id);
            // }
            // }
        },
        //全选
        handleCheckAll() {
            this.list.forEach((i) => {
                i.checkedValue = [];
                i.checkedAll = this.checkedAllTotol;
                i.child?.forEach((j) => {
                    j.selected = this.checkedAllTotol;
                    this.checkedAllTotol && i.checkedValue.push(j.tempId);
                });
            });
        },
        onRefresh() {
            // 清空列表数据
            this.finished = false;
            this.list = [];
            this.loading = true;
            this.onLoad();
        },
        onLoad() {
            if (this.refreshing) {
                this.list = [];
                this.refreshing = false;
            }
            this.getCartlist();
        },
        // tuanduimingxi_post() {
        //   this.page_no++
        //   var data = {
        //     'pageNum': this.page_no,
        //     'pageSize': 10,
        //   }
        //   goods_list_action_post(data).then(res => {

        //   })
        // },
        qiehuan() {
            this.list = [];
            this.loading = false;
            this.finished = false;
            this.refreshing = false;
            this.page_no = 0;
            // this.onLoad()
        },
        goods_points_action() {
            this.show = true;
            goods_points_action_post({}).then((res) => {


                this.show = false;
                this.goods_points_action_data = res.points;
            });
        },
        touzi(e) {

            this.$router.push("/InvestmentDetails?goodsId=" + e);
        },
        onClickLeft() {
            this.$router.push("/me");
        },
    },
    watch: {
        list: {
            handler(val) {
                this.checkedAllTotol = val.every((item) =>
                    item.child.every((sub) => sub.selected)
                );
            },
            deep: true,
        },
    },
};
</script>
<style lang="scss" scoped>
.christmas-nav-bar {
    background: #152840 url(@/assets/christmas/bbg.png) no-repeat center / 100% 100%;
    /deep/ .van-nav-bar__title {
        color: #fff !important;
    }
}
.attribute {
    font-size: 12px;
    color: #333;
    margin-right: 10px;
}

.mall {
    position: relative;
    background: #f5f5f7;
    min-height: 100%;
    font-size: 14px;
    box-sizing: border-box;

    .mall-refresh {
        min-height: calc(100vh - 46px - 60px);
        // overflow-y: scroll;
    }

    .mall-detail {
        // height:calc(100vh - 46px - 60px);
        margin-bottom: 20px;
        padding: 0 15px;
        position: relative;

        .mall-title {
            font-size: 14px;
            margin: 14px 0;
        }

        .mall-item {
            width: 345px;
            background: #fff;

            .mall-item-child {
                width: 100%;
                display: flex;
                justify-content: space-around;
                align-items: center;

                .mall-item-child-img {
                    width: 62px;
                    height: 62px;
                    display: table-cell;

                    img {
                        max-width: 100%;
                        max-height: 100%;
                        display: block;
                        margin: auto;
                    }
                }

                .price {
                    color: var(--main-color);
                    font-size: 16px;
                    font-weight: 500;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 10px;
                }

                .describe {
                    font-size: 14px;
                    color: #000;

                    display: -webkit-box;
                    width: 195px;
                    -webkit-box-orient: vertical;
                    -moz-box-orient: vertical;
                    box-orient: vertical;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    overflow: hidden;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .stepper {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    margin-right: 10px;
                }
            }
        }

        .mall-item-checkbox {
            border-bottom: 1px solid #eeeeee;
            // padding: 20px 0;
            width: 345px;
            // height: 107px;
            padding: 10px 0;

            .sku_box {
                display: flex;
                flex-wrap: wrap;
            }
        }

        .mall-item-checkbox:nth-last-child(2) {
            border: none;
        }

        .show-more {
            color: #000;
            font-size: 12px;
            text-align: center;

            img {
                width: 16px;
                height: 16px;
            }
        }
    }

    .mall-bottom {
        width: 100%;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        padding: 4px 7px;
        position: fixed;
        bottom: 56px;

        .mid {
            display: flex;
            flex-direction: column;

        }

        .checkbox_cn {
            font-size: 14px;
            margin: 14px 0;

            :deep(.van-checkbox__label) {
                transform: translateX(-10px);
            }
        }

        .checkbox {
            font-size: 14px;

            // margin: 14px 0;
            transform: translateX(-10px);

            :deep(.van-checkbox__label) {
                transform: translateX(-10px);
            }
        }

        .price {
            color: var(--main-color);
            font-size: 16px;
            font-weight: 600;
        }

        .piece {
            color: var(--main-color);
        }
    }

    .mall-empty {
        height: calc(100vh - 30vh);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .img {
            width: 100px;
        }

        .text {
            font-size: 16px;
            margin: 20px 0;
        }

        .button {
            height: 40px;
            margin: 0 !important;
            background: var(--main-color) !important;
        }
    }
}

/deep/ .van-checkbox__icon--checked .van-icon {
    background-color: var(--main-color) !important;
    border-color: var(--main-color) !important;
}

/deep/ .van-checkbox__icon {
    font-size: 16px !important;
    padding: 0 11px;
}

/deep/ .van-checkbox__label {
    flex-grow: 1;
}

/deep/ .van-button {
    margin-right: 14px;
}

/deep/ .van-stepper {
    margin-right: 13px;
}


.shelves_item {
    // pointer-events: none;
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
    position: relative;
}

// .mall-item-checkbox,
// .mall-title {

// }



.shelves_text {
    padding: 10px 20px;
    background: rgba(0, 0, 0, .5);
    position: absolute;
    top: 30px;
    left: 50%;
    z-index: 99;
    transform: translate(-50%);
    border-radius: 10px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;

    .describe,
    .attribute {
        color: #A5A5A5 !important;
    }

    :deep(input) {
        color: #A5A5A5 !important;
    }

    :deep(.van-stepper__plus) {
        color: #A5A5A5 !important;
    }
}
.pay-btn {
    background: var(--main-color) !important;
}
</style>