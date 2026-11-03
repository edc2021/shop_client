<template>
    <div class="service-box">
        <van-nav-bar safe-area-inset-top :title="$t('消息列表')" left-arrow @click-left="onClickLeft" fixed ref="header">
        </van-nav-bar>
        <div style="width: 100%;" class="h46"></div>

        <div class="notify" v-if="itemName == 'EShop'">
            <div class="img1">
                <img src="@/assets/image/lingdang.png" alt="">
            </div>
            <div class="content" @click="handleJump2('/message/notify')">
                <span>{{ $t('系统消息') }}</span>
                <span class="nowrap" v-if="notifyInfo.title == 'Customer complaint success notification'">
                    {{
                        $t('您的投诉的{storeName}，投诉原因：{complaintReason}，经系统审核，情况属实，并扣除店铺信誉积分{creditScore}，感谢您反馈，给您带来的不便，还请谅解！',
                            {
                                storeName: notifyInfo.storeName,
                                complaintReason: $t(notifyInfo.complaintReason),
                                creditScore: notifyInfo.creditScore
                            }) }}
                </span>
                <span class="nowrap" v-if="notifyInfo.title == 'Customer complaint rejection notification'">
                    {{ $t('您的投诉的{storeName}，投诉原因：{complaintReason}，经系统审核被驳回，驳回理由：{rejectionReason}', {
                        storeName: notifyInfo.storeName,
                        complaintReason: $t(notifyInfo.complaintReason),
                        rejectionReason: notifyInfo.creditScore
                    }) }}
                </span>
                <span v-if="!notifyInfo?.title">--</span>
            </div>
            <div class="time">
                {{ !notifyInfo?.title ? '' : shourtTimeString(notifyInfo.reserveSendTime) }}
                <span class="unreadmsg" v-if="unreadCount != 0">
                    {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
                <span class="unreadmsg" style="opacity: 0;" v-else></span>
            </div>
        </div>
        <div class="message" v-for="item of messageList" :key="item.uid" @click="handleJump(item)">
            <div class="img">
                <img :src="item.avatar" alt="">
            </div>
            <div class="content">
                <span style="font-weight: 400;">{{ item.username }}</span>
                <span class="nowrap">{{ item.content.at(0) == "{" ? $t("图片信息") : item.content }}</span>
                <!-- 卡片信息 -->
            </div>
            <div class="time">
                {{ shourtTimeString(item.updatetime) }}
                <span class="unreadmsg" v-if="item.unreadmsg != 0">
                    {{ item.unreadmsg > 9 ? '9+' : item.unreadmsg }}
                </span>
                <span class="unreadmsg" style="opacity: 0;" v-else></span>
            </div>
        </div>
    </div>
</template>

<script>
import { apiMessageList, apiSystemMessage, apiUnreadSystemMessage } from '@/API/common'
import { shourtTimeString } from '@/utils/utis'
export default {
    name: "CustomerService",
    data() {
        return {
            itemName: process.env.VUE_APP_ITEM_NAME,
            messageList: [],
            shourtTimeString,
            notifyInfo: {},
            timer: null,
            unreadCount: 0
        };
    },
    mounted() {
        if (this.itemName == 'EShop') {
            this.requestSystemMessage()
            this.requestUnreadSystemMessage()
        }
        this.requestMessageList()
        this.timer = setInterval(() => {
            this.requestMessageList()
        }, 5000)
    },
    methods: {
        onClickLeft() {
            // 返回
            this.$router.push('/');
        },
        handleJump(item) {
            localStorage.setItem("storeName", item.username)
            localStorage.setItem("sellerId", item.partyid)
            sessionStorage.setItem("shopName", item.username)
            sessionStorage.setItem("sellerId", item.partyid)
            setTimeout(() => {
                window.openSiteCustomerService()
            }, 200)
        },
        handleJump2(path) {
            if (!this.notifyInfo?.title) return this.$toast(this.$t('暂无系统消息'))
            this.$router.push(path)
        },
        requestMessageList() {
            apiMessageList().then(res => {
                this.messageList = res
            })
        },
        // pageSize=10&pageNum=1&totalElements=-1&type=3&status=0&module=1&token=4b0179022cf04ad99322b54b34c71ec8&tz=Asia%2FShanghai&lang=cn
        requestSystemMessage() {
            apiSystemMessage({
                module: 0,
                type: 3,
                status: 0,
                pageSize: 1,
                pageNum: 1,
                totalElements: -1,
            }).then(res => {
                if (res.elements.length == 0) {
                    this.notifyInfo = {}
                    return
                }
                res.elements.forEach((item) => {
                    if (item.title == 'Customer complaint success notification') {
                        const regex = /The (.*) that you complained, the reason for the complaint: (.*), after review by the system, the situation is true, and the store reputation points (\d+) will be deducted./;
                        const matches = item.content.match(regex);
                        const storeName = matches[1];
                        let complaintReason = matches[2];
                        const creditScore = matches[3];
                        if (complaintReason == 'No delivery for a long time') {
                            complaintReason = '长时间不发货'
                        } else if (complaintReason == 'seller’s poor service attitude') {
                            complaintReason = '卖家服务态度恶劣'
                        } else if (complaintReason == 'seller’s transaction fraud') {
                            complaintReason = '卖家交易欺诈'
                        } else if (complaintReason == 'seller’s failure to fulfill promises') {
                            complaintReason = '卖家承诺不履行'
                        } else if (complaintReason == 'other') {
                            complaintReason = '其他'
                        }
                        item.complaintReason = complaintReason;
                        item.creditScore = creditScore;
                        item.storeName = storeName;
                    } else if (item.title == 'Customer complaint rejection notification') {
                        const regex = /The (.*) that you complained, the reason for the complaint: (.*), was rejected after review by the system, the reason for rejection: (.*)/
                        const matches = item.content.match(regex);
                        const storeName = matches[1];
                        let complaintReason = matches[2];
                        const creditScore = matches[3];
                        if (complaintReason == 'No delivery for a long time') {
                            complaintReason = '长时间不发货'
                        } else if (complaintReason == 'seller’s poor service attitude') {
                            complaintReason = '卖家服务态度恶劣'
                        } else if (complaintReason == 'seller’s transaction fraud') {
                            complaintReason = '卖家交易欺诈'
                        } else if (complaintReason == 'seller’s failure to fulfill promises') {
                            complaintReason = '卖家承诺不履行'
                        } else if (complaintReason == 'other') {
                            complaintReason = '其他'
                        }
                        item.complaintReason = complaintReason;
                        item.creditScore = creditScore;
                        item.storeName = storeName;
                    }
                })
                this.notifyInfo = res.elements[0]
                console.log(`this.notifyInfo ::->`, this.notifyInfo);
            })
        },
        // 查询未读系统通知
        requestUnreadSystemMessage() {
            apiUnreadSystemMessage({
                type: 3,
                module: '0',
            }).then(res => {
                this.unreadCount = res.count
            })
        }
    },
    unMounted() {
        clearInterval(this.timer)
    }
};
</script>
<style lang="scss" scoped>
.message,
.notify {
    width: 100%;
    height: 77px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    border-bottom: 1px solid #F4F6F9;

    .img1 {
        width: 40px;
        height: 40px;
        background: var(--main-color);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }
    }

    .img {
        width: 40px;
        height: 40px;
        background: #ccc;
        border-radius: 50%;
        flex: 0 0 40px;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }

    .content {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 240px;
        flex: 0 0 240px;

        span {
            &:nth-child(1) {
                font-weight: 600;
                font-size: 14px;
            }

            &:nth-child(2) {
                margin-top: 3px;
                font-size: 12px;
                color: #999;
            }
        }
    }

    .time {
        margin-left: 10px;
        flex: 0 0 60px;
        font-size: 10px;
        color: #777;
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;
        align-items: center;
        .unreadmsg {
            width: 20px;
            height: 20px;
            padding: 2px;
            background: #E64E41;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 10px;
            transform: scale(.8);
        }
    }
}
</style>
