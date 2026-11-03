<template>
    <div class="service-box">
        <van-nav-bar safe-area-inset-top :title="$t('系统消息')" left-arrow @click-left="onClickLeft" fixed ref="header">
        </van-nav-bar>
        <div style="width: 100%;" class="h46"></div>

        <div class="box">
            <div class="notify" v-for="item of notifyList" :key="item.id" @click="readMessage(item)">
                <div class="content">
                    <span class="title">
                        <!-- {{ $t('投诉{status}通知', {
                            status: item.title == 'Customer complaint success notification' ? $t('成功') : $t('拒绝')
                        }) }} -->
                        <div class="tips" v-if="item.status == 1"></div>
                        {{ $t('店铺投诉通知') }}
                    </span>
                    <span class="mt-10">
                        <span v-if="item.title == 'Customer complaint success notification'">
                            {{
                                $t('您的投诉的{storeName}，投诉原因：{complaintReason}，经系统审核，情况属实，并扣除店铺信誉积分{creditScore}，感谢您反馈，给您带来的不便，还请谅解！',
                                    {
                                        storeName: item.storeName,
                                        complaintReason: $t(item.complaintReason),
                                        creditScore: item.creditScore
                                    }) }}
                        </span>
                        <span v-if="item.title == 'Customer complaint rejection notification'">
                            {{ $t('您的投诉的{storeName}，投诉原因：{complaintReason}，经系统审核被驳回，驳回理由：{rejectionReason}', {
                                storeName: item.storeName,
                                complaintReason: $t(item.complaintReason),
                                rejectionReason: item.creditScore
                            }) }}
                        </span>
                    </span>
                    <span class="time">{{ item.reserveSendTime }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { apiSystemMessage, apiReadSystemMessage } from '@/API/common'
import { shourtTimeString } from '@/utils/utis'
export default {
    name: "CustomerService",
    data() {
        return {
            messageList: [],
            shourtTimeString,
            notifyList: [],
            pageNum: 1,
        };
    },

    mounted() {
        this.requestSystemMessage()

    },
    methods: {
        onClickLeft() {
            this.$router.back()
        },
        handleJump(item) {
            localStorage.setItem("storeName", item.username)
            localStorage.setItem("sellerId", item.partyid)
            setTimeout(() => {
                window.openSiteCustomerService()
            }, 200)
        },
        readMessage(item) {
            if(item.status != 1) return;
            apiReadSystemMessage({
                ids: item.id,
            }).then(res => {
                this.notifyList.forEach((item2) => {
                    if (item2.id == item.id) {
                        item2.status = 2;
                    }
                })
            })
        },
        requestSystemMessage() {
            apiSystemMessage({
                module: 0,
                type: 3,
                status: 0,
                pageSize: 100,
                pageNum: this.pageNum,
                totalElements: -1,
            }).then(res => {
                res.elements.forEach((item) => {
                    if (item.title == 'Customer complaint success notification') {
                        const regex = /The (.*) that you complained, the reason for the complaint: (.*), after review by the system, the situation is true, and the store reputation points (\d+) will be deducted./;
                        const matches = item.content.match(regex);
                        const storeName = matches[1];
                        let complaintReason = matches[2];
                        const creditScore = matches[3];
                        if (complaintReason == 'No delivery for a long time') {
                            complaintReason = '长时间不发货'
                        } else if (complaintReason == 'The seller has a bad service attitude') {
                            complaintReason = '卖家服务态度恶劣'
                        } else if (complaintReason == 'Seller transaction fraud') {
                            complaintReason = '卖家交易欺诈'
                        } else if (complaintReason == 'The seller fails to fulfill his promise') {
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
                        } else if (complaintReason == 'The seller has a bad service attitude') {
                            complaintReason = '卖家服务态度恶劣'
                        } else if (complaintReason == 'Seller transaction fraud') {
                            complaintReason = '卖家交易欺诈'
                        } else if (complaintReason == 'The seller fails to fulfill his promise') {
                            complaintReason = '卖家承诺不履行'
                        } else if (complaintReason == 'other') {
                            complaintReason = '其他'
                        }
                        item.complaintReason = complaintReason;
                        item.creditScore = creditScore;
                        item.storeName = storeName;
                    }
                })
                this.notifyList = [...this.notifyList, ...res.elements]

            })
        },
    },
};
</script>
<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

.box {
    padding: 0 10px;
}

.notify {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #F4F6F9;
    margin-top: 10px;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);

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

    .content {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .title {
            font-weight: 600;
            font-size: 14px;
            color: #333;
            display: flex;
            align-items: center;
            .tips {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #ff3e3e;
                margin-right: 8px;
            }
        }

        span {
            font-size: 12px;
            line-height: 1;
            color: #7F7F7F;
            word-break: break-all;
        }
    }

    .time {
        font-size: 12px;
        color: #999;
        margin-top: 5px;
    }

}
</style>
