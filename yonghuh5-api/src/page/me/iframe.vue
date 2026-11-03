<template>
    <div class="iframe-main">
        <Loading :show="loadingShow" />
        <van-nav-bar safe-area-inset-top fixed :title="title" left-arrow @click-left="onClickLeft" />
        <!-- <iframe :src="url" scrolling="auto" frameborder="0" class="nq-ys iframe" id="me_frame"
            @scroll.stop="false"></iframe> -->
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Loading from '@/components/Loading/index.vue'

export default {
    //   name: "iframe",
    components: {
        Loading
    },
    data() {
        return {
            itemName: process.env.VUE_APP_ITEM_NAME,
            url: "",
            title: "",
            paths: {
                'Argos': '#/',
                'MetaShop': '#/',
                'Tongda': '#/',
                'FamilyMart': '#/',
                'FamilyShop': '#/',
                'Inchoi': '#/',
                'Hive': '#/',
                'JNMIA': '#/',
                'Shop2u': '#/',
                'EShop': '#/',
                'GreenMall': '#/',
                'SM-wholesaleShop': '#/',
                'ArgosShop': '#/',
                'Iceland': '#/',
                'INT Overstock': '#/',
                'TikTok-Wholesale': '#/',
                'AntMall': '#/',
            },
            loadingShow: true,
        };
    },
    mounted() {

        this.url = this.$route.query.url;
        this.title = this.$route.query.title;
        if (this.title == '') {
            this.title = this.$route.query.title;
        } else if (this.title == this.$t('商家入驻')) {
            let lang = localStorage.getItem("lang") || "en";
            lang = lang.replace(/"/g, "");
            let path = ''
            if (['INT Overstock'].includes(this.itemName)) {
                path = this.$store.state.app.app_domain
            } else {
                path = window?.plus ? this.$store.state.app.app_domain : location.origin + '/'
            }
            // let path = 'http://127.0.0.1:8090/'
            if (location.origin.indexOf('localhost') > -1) {
                path = '#/'
            }

            const url = encodeURI(`${path}promote/#/?lang=${lang}&avatar=${this.userInfo?.avatar || 1}`)
            // const url = encodeURI(`#/promote/#/shippingPolicy?lang=cn`)
            this.url = url;
        }
        var me_frame = document.createElement("iframe");
        me_frame.src = this.url;
        me_frame.scrolling = "auto";
        me_frame.frameborder = "0";
        me_frame.className = "nq-ys iframe";
        me_frame.style = "margin-top: 45px;width: 100%;height: 100%;-webkit-overflow-scrolling: touch;border: none;padding: 0;margin: 0;overflow: hidden;";


        // const me_frame = document.getElementById('me_frame');
        if (me_frame.attachEvent) {
            me_frame.attachEvent("onload", () => {
                this.loadingShow = false;
            });
        } else {
            me_frame.onload = () => {
                this.loadingShow = false;
            };
        }

        const iframe_box = document.getElementsByClassName('iframe-main')[0];
        iframe_box.appendChild(me_frame);
        setTimeout(() => {
            this.loadingShow = false;
        }, 20000);

        window.addEventListener('message', (e) => {
            if (e.data?.lang && this.title == this.$t('商家入驻')) {
                if (e.data?.lang == 'en-US') {
                    this.$i18n.locale = 'en'
                    this.setLanguage('en');
                } else if (e.data?.lang == 'CN') {
                    this.$i18n.locale = 'tw'
                    this.setLanguage('tw');
                } else if (e.data?.lang == 'zh-CN') {
                    this.$i18n.locale = 'cn'
                    this.setLanguage('cn');
                } else {
                    this.$i18n.locale = e.data?.lang
                    this.setLanguage(e.data?.lang);
                }
                this.$nextTick(() => {
                    this.title = this.$t('商家入驻');
                })
            }

            if (e.data == 'jump') {
                if (window?.plus) {
                    plus.runtime.openURL(encodeURI(this.$store.state.app.app_domain + 'ww'))
                    // location.href = location.origin + '/ww'
                } else {
                    const qs = `?from=shop&lang=${localStorage.getItem('lang')}&token=${localStorage.getItem('token')}`;
                    location.href = location.origin + '/www' + qs;
                }
            }
        });
    },
    methods: {
        ...mapMutations(["setLanguage"]),
        onClickLeft() {
            const formPath = this.$router.go(-1)
            if (formPath) {
                this.$router.go(-1)
            } else {
                this.$router.push('/home')
            }

        }
    }
}
</script>

<style scoped lang="scss">
.iframe-main {
    width: 100%;
    height: 100%;
    padding: 45px 0 0 0;
    overflow: hidden;


    .iframe {
        margin-top: 45px;
        width: 100%;
        height: 100%;
        -webkit-overflow-scrolling: touch;
        border: none;
        padding: 0;
        margin: 0;
        overflow: hidden;
    }

}
</style>