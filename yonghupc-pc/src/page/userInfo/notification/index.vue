<template>
  <div class="notification-container">
      <div class="noti-box" v-if="messageList.length">
        <el-card shadow="always" class="notification" v-for="(item,index) in messageList" :key="index">
          <div @click="reedMsg(item.id)" style="cursor: pointer;">
            <h3><span v-if="item.status == 1"></span>{{$t('message.home.店铺投诉通知')}}</h3>
            <p style="color:#333;padding:10px" v-if="item.title == 'Customer complaint success notification'">{{$t('message.home.messageSuccess',{storeName:item.storeName,complaintReason:$t('message.home.'+item.complaintReason),creditScore:item.creditScore})}}</p>
            <p style="color:#333;padding:10px" v-else> {{$t('message.home.messageFail',{storeName:item.storeName,complaintReason:$t('message.home.'+item.complaintReason),creditScore:item.creditScore})}} </p>
            <span style="color:#999; padding-left:10px">{{item.sendTime}}</span>
          </div>
        </el-card>
      </div>
      <div v-if="messageList.length || total" class="common-pagination">
        <el-pagination
          background
          layout="prev, pager,next"
          class="es-pagination"
          :page-size="pageSize"
          :pager-count="5"
          :current-page="pageNum"
          :total="total"
          @current-change="currentChange"
        />
    </div>
    <div class="no-data" v-else>
        <el-empty :description="$t('message.home.noData')"></el-empty>
    </div>
  </div>
</template>

<script>
import {getMessageList} from '@/api'
import {_sendReedMsg} from '@/api/chat.api'

  export default {
    data(){
      return{
        messageList:[],
        pageSize: 10,
        pageNum: 1,
        total: 0,
      }
    },
    mounted(){
      this.init()
    },
    methods:{
      currentChange(page) {
        // console.log('222 ->', 222);
        document.documentElement.scrollTop = 0;
        this.pageNum = page;
        this.init();
      },
      async reedMsg(id){
        console.log('id ->', id);
        const param={
          ids:id
        }
        const res = _sendReedMsg(param)
        this.init();
      },
      async init(){
        const param = {
          totalElements: -1,
          type: 3,
          status: 0,
          module: 0,
          tz: 'Asia/Shanghai',
        }
        const res = await getMessageList({
          ...param,
          ...{
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          }
        })
        this.messageList = res.data.elements
        this.messageList.forEach((item)=>{
          if(item.title == 'Customer complaint success notification'){
            const regex = /The (.*) that you complained, the reason for the complaint: (.*), after review by the system, the situation is true, and the store reputation points (\d+) will be deducted./;
            const matches = item.content.match(regex);
            const storeName = matches[1];
            let complaintReason = matches[2];
            const creditScore = matches[3];
            if(complaintReason == 'No delivery for a long time') {
              complaintReason = '长时间不发货'
            }else if(complaintReason == 'The seller has a bad service attitude'){
              complaintReason = '卖家服务态度恶劣'
            }else if(complaintReason == 'Seller transaction fraud') {
              complaintReason = '卖家交易欺诈'
            }else if(complaintReason == 'The seller fails to fulfill his promise') {
              complaintReason = '卖家承诺不履行'
            }else if(complaintReason == 'other'){
              complaintReason = '其他'
            }
            item.complaintReason = complaintReason;
            item.creditScore = creditScore;
            item.storeName = storeName;
          }else if(item.title == 'Customer complaint rejection notification'){
            const regex = /The (.*) that you complained, the reason for the complaint: (.*), was rejected after review by the system, the reason for rejection: (.*)/
            const matches = item.content.match(regex);
            const storeName = matches[1];
            let complaintReason = matches[2];
            const creditScore = matches[3];
            if(complaintReason == 'No delivery for a long time') {
              complaintReason = '长时间不发货'
            }else if(complaintReason == 'The seller has a bad service attitude'){
              complaintReason = '卖家服务态度恶劣'
            }else if(complaintReason == 'Seller transaction fraud') {
              complaintReason = '卖家交易欺诈'
            }else if(complaintReason == 'The seller fails to fulfill his promise') {
              complaintReason = '卖家承诺不履行'
            }else if(complaintReason == 'other'){
              complaintReason = '其他'
            }
            item.complaintReason = complaintReason;
            item.creditScore = creditScore;
            item.storeName = storeName;
          }

            item.tit = '店铺投诉通知'
            console.log('item ->', item);
        })
        this.total = res.data.totalElements
      },
      
    }
  }
</script>
<style scoped lang="scss">
  .notification-container {
    min-height: 800px;
    h3{
      display: flex;
      span{
        width: 10px;
        height:10px;
        border-radius:100%;
        background:red;
        margin-right: 5px;
      }
    }
    .noti-box{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 14px;
      min-height: 785px;
    }
    .notification{
      width: 100%;
      margin: 10px;
    }
  }
</style>
