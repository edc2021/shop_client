<script>
import {bindEmailOrPhoneSmAction} from "@/api/user";
import Toast from "@/utils/toast";
import PasswordInput from "@/components/PasswordInput/index.vue";
import countryList from "@/utils/country";

export default {
  components: {PasswordInput},
  data() {
    return {
      countryList,
      searchCountry: '',
      editVisible: false,
      editTitle: '',
      editPhone: {
        phone: '',
        code: '1'
      }
    }
  },
  mounted() {
    this.editTitle = this.$t('修改手机')
    this.editPhone = {
      phone: '',
      code: '1'
    }
  },
  methods: {
    showSkipPhoneVerify() {
      this.editVisible = true
    },
    closeDialog() {
      this.editVisible = false
    },
    checkPhone(value) {
      value = value.replace(/[^\d]/g, '')
      this.editPhone.phone = value
    },
    searchCountryList() {
      this.countryList = countryList.filter(item => {
        return item.zh.indexOf(this.searchCountry) > -1 || item.en.toUpperCase().indexOf(this.searchCountry.toUpperCase()) > -1 || item.code.indexOf(this.searchCountry) > -1 || item.tw.indexOf(this.searchCountry) > -1 || item.ko.indexOf(this.searchCountry) > -1
      })
    },
    phoneBinding() {
      const t = this
      if (!this.editPhone.phone) {
        this.$message.error(this.$t('请输入手机号'));
        return;
      }
      let data = {
        target: this.editPhone.code.replace('+', '') + ' ' + t.editPhone.phone,
        phone: this.editPhone.code.replace('+', ' ') + ' ' + t.editPhone.phone,
        password: t.editPhone.password,
      }
      bindEmailOrPhoneSmAction(data).then(res => {
        Toast.success(t.$t('修改成功'));
        this.editVisible = false
        this.getInfo()
        this.$emit('getMerchantInfo')
        this.$emit('infoPost')
      })
    }
  }
}
</script>

<template>
  <!-- 不需要验证码直接修改手机号 -->
  <el-dialog :title="editTitle" :close-on-click-modal="false" :visible="editVisible" width="450px"
             @close="closeDialog" class="updateIphoneOrEmail">
    <div class="updateIphoneOrEmailContent">
      <p class="mb-8 font-12" style="color: #333;margin-top: 12px;">{{ $t('手机号') }}</p>
      <div class="c_phone-input-content">
        <img :src="require('@/assets/images/login/phone2.png')" alt="" class="input-icon"/>
        <!--        <el-dropdown class="input-dropdown" placement="bottom" trigger="click" @command="handlePhone">-->
        <!--                      <span class="el-dropdown-link" placement="bottom-start">-->
        <!--                        +{{ activeAddress }}<i class="ml-10 el-icon-caret-bottom"></i>-->
        <!--                      </span>-->
        <!--          <el-dropdown-menu slot="dropdown" class="project-dropdown">-->
        <!--            <div style="padding: 0 12px;box-sizing: border-box;">-->
        <!--              <el-input v-model="searchCountry" suffix-icon="el-icon-search" class="icon-search"-->
        <!--                        @input="searchCountryList"></el-input>-->
        <!--            </div>-->
        <!--            <el-dropdown-item v-for="(item,index) in countryList" :key="index" :command='item.code'>-->
        <!--              {{ $t(item.zh) }}(+{{ item.code }})-->
        <!--            </el-dropdown-item>-->
        <!--          </el-dropdown-menu>-->
        <!--        </el-dropdown>-->
        <el-input
          class="phone-input"
          :placeholder="$t('请输入手机号')"
          maxlength="60"
          v-model="editPhone.phone"
          @input="checkPhone"
          clearable>
          <el-select filterable v-model="editPhone.code" slot="prepend" placeholder="请选择"
                     :popper-append-to-body="false"
                     style="width: 100px;padding-left: 16px;">
            <el-option v-for="(item,index) in countryList" :key="index" :label="'+'+item.code" style="width: 350px"
                       :value="item.code">
              <span style="float: left">{{ $t(item.zh) }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">+{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-input>
      </div>
      <p class="mb-8 font-12" style="color: #333;margin-top: 12px;">{{ $t('登录密码') }}</p>
      <PasswordInput v-model="editPhone.password" @clear="editPhone.password=''"
                     :placeholder="$t('请输入登录密码')"/>
      <el-button class="w-full h-44" style="margin-top: 20px" type="primary" @click="phoneBinding">
        {{ $t('确认') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
::v-deep .c_phone-input-content .phone-input > .el-input__inner {
  padding-left: 12px !important;
}

.project-dropdown {
  //设置高度才能显示出滚动条 !important
  height: 200px;
  width: 378px;
  overflow: auto;
}
</style>
