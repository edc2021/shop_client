<template>
  <el-cascader :options="options" clearable :value="value" filterable :props="cascaderProps" @change="changeValue">
  </el-cascader>
</template>

<script>
import {getGoodsCategory, getGoodsCategoryList} from "@/api/user";
import {mapGetters} from "vuex";

export default {
  name: "index",
  data() {
    return {
      options: [],
      cascaderProps: {},
      //地址参数的categoryId
      urlCategoryId: '',
    }
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    all: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.urlCategoryId = this.$route.query.categoryId
    if (this.all) {
      this.getCategory()
    } else {
      this.getGoodsCategoryList()
    }
  },
  computed: {
    ...mapGetters(['merchantInfo'])
  },
  watch: {
    merchantInfo(val) {
      if (val.id) {
        if (this.all) {
          this.getCategory()
        } else {
          this.getGoodsCategoryList()
        }
      }
    }
  },
  methods: {
    changeValue(val) {
      this.$emit('input', val)
    },
    getGoodsCategoryList() {
      if (this.merchantInfo.id === undefined) return;
      getGoodsCategoryList({sellerId: this.merchantInfo.id}).then(res => {
        this.options = this.getChildren(res.data)
        this.options.unshift({
          value: null,
          label: this.$t('全部'),
          children: null
        });

        this.$emit('getCategory', res.data)
        //根据地址参数的categoryId设置默认值
        if (this.urlCategoryId) {
          this.value=[]
          this.value.push(this.urlCategoryId)
          this.value.push(this.urlCategoryId)
          this.changeValue(this.value)
          this.$emit('getGoodsList', res.data)
        }
      });
    },
    getCategory() {
      getGoodsCategory().then(res => {
        this.options = this.getChildren(res.data)
        this.options.unshift({
          value: null,
          label: this.$t('全部'),
          children: null
        });

        this.$emit('getCategory', res.data)
        //根据地址参数的categoryId设置默认值
        if (this.urlCategoryId) {
          this.value=[]
          this.value.push(this.urlCategoryId)
          this.value.push(this.urlCategoryId)
          this.changeValue(this.value)
          this.$emit('getGoodsList', res.data)
        }
      });
    },
    //递归获取子节点
    getChildren(data) {
      let arr = [];
      data.forEach(item => {
        let obj = {
          value: item.id,
          label: item.name,
          children: null
        };
        if (item?.subList?.length > 0) {
          obj.children = this.getChildren(item.subList);
          obj.children.unshift({
            value: item.id,
            label: this.$t('全部'),
            children: null
          })
        }
        arr.push(obj);
      });
      return arr;
    }
  }
}
</script>

<style scoped>

</style>
