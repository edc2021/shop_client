<template>
    <div class="login">
        <nationality-list ref='controlChild' :title="$t('选择区域码')" @getName="getName(arguments)"></nationality-list>
        <Vcode style="direction: ltr;" :imgs="[img1, img2, img3, img4, img5]" :show="show" @success="onSuccess"
            :canvasHeight="200" @fail="onFail" @close="show = false;" :sliderText="$t('拖动滑块以完成拼图')"
            :successText="$t('验证通过!')" :failText="$t('验证失败,请重试')" />

        <div class="lang-right" v-if="isShelves">
            <div class="lang-left" @click="onClickLeft">
                <van-icon name="arrow-left" />
            </div>
            <router-link to="/language">
                <img class="lang-icon" src="@/assets/image/public/feedback.png" />
            </router-link>
        </div>
        <div class="login-title">{{ $t('注册') }}</div>
        <div class="tab" v-if="!['SM-wholesaleShop', 'FamilyShop'].includes(itemName)">
            <div class="tab-button" :class="TabShow === 1 ? 'tab-button-show2' : 'tab-button-show1'" @click="TabClick(1)">{{
                $t('手机号') }}</div>
            <div class="tab-button" :class="TabShow === 2 ? 'tab-button-show2' : 'tab-button-show1'" @click="TabClick(2)">{{
                $t('邮箱') }}</div>
        </div>
        <div class="phone_form">
            <div class="title-input m-t20 m-b10">{{ TabShow === 1 ? $t('手机号') : $t('邮箱') }}</div>
            <div v-if="TabShow === 1" class="login-input">
                <el-input :placeholder="$t('请输入手机号')" maxlength="20" v-model.trim="formData.username" clearable
                    @input="() => formData.username = formData.username.replace(/[^\d]/g, '')">
                    <div slot="prepend" @click="openNational('dialCode')">
                        <p>+<span>{{ dialCode }}</span> <img :src="triangleDown" alt="" class="icon" /></p>
                    </div>
                </el-input>
            </div>
            <div v-if="TabShow === 2" class="login-input code_wrap">
                <el-input :placeholder="$t('请输入邮箱')" maxlength="64" v-model.trim="formData.username">
                </el-input>
                <div class="code_btn_txt" :class="{ 'disabled': btnDisabled }" @click="!btnDisabled && getCode()">{{ codeBtnTxt }}</div>
            </div>
            <div v-if="TabShow === 2">
                <div class="title-input m-t20 m-b10">{{ $t('验证码') }}</div>
                <el-input :placeholder="$t('请输入验证码')" maxlength="6" v-model.trim="formData.verifcode"
                    @input="() => formData.verifcode = formData.verifcode.replace(/[^\d]/g, '')" clearable>
                </el-input>
            </div>
            <div v-if="['SM-wholesaleShop', 'FamilyShop'].includes(itemName)">
                <!-- <div class="title-input m-t20 m-b10">{{ $t('验证码') }}</div>
                <div>
                    <el-input :placeholder="$t('请输入验证码')" maxlength="64" v-model.trim="formData.verifcode" clearable>
                    </el-input>
                </div> -->
                <div class="title-input m-t20 m-b10">{{ $t('手机号') }}</div>
                <div class="login-input">
                    <el-input :placeholder="$t('请输入手机号')" maxlength="20" v-model.trim="formData.phone" clearable
                        @input="() => formData.phone = formData.phone.replace(/[^\d]/g, '')">
                        <div slot="prepend" @click="openNational('dialCode')">
                            <p>+<span>{{ dialCode }}</span> <img :src="triangleDown" alt="" class="icon" /></p>
                        </div>
                    </el-input>
                </div>
                <div class="title-input m-t20 m-b10">WhatsApp</div>
                <div class="login-input">
                    <el-input :placeholder="$t('请输入WhatsApp账号')" maxlength="16" v-model="formData.WhatsApp" clearable
                        @input="() => formData.WhatsApp = formData.WhatsApp.replace(/[^\d]/g, '')">
                        <div slot="prepend" @click="openNational('dialCode2')">
                            <p>+<span>{{ dialCode2 }}</span> <img :src="triangleDown" alt="" class="icon" /></p>
                        </div>
                    </el-input>
                </div>
            </div>
            <div class="title-input m-t20 m-b10">{{ $t('密码') }}</div>
            <div class="login-input">
                <el-input :placeholder="$t('请输入 6-20 位由数字或字母组成的密码')" maxlength="20" v-model.trim="formData.password"
                    show-password clearable>
                </el-input>
            </div>
            <div class="title-input m-t20 m-b10">{{ $t('确认密码') }}</div>
            <div class="login-input">
                <el-input :placeholder="$t('请再次输入密码')" maxlength="20" v-model.trim="formData.re_password" show-password
                    clearable>
                </el-input>
            </div>
        </div>
        <div class="tijiao" @click="post_form">{{ $t('注册') }}</div>
        <div class="zhuce">
            <div class="zhuce-flex"></div>
            <div class="zhuce-text1">{{ $t('已有账号？') }} </div>
            <div class="zhuce-text2" @click="$router.push('/login')">{{ $t('去登录') }}</div>
            <div class="zhuce-flex"></div>
        </div>

    </div>
</template>

<script>
import { Toast, Icon } from "vant";
import Vcode from "vue-puzzle-vcode";
import NationalityList from '@/components/NationalityList'
import {
    registerNoVerifcode,
    justShopRegister,
    apiSendCode
} from '@/API/user'
import { isLogin } from '@/utils/utis'
export default {
    name: 'LoginPage',
    components: {
        [Icon.name]: Icon,
        NationalityList,
        Vcode
    },
    data() {
        return {
            isLogin,
            isShelves: !process.env.VUE_APP_PUT_ON_SHELVES,
            itemName: process.env.VUE_APP_ITEM_NAME,
            img1: require('@/assets/image/slider/1.png'),
            img2: require('@/assets/image/slider/2.png'),
            img3: require('@/assets/image/slider/3.png'),
            img4: require('@/assets/image/slider/4.png'),
            img5: require('@/assets/image/slider/5.png'),
            triangleDown: require('@/assets/image/me/triangle_down.png'),
            TabShow: ['SM-wholesaleShop', 'FamilyShop'].includes(process.env.VUE_APP_ITEM_NAME) ? 2 : 1,
            codeBtnTxt: this.$t('码'),
            formData: {
                username: '',
                password: '',
                re_password: '',
                verifcode: '',
                phone: '',
                WhatsApp: ''
            },
            count: 60,
            interval: null,
            btnDisabled: false,
            show: false,
            pageDiaCode: false,
            dialCode: localStorage.getItem('dialCode') || 1,
            dialCode2: localStorage.getItem('dialCode2') || 1,
            currentdialCode: 'dialCode'
        }
    },
    created() {
        if (this.isLogin()) {
            this.$router.push('/')
        }

    },
    methods: {
        getCode() {
            if (this.formData.username === '') {
                Toast(this.$t('请输入邮箱'));
                return
            }
            const reg = /^([A-Za-z0-9_\-\.\w{3,}])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
            if (!reg.test(this.formData.username)) {
                Toast(this.$t('邮箱格式有误'));
                return;
            }

            Toast.loading({
                duration: 0,
                message: this.$t('发送中'),
                forbidClick: true,
            })

            const params = {
                target: this.formData.username
            }
            apiSendCode(params).then(() => {
                Toast.success(this.$t('发送成功'))
                this.timerFn()
            }).catch(err => {
                Toast.clear()
            })
        },
        timerFn() {
            this.codeBtnTxt = `${this.$t('再次获取')} ${this.count} s`
            this.btnDisabled = true
            this.interval = setInterval(() => {
                if (this.count === 1) {
                    this.count = 60
                    this.codeBtnTxt = this.$t('再次获取')
                    this.btnDisabled = false
                    clearInterval(this.interval)
                } else {
                    this.count -= 1
                    this.codeBtnTxt = `${this.$t('再次获取')} ${this.count} s`
                }
            }, 1000)
        },
        handleJump() { window.openSiteCustomerService(); },
        TabClick(e) {
            this.TabShow = e
            this.formData.username = ''
            this.formData.password = ''
            this.formData.re_password = ''
        },
        post_form() {
            const t = this
            if (this.TabShow === 1) {
                if (this.formData.username === '') {
                    Toast(t.$t('请输入手机号'));
                    return
                } else {
                    const reg = /^[0-9]+[0-9]*$/
                    if (!reg.test(this.formData.username)) {
                        Toast(t.$t('手机号格式有误'));
                        return;
                    }
                }
            }
            if (this.TabShow === 2) {
                if (this.formData.username === '') {
                    Toast(t.$t('请输入邮箱'));
                    return
                }
                const reg = /^([A-Za-z0-9_\-\.\w{3,}])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
                if (!reg.test(this.formData.username)) {
                    Toast(t.$t('邮箱格式有误'));
                    return;
                }
                if (!/^\d{6}$/.test(this.formData.verifcode)) {
                    Toast(t.$t('请输入验证码'));
                    return;
                }
            }

            if (this.formData.password === '') {
                Toast(t.$t('请输入密码'));
                return;
            }

            const reg = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;'"\\|,.<>?~`\-=/]{6,20}$/;
            if (!reg.test(this.formData.password)) {
                Toast(t.$t('请输入 6-20 位由数字或字母组成的密码'));
                return;
            }

            if (this.formData.password !== this.formData.re_password) {
                Toast(this.$t('两次密码输入不一致'));
                return;
            }
            if (['SM-wholesaleShop', 'FamilyShop'].includes(this.itemName)) {
                if (this.formData.WhatsApp.trim() === '') {
                    Toast(this.$t('请输入WhatsApp账号'));
                    return;
                }
            }
            this.show = true
        },
        onSuccess() {
            this.registerSubmit()
            this.show = false
        },
        onFail() {
            console.log("失败回调");
        },

        async registerSubmit() {
            const requestFn = ['SM-wholesaleShop', 'FamilyShop'].includes(this.itemName) ? justShopRegister : registerNoVerifcode
            const params = {
                password: encodeURI(this.formData.password)?.trim(),
                re_password: encodeURI(this.formData.re_password)?.trim(),
                type: this.TabShow
            }
            if (this.TabShow === 2) {
                params.verifcode = this.formData.verifcode
            }

            if (sessionStorage.getItem('ac_code')) {
                params.agentCode = sessionStorage.getItem('ac_code')
                sessionStorage.removeItem('ac_code')
            }

            if (['SM-wholesaleShop', 'FamilyShop'].includes(this.itemName)) {
                params.verifcode = this.formData.verifcode
                params.phone = `${this.dialCode} ${this.formData.phone}`
                params.username = this.formData.username.trim()
                params.whatsApp = `+${this.dialCode2} ${this.formData.WhatsApp}`
                //params.whatsApp = this.formData.WhatsApp
            } else {
                params.username = this.TabShow === 1 ? `${this.dialCode} ${this.formData.username.trim()}` : this.formData.username.trim()
            }
            Toast.loading({
                duration: 0,
                message: this.$t('提交中'),
                forbidClick: true,
            })
            requestFn(params).then(async res => {
                if (['SM-wholesaleShop', 'FamilyShop'].includes(this.itemName)) {
                    localStorage.setItem("ACCOUNT_INFO", JSON.stringify({ 
                        username: this.formData.username?.trim(), 
                        phone: `${this.dialCode} ${this.formData.phone}`,
                        TabShow: 1
                     }));
                } else {
                    if (this.TabShow == 1) {
                        localStorage.setItem("ACCOUNT_INFO", JSON.stringify({ username: this.formData.username?.trim(), dialCode: this.dialCode, TabShow: 2 }));
                    } else {
                        localStorage.setItem("ACCOUNT_INFO", JSON.stringify({ username: this.formData.username?.trim(), TabShow: 1 }));
                    }
                }

                // Toast.success(this.$t('注册成功'))
                Toast.clear()
                this.$notify(this.$t('注册成功'), 'success')
                localStorage.setItem('token', res.token)
                let timeZone = this.dayjs.tz.guess();
                localStorage.setItem("timeZone", timeZone);
                await this.$store.dispatch('getUserInfo')
                setTimeout(() => {
                    this.$router.push({ path: '/' })
                }, 500)
            }).catch(err => {
                // Toast.fail(err.msg)
                Toast.clear()
            })
        },
        // 限制表情输入
        limitEmoji(val) {
            this.formData.WhatsApp = val.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '')
        },
        getName(params) {
            if (!this.pageDiaCode) {
                this.pageDiaCode = true
            } else {
                this[this.currentdialCode] = params[2]
                localStorage.setItem(this.currentdialCode, this[this.currentdialCode])
            }
        },

        openNational(key) {
            this.currentdialCode = key
            this.$refs.controlChild.open()
        },
        onClickLeft() {
            this.$router.push('/')
        },
    }
}
</script>

<style lang="scss" scoped>
.code_wrap {
    position: relative;

    .code_btn_txt {
        padding: 0 20px;
        height: 40px;
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 14px;

        color: var(--main-color);
        display: flex;
        align-items: center;
        justify-content: center;

        &.disabled {
            pointer-events: none;
            opacity: 0.9;
        }
    }
}

.login {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    box-sizing: border-box;

    /deep/ .el-input {
        input:focus {
            // border-color: var(--main-color);
            border-color: var(--main-color);
        }
    }

    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .lang-right {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .lang-icon {
            padding: 12px 0 12px 10px;
            width: 20px;
            height: 20px;
        }

        .lang-left {
            font-size: 25px;
            color: #333;
        }
    }

    .login-title {
        font-style: normal;
        font-weight: 700;
        font-size: 30px;
        line-height: 35px;

        color: #333333;
        margin-top: 10px;
    }

    .tab {
        margin-top: 30px;
        width: 100%;
        display: flex;
        justify-content: left;

        .tab-button {
            border-radius: 4px;
            //padding: 8px 10px;
            padding: 0 10px;
            min-width: 64px;
            height: 34px;
            text-align: center;
            margin-right: 10px;
            line-height: 34px;
        }

        .tab-button-show1 {
            background: #EEEEEE;
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            //line-height: 14px;
            /* identical to box height, or 117% */
            color: #333333;
        }

        .tab-button-show2 {
            background: var(--main-color);
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            //line-height: 12px;
            /* identical to box height, or 100% */
            color: #FFFFFF;
        }
    }

    .title-input {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        color: #333333;
    }

    .wangjimima {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        /* identical to box height */
        color: #1D91FF;
        margin-top: 10px;
    }

    .tijiao {
        margin-top: 20px;
        width: 345px;
        height: 44px;
        background: var(--main-color);
        border-radius: 4px;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 44px;
        /* identical to box height, or 100% */

        text-align: center;

        color: #FFFFFF;
    }

    .zhuce {
        margin-top: 16px;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .zhuce-flex {
        flex: 1;
    }

    .zhuce-text1 {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        margin-right: 5px;
        color: #333333;

    }

    .zhuce-text2 {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        color: #4AA8FF;
    }

    .kefu-icon {
        position: fixed;
        width: 50px;
        height: 50px;
        right: 28px;
        bottom: 32px;
    }
}

.phone_form {
    /deep/ .el-input-group--prepend {
        .el-input-group__prepend {
            background-color: transparent !important;
            color: #000 !important;
            border-right: none !important;
            padding: 0 15px !important;

            .icon {
                width: 10px;
                height: auto;
                position: relative;
                top: -1px;
                margin-left: 5px;
            }
        }

        .el-input__inner {
            border-left-color: #fff;
        }
    }
}

.login-input {
    &.code {
        position: relative;

        >.btn {
            padding: 0 20px;
            height: 40px;
            position: absolute;
            right: 0;
            bottom: 0;
            font-size: 14px;

            color: var(--main-color);
            display: flex;
            align-items: center;
            justify-content: center;

            &.disabled {
                pointer-events: none;
                opacity: 0.9;
            }
        }
    }
}
</style>
