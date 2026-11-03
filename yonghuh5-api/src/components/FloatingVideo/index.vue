<template>
    <div class="floating_video" v-if="isShow">
        <div class="left" @click="packupVideoBox">
            <img :class="isPackup && 'packup'" src="@/assets/image/laqi.svg" alt="">
        </div>
        <div class="right">
            <img v-show="!isPlay" class="cover" src="@/assets/image/fengmian.png" alt="">
            <video controls src="https://argos-shop-online.s3.amazonaws.com/pachong/videoplayback.mp4" ref="videoRef"></video>
            <img v-show="!isPlay" @click="handleVideoPlay" class="play" src="@/assets/image/play.svg" alt="">
            <img @click="isShow = false" class="close" src="@/assets/image/close.svg" alt="">
        </div>
    </div>
</template>

<script>
export default {
    name: "FloatingVideo",
    data() {
        return {
            isPackup: false,
            isShow: true,
            isPlay: false,

        }
    },
    computed: {
        audioPlay() {
            return this.$store.state.app.audioPlay
        }
    },
    methods: {
        packupVideoBox() {
            this.$el.style.transition = 'all .3s ease-in-out'
            if (this.isPackup) {
                this.$el.style.right = '0';
                this.$el.style.height = '50vw';
            } else {
                this.$refs.videoRef.pause();
                this.$store.state.app.audioPlay = true
                this.$el.style.right = '-93vw';
                this.$el.style.height = '10vw';
            }
            this.isPackup = !this.isPackup;
        },
        handleVideoPlay() {
            this.$store.state.app.audioPlay = false
            this.$refs.videoRef.play();
            this.isPlay = true;
        }
    },
    mounted() {
        if(sessionStorage.getItem("expand_video")) {
            this.isPackup = true;
            this.$el.style.transition = 'none'
            this.$el.style.right = '-93vw';
            this.$el.style.height = '10vw';
        } else {
            sessionStorage.setItem("expand_video", '1');
        }
        this.$nextTick(() => {
            if(this.isPackup) return
            this.$refs.videoRef.muted = true;
            this.$refs.videoRef.play();
            this.isPlay = true;
        })
        
    }
}
</script>

<style lang="scss" scoped>
.floating_video {
    position: fixed;
    top: 55%;
    right: 0;
    transform: translateY(-50%);
    width: 100vw;
    height: 50vw;
    background: #eee;
    border-radius: 8px;
    z-index: 999;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 8px 7px 4px;
    transition: all .3s ease-in-out;
    
    .left {
        flex: 0 0 10%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            width: 20px;
            height: 20px;

            &.packup {
                transform: rotate(180deg);
            }
        }
    }

    .right {
        flex: 0 0 90%;
        height: 100%;
        position: relative;
        border-radius: 8px;
        overflow: hidden;

        video {
            width: 100%;
            height: 100%;
        }

        .play {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
        }

        .close {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 15px;
            height: 15px;
        }

        .cover {
            width: 100%;
            height: 100%;
        }
    }
}</style>