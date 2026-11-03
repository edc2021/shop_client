<template>
    <div class="complaint">
        <van-nav-bar safe-area-inset-top fixed :title="$t('投诉卖家')" left-arrow @click-left="onClickLeft" />
        <div style="width: 100%;" class="h46"></div>
        <el-form label-position="top" label-width="80px" :model="formData" :rules="rules" ref="ruleForm" class="acc_form">
            <el-form-item :label="$t('投诉类型')" prop="type">
                <el-select v-model="formData.type" :placeholder="$t('请选择投诉类型')">
                    <el-option v-for="type of complaintType" :key="type.value" :label="$t(type.label)" :value="type.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('截图、凭证')" prop="images">
                <div class="img_box">
                    <div class="img_wrap" v-for="(path, index) of formData.images" :key="index" >
                        <van-image class="img" :src="path">
                            <template v-slot:loading>
                                <van-loading type="spinner" size="20" />
                            </template>
                        </van-image>
                        <van-icon v-if="path" @click="deteleImage(index)" class="close_icon" name="cross" />
                    </div>
                    <van-uploader :max-size="500 * 1024" v-show="formData.images.length < 9" :max-count="1" :before-read="handleUpload"
                        multiple />
                </div>
            </el-form-item>
            <el-form-item :label="$t('投诉原因')" prop="reason">
                <el-input maxlength="255" @input="limitEmoji" type="textarea" :autosize="{ minRows: 6, maxRows: 8 }"
                    v-model="formData.reason"></el-input>
            </el-form-item>
        </el-form>
        <div class="sub_btn" @click="submitForm">{{ $t('提交') }}</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Uploader, Toast, Loading, Icon } from 'vant'
import { apiSellerComplain } from '@/API/common'
import { uploadimg } from '@/API/commodity'
import { isLogin } from "@/utils/utis";

export default {
    components: {
        [Uploader.name]: Uploader,
        [Loading.name]: Loading,
        [Icon.name]: Icon,
    },
    data() {
        return {
            itemName: process.env.VUE_APP_ITEM_NAME,
            formData: {
                reason: '',
                images: [],
                type: ''
            },
            complaintType: [
                {
                    label: '长时间不发货',
                    value: 1
                },
                {
                    label: '卖家服务态度恶劣',
                    value: 2
                },
                {
                    label: '卖家交易欺诈',
                    value: 3
                },
                {
                    label: '卖家承诺不履行',
                    value: 4
                },
                {
                    label: '其他',
                    value: 0
                }
            ],
            pwtStatus: false,
            rules: {
                type: [
                    { required: true, message: this.$t('请选择投诉类型'), trigger: 'change' }
                ],
                reason: [
                    { required: true, message: this.$t('请输入投诉原因'), trigger: 'blur' }
                ],
                images: [
                    { required: true, message: this.$t('请上传截图、凭证'), trigger: 'change' }
                ]
            }
        }
    },
    created() {
        if (!isLogin()) {
            // Dialog.confirm({
            //     title: this.$t("您还未登录"),
            //     message: this.$t("是否跳转到登录页面"),
            //     confirmButtonText: this.$t("确认"),
            //     cancelButtonText: this.$t("取消"),
            // }).then(() => {
            //     this.$router.push('/login')
            // });
            this.$notifyWarn(this.$t("请先登录"));
            this.$router.push("/login");
            return false;
        }
    },
    computed: {
        ...mapGetters({
            userInfo: 'userInfo'
        })
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        handleUpload(data) {
            if(Array.isArray(data)) {
                data = data[0]
            }
            if (data.size > 4000 * 1024) {
                Toast(this.$t("图片大小不能超过{num}", { num: '4MB' }))
                return false
            }
            Toast.loading({
                duration: 0,
                message: this.$t("上传中"),
                forbidClick: true,
            });
            let formData = new FormData(); //通过formdata上传
            formData.append("file", data);
            formData.append("moduleName", "selle");
            uploadimg(formData)
                .then((data) => {
                    Toast.clear();
                    this.formData.images.push(data)
                })
                .catch(() => {
                    Toast.clear();
                    Toast(this.$t("失败"));
                    this.formData.images = [];
                });
        },
        // 提交
        submitForm() {
            if (this.formData.reason.trim().length == 0) {
                this.$notify(this.$t('请输入投诉原因'))
                return
            }
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    Toast.loading({
                        duration: 0,
                        forbidClick: true,
                    });
                    const params = {
                        sellerId: this.$route.query.sellerId,
                        complaintStatus: this.formData.type,
                        content: this.formData.reason
                    }
                    this.formData.images.forEach((item, index) => {
                        params[`imgUrl${index + 1}`] = item
                    })
                    apiSellerComplain(params).then(res => {
                        this.formData.reason = ''
                        this.formData.type = ''
                        this.formData.images = []
                        this.$notify(this.$t('提交成功'), 'success')
                        setTimeout(() => {
                            this.$router.back()
                        }, 1000)
                        Toast.clear();
                    }).catch(err => {
                        console.log(`err ::->`, err);
                        Toast.clear();
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 删除图片
        deteleImage(index) {
            this.formData.images.splice(index, 1)
        },
        // 限制表情输入
        limitEmoji(val) {
            this.formData.reason = val.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '')
        }
    }
}
</script>

<style lang="scss" scoped>
.complaint {
    padding-bottom: 30px;
}

.acc_form {
    padding: 0 15px;

    :deep(.el-form-item__label) {
        padding: 0 !important;
        font-weight: 600;
        font-size: 16px;
        color: #333;
    }
}

:deep(.van-uploader__upload) {
    width: 105px !important;
    height: 105px !important;
}

:deep(.van-uploader__preview) {
    width: 105px !important;
    height: 105px !important;

    .van-image {
        width: 100%;
        height: 100%;
    }
}

.el-form-item {
    display: flex;
    flex-direction: column;
}

:deep(input) {
    padding-right: 60px;
}

.sub_btn {
    margin: 15px 15px;
    margin-top: 56px;
    background: var(--main-color);
    border-radius: 4px;
    height: 44px;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 44px;
    text-align: center;
    color: #FFFFFF;
}
</style>
<style lang="scss">
.van-dialog__message {
    padding-top: 20px;
    line-height: 25px;
    border: none;
}

.van-dialog__footer {
    padding: 0 15px 30px 15px;

    &::after {
        display: none;
    }

    button {
        border: none;
        border-radius: 8px;

        &:nth-child(1) {
            border: 1px solid #999999;
            margin-right: 10px;
        }

        &:nth-child(2) {
            background: #DA3231;
            color: #FFFFFF !important;
        }

        &::before {
            display: none;
        }

        &::after {
            display: none;
        }
    }
}

.el-select {
    width: 100% !important;
}

.img_box {
    display: flex;
    flex-wrap: wrap;

    .img_wrap {
        position: relative;

        .img {
            width: 105px;
            height: 105px;
            margin-right: 10px;
            margin-bottom: 10px;
        }

        .close_icon {
            position: absolute;
            top: 2px;
            right: 20px;
            z-index: 9;
            width: 8px;
            height: 8px;
        }
    }

}
</style>