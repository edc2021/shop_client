<template>
    <div>
        <div class="th-back-top" v-show="false" @click="clickHidden">
        <!-- <span class="bg-back2top2"> -->
          <!-- <img src="@/assets/image/dingbu.png" alt=""> -->
          <span class="iconfont icon-huidaodingbu bg-back2top2"></span>
        <!-- </span> -->
        </div>
       
        <div class="lottery-box" v-if="lotteryFlag && lotteryUrl">
            <div class="close" @click="close">
                <img src="@/assets/image/lottery-close.png" alt="">
            </div>
            <div class="lottertTxt">
                {{$t('message.home.抽奖')}}
            </div>
            <img src="@/assets/image/lottery.png" alt="" @click.stop="openUrl">
        </div>
       <FloatingVideo v-if="['SM-wholesale shop', 'EShop'].includes(itemName)" />
       <!-- 'SM-wholesale shop', -->
    </div>
</template>
<script>
import {getActiveUrl} from "@/api/home";
import FloatingVideo from "@/components/FloatingVideo"
export default {
    name:"BackTop",
    data(){
        return{
            flag:false,
            lotteryFlag:true,
            lotteryUrl:'',
            itemName:process.env.VUE_APP_ITEM_NAME,
        }
    },
    components:{
        FloatingVideo
    },
    mounted(){
        // console.log(window.document.documentElement.clientHeight); 
        //获取页面可视化高度
        this.getUrl()
       window.addEventListener("scroll",()=>{
        //  console.log(document.documentElement.scrollTop);  
        //获取页面滚动的高度
           let scrollTop = document.documentElement.scrollTop;
           if(scrollTop > 100){
               this.flag = true;
           }else{
               this.flag = false;

           }
       })
    },
    methods:{
       clickHidden(){
           document.documentElement.scrollTo (0,0);   //点击返回顶部
       },
       close(){
           this.lotteryFlag = false;
       },
       async getUrl(){
        const res = await getActiveUrl()
        this.lotteryUrl = res.data.detailUrl
       },
       openUrl(){
           window.open(this.lotteryUrl)
       }
    }
}
</script>
<style scoped lang='scss'>
html[dir='rtl'] {
    .th-back-top{
        left:15px;
        right:unset;
        text-align:left;
    }
}
.th-back-top{
    position:fixed;
    right:15px;
    bottom:104px;
    height: 39px;
    width: 80px;
    z-index:9;
    opacity:0.8;
    text-align:right;
}

.bg-back2top2 {
    display: inline-block;
    cursor: pointer;
    // width: 40px;
    // height: 40px;
    font-size: 46px;
    color: var(--color-main);
    // img{
    //   width: 100%;
    //   height: 100%;
    //   object-fit: cover;
    // }
}
.lottery-box{
    width: 130px;
    height: 104px;
    position: fixed;
    right: 0;
    bottom: 30%;
    z-index: 999;
    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
    }
    .close{
        width: 18px;
        height: 18px;
        position: absolute;
        right: 0;
        cursor: pointer;
    }
    .lottertTxt{
        min-width: 106px;
        height: 30px;
        line-height: 26px;
        text-align: center;
        border-radius: 30px;
        border: 2px solid #ffde49;
        color: #fff;
        padding: 0 6px;
        font-size: 14px;
        cursor: pointer;
        background: -webkit-gradient(linear,left top,left bottom,from(#9f3dc8),to(#c975e5));
        background: linear-gradient(180deg,#9f3dc8,#c975e5);
        position: absolute;
        left: 50%;
        top: 100%;
        transform: translate(-48%,-50%);
    }
}
</style>