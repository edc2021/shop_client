<script>
import {seller_goods_spec_list_action_post} from "@/api/user";
import FormatNumberShow from "@/components/FormatNumberShow/index.vue";
//弹窗展示所有规格的列表:颜色、尺寸、采购价、销售价格、折扣价、利润
export default {
  name: 'SellerGoodsSkuAttr',
  components: {FormatNumberShow},
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      attrName: [],
      attrValue: '',
    }
  },
  methods: {
    handleClose(done) {
      this.dialogVisible = false;
    },
    showSellerGoodsSkuAttrView(id) {
      this.dialogVisible = true;
      this.getSellerGoodsSkuAttr(id);
    },
    getSellerGoodsSkuAttr(id) {
      this.tableData = [];
      this.attrName = [];
      this.attrValue = '';
      seller_goods_spec_list_action_post({
        sellerGoodsId: id
      }).then(res => {
        this.tableData = res.data.sellerGoodsSkuDtoList;
        this.tableData.forEach(item => {
          item.attrValue=[]
          item.goodsAttributeVos.forEach(childItem => {
            this.attrName.push(childItem.attrName)
            item.attrValue.push(childItem.attrValue)
          })
        })
        // this.attrName 去重
        this.attrName = [...new Set(this.attrName)]
      })
    },
    goodsPorfit(number1, number2) {
      let profit = this.$bigDecimal.subtract(number1, number2)
      return (profit * 1).toFloor(2)
    },
  },

}
</script>

<template>
  <!--  弹窗展示所有规格的列表:颜色、尺寸、采购价、销售价格、折扣价、利润  -->
  <el-dialog :title="$t('商品规格')" border stripe :visible.sync="dialogVisible" :before-close="handleClose">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column :prop="attrName" v-for="(item,index) in attrName" :key="index" :label="item?item:$t('规格')">
        <template slot-scope="scope">
          {{ scope.row.attrValue[index] }}
        </template>
      </el-table-column>
      <el-table-column prop="purchasePrice" :label="$t('采购价格')">
        <template slot-scope="scope">
            <span style="color: #409EFF;">
              <FormatNumberShow :data="scope.row.systemPrice" :currency="true"/>
            </span>
        </template>
      </el-table-column>
      <el-table-column prop="sellingPrice" :label="$t('销售价格')">
        <template slot-scope="scope">
            <span style="color: #409EFF;">
              <FormatNumberShow :data="scope.row.sellingPrice" :currency="true"/>
            </span>
        </template>
      </el-table-column>
      <el-table-column prop="discountPrice" :label="$t('折扣价')">
        <template slot-scope="scope">
            <span v-if="scope.row.discountPrice" style="color: #409EFF;">
              <FormatNumberShow :data="scope.row.discountPrice" :currency="true"/>
            </span>
          <span v-else>{{ '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="profit" :label="$t('利润')">
        <template slot-scope="scope">
          <div
            :style="{ color: ((scope.row.sellingPrice - scope.row.systemPrice) || 0) > 0 ? '#409EFF' : '#F56C6C' }">
            <!--              ${{-->
            <!--                goodsPorfit((scope.row.discountPrice ? scope.row.discountPrice : scope.row.sellingPrice), scope.row.systemPrice)-->
            <!--              }}-->
            <FormatNumberShow
              :data="goodsPorfit((scope.row.discountPrice ? scope.row.discountPrice : scope.row.sellingPrice), scope.row.systemPrice)"
              :currency="true"/>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="dialogVisible = false">{{ $t('确定') }}</el-button>
    </span>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
