<template>
  <div class="serach-result">
    <EsHeaderView @searchValueChange="searchValueChange" />
    <div class=" app-container ">
      <EsLoadingView :loading="httpLoading">
        <div class="serach-result-product store-content-main">
          <EsSortView @sort="sortEvent" :hide-new="false" v-if="isSort"/>
          <div class="product-list content" v-if="serachResultList.length">
            <EsProductView
              v-for="(item, index) in serachResultList"
              :key="index"
              :item="item"
            />
          </div>
          <div
            class="common-pagination"
            v-if="serachResultList.length || total"
          >
            <el-pagination
              background
              layout="prev, pager, next"
              class="es-pagination"
              :page-size="pageSize"
              :current-page="pageNum"
              :total="total"
              @current-change="currentChange"
            />
          </div>
          <div class="no-data" v-if="!serachResultList.length">
            <el-empty :description="$t('message.home.noData')"></el-empty>
          </div>
        </div>
      </EsLoadingView>
    </div>
    <EsFooterView />
  </div>
</template>

<script>
  // import EsStore from '@/components/store'
  import EsSortView from "@/page/commodityPage/sort.vue";
  import EsProductView from "@/components/product";
  import { mapActions, mapGetters, mapMutations } from "vuex";
  // import { SearchApi } from "@/api";
  const emptyParam = [undefined, null, ""];

  export default {
    name: "EsSearchResult",
    components: { EsSortView, EsProductView },
    props: {
      // 类型 store 商铺， product 商品
      type: {
        type: String,
        default: "product",
      },
    },
    data() {
      return {
        httpLoading: false,
        pageNum: 1,
        pageSize: 12,
        isSort: true,
        total: 0,
        searchListInfo: [],
        beforeSortParams: {},
        dataType: "",
      };
    },
    watch: {
      goodsList(val) {
        // debugger;
        this.serachResultList = val;
      },
      route: "requestData",
    },
    computed: {
      ...mapGetters({
        storeSearchValue: "home/storeSearchValue",
        serachResultList: "user/serachResultList",
      }),
      isStoreView() {
        return this.type === "store";
      },
      goodsList() {
        return JSON.parse(localStorage.getItem("ES_SEARCH_RESULT") || "[]");
      },
      
    },
   activated () {
    console.log('this.$route.query ->', this.$route.query);
    // this.$nextTick(() => {
       const { k } = this.$route.query
      if (k) {
      this.pageInit(k)
      }
    // })
  },
    
    methods: {
      ...mapActions({
        requestSearchResultList: "user/requestSearchResultList",
      }),
      ...mapMutations({
        updateSerachResultList: "user/updateSerachResultList",
      }),
      pageInit(k) {
      if (k) {
        this.keyword = k
        this.requestData()
      } 
    },
      async requestData(params = {}) {
        const keywords = this.storeSearchValue;
        // if (keywords.indexOf('&') !== -1){
        //     const val  = JSON.parse(keywords)
        //     keywords =  String(encodeURIComponent(val)).trim()
        //     }else{
        //     const val  = JSON.parse(keywords)
        //     keywords = String(val).trim()
        // }
        if (params) {
          const hasId = Object.prototype.hasOwnProperty.call(params, keywords);
          const sortParams = hasId ? this.beforeSortParams : {};
          await this.requestSearchResultList({
            keyword: hasId ? params.categoryId : keywords,
            ...sortParams,
            ...params,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          }).then((res) => {
            this.total =
              this.pageNum === 1 && !res.pageList.length
                ? 0
                : res.pageList.length < this.pageSize
                ? res.pageInfo.pageNum * this.pageSize
                : res.pageInfo.pageNum * this.pageSize + 1;
          });
        } else {
          try {
            if (emptyParam.includes(keywords)) {
              return;
            }
            this.httpLoading = true;
            await this.requestSearchResultList({
              ...beforeSortParams,
              keyword: keywords,
              pageNum: this.pageNum,
              pageSize: this.pageSize,
            })
              .then((res) => {
                this.total =
                  this.pageNum === 1 && !res.pageList.length
                    ? 0
                    : res.pageList.length < this.pageSize
                    ? res.pageInfo.pageNum * this.pageSize
                    : res.pageInfo.pageNum * this.pageSize + 1;
                this.httpLoading = false;
              })
              .catch(() => {
                this.httpLoading = false;
              });
          } finally {
            this.httpLoading = false;
          }
        }
      },
      currentChange(page) {
        this.pageNum = page;
        this.requestData();
      },
      searchValueChange(val) {
        if (!emptyParam.includes(val)) {
          
          this.pageNum = 1;
          this.requestData({ keyword: val });
        }
      },
      sortEvent(params) {
        console.log('params ->', params);
        this.beforeSortParams = params;
        if (!this.storeSearchValue) {
          this.updateSerachResultList({ pageList: [] });
          return;
        }

        this.pageNum = 1;
        this.requestData(params);
      },
    },
    beforeDestroy() {
      console.log("实例销毁完成");
    },
  };
</script>

<style lang="scss" scope>
  .app-container {
    width: 1200px;
  }
  .serach-result {
    &-wrap {
      min-height: calc(100vh - 390px);
      position: relative;
      padding-bottom: 112px;

      .common-pagination {
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }

    .commodity-content-title {
      // padding: 0px 40px;
    }
    .no-data {
      display: flex;
      justify-content: center;
    }
  }
  .store-content-main {
    min-height: 300px;

    >.content {
        overflow: hidden;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(188px, 165px));
        grid-column-gap: 14px;
        grid-row-gap: 20px;
        align-content: center;
        padding: 40px 0;
        >.item {

            &:nth-child(6n) {
                margin-right: 0;
            }
        }
    }
}
</style>
