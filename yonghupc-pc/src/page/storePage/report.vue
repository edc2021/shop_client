<template>
  <div class="user-info" v-loading="isloading">
    <EsHeaderView />
    <div class="app-container report-box">
      <div class="report-tit">{{ $t("message.home.投诉卖家") }}</div>
      <el-form
        :model="model"
        :rules="rules"
        ref="reportForm"
        label-position="top"
      >
        <el-form-item
          :label="$t('message.home.投诉类型:')"
          prop="complaintType"
        >
          <el-select
            v-model="model.complaintType"
            :style="{ width: '100%' }"
            :placeholder="$t('message.home.请选择投诉类型')"
          >
            <el-option
              v-for="item in complaintType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('message.home.截图凭证:')" prop="imageUrl">
          <el-upload
            :action="UploadApi"
            list-type="picture-card"
            :on-success="handlePictureCardPreview"
            :data="uploadParams"
            :before-upload="beforeUpload"
            accept=".jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.PBG,.BMP"
            :limit="9"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item :label="$t('message.home.投诉原因:')" prop="content">
          <el-input
            v-model="model.content"
            class="content"
            type="textarea"
            :placeholder="$t('message.home.pleaseInput')"
            resize="none"
            :maxlength="255"
          />
        </el-form-item>
        <div style="margin: 0 auto">
          <el-button
            size="medium"
            style="width: 480px; height: 44px"
            type="primary"
            @click="confirmEvent"
            v-loading="loading"
          >
            {{ $t("message.home.确认") }}
          </el-button>
        </div>
      </el-form>
    </div>
    <EsFooterView />
  </div>
</template>
<script>
import common from "@/util/common";
import { complaint } from "@/api/home";
import { UploadApi } from "@/api";
export default {
  data() {
    return {
      UploadApi,
      sellerId: "",
      loading:false,
      isloading: false,
      model: {
        complaintType: "",
        imageUrl: [],
        content: "",
      },
      uploadParams: {
        moduleName: "selle",
        token: localStorage.getItem("ES_TOKEN"),
      },
      complaintType: [
        {
          label: this.$t("message.home.长时间不发货"),
          value: 1,
        },
        {
          label: this.$t("message.home.卖家服务态度恶劣"),
          value: 2,
        },
        {
          label: this.$t("message.home.卖家交易欺诈"),
          value: 3,
        },
        {
          label: this.$t("message.home.卖家承诺不履行"),
          value: 4,
        },
        {
          label: this.$t("message.home.其他"),
          value: 0,
        },
      ],
      dialogImageUrl: "",
      dialogVisible: false,
      rules: {
        complaintType: [common.ruleUtils.getRule("required")],
        imageUrl: [common.ruleUtils.getRule("required")],
        content: [common.ruleUtils.getRule("required")],
        // returnDetail: [
        //   common.ruleUtils.getRule("required"),
        // ],
      },
    };
  },
  mounted() {
    this.sellerId = this.$route.params.sellerId;
  },
  methods: {
    beforeUpload(file) {
      this.$message({
        message: this.$t("message.home.uploading"),
        type: "info",
      });
    },
    handlePictureCardPreview(res) {
      this.$message.close();
      this.$message({
        message: this.$t("message.home.uploadSuccess"),
        type: "success",
      });
      this.model.imageUrl.push(res.data);
    },
    confirmEvent() {
      this.requestData();
      console.log("222 ->", 222);
    },
    requestData() {
      this.$refs.reportForm.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            this.isloading = true;
            const param = {
              sellerId: this.sellerId,
              complaintStatus: this.model.complaintType,
              content: this.model.content,
            };

            // 动态添加 imgUrl 属性
            this.model.imageUrl.forEach((url, index) => {
              if (url) { // 如果 url 存在，则添加到 param 对象
                param[`imgUrl${index + 1}`] = url;
              }
            });
            await complaint(param);
            this.$message.success(
              this.$t("message.home.店铺投诉成功")
            );
            this.$router.go(-1)
        }finally{
          this.loading = false; 
          this.isloading = false
        }
      }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.report {
  &-box {
    border: 1px solid #eee;
    margin: 20px auto;
    padding: 30px;
    .content {
      /deep/ .el-textarea__inner {
        height: 200px;
      }
    }
  }
  &-tit {
    color: #333;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }
}
</style>
