<template>
    <div class="floating_video" v-if="isShow">
        <div class="left" @click="packupVideoBox">
            <img :class="isPackup && 'packup'" src="@/assets/image/laqi.svg" alt="">
        </div>
        <div class="right">
            <img v-show="!isPlay" class="cover" src="@/assets/image/fengmian.png" alt="">
            <video ref="videoRef"  preload controls src="https://argos-shop-online.s3.amazonaws.com/pachong/videoplayback.mp4" type="video/mp4">
            </video>
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
            isPlay: false
        }
    },
    created(){
        this.$nextTick(() => {
            this.$refs.videoRef.muted = true;
            this.$refs.videoRef.play();
            this.isPlay = true;
        })
    },
    methods: {
        packupVideoBox() {
            if (this.isPackup) {
                this.$el.style.right = '0';
                this.$el.style.height = '225px';
            } else {
                this.$refs.videoRef.pause();
                this.$el.style.right = '-388px';
                this.$el.style.height = '115px';
            }
            this.isPackup = !this.isPackup;
        },
        handleVideoPlay() {
            this.$refs.videoRef.play();
            this.isPlay = true;
        }
    },
    mounted() {

    }
}
</script>

<style lang="scss" scoped>
.floating_video {
    position: fixed;
    bottom: 20px;
    right: 0;
    // transform: translateY(-50%);
    width: 422px;
    height: 225px;
    background: #eee;
    border-radius: 8px;
    z-index: 2000;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 8px 7px 4px;
    transition: all .3s ease-in-out;
    .left {
        flex: 0 0 22px;
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
            width: 30px;
            height: 30px;

            &.packup {
                transform: rotate(180deg);
            }
        }
    }
    .right {
        width: 392px;
        height: 100%;
        position: relative;
        border-radius: 2%;
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
            width: 20px;
            height: 20px;
        }

        .cover {
            width: 100%;
            height: 100%;
        }
    }
}</style>