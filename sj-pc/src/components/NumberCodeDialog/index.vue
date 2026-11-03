<template>
  <div class="verification-code">
    <div class="code-input">
      <el-input v-model="userInput" :placeholder="placeholderText" @input="checkCode"/>
      <div class="code-display" @click="refreshCode">
        <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
      </div>
    </div>
    <div class="refresh-button" @click="refreshCode">
      <i class="el-icon-refresh"></i>
      {{$t('刷新验证码')}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      verCode:false,
      userInput: '',
      code: '',
      canvasWidth: 100,
      canvasHeight: 40,
      placeholderText: '',
    };
  },
  mounted() {
    this.drawCode();
    this.placeholderText = this.$t('请输入验证码');
  },
  methods: {
    updateValue(event) {
      // 当输入框的值变化时，通过 $emit 触发 input 事件，将新的值传递给父组件
      this.$emit('input', event.target.value);
    },
    // 生成一个随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    // 生成一个随机的颜色
    randomColor(min, max) {
      const r = this.randomNum(min, max);
      const g = this.randomNum(min, max);
      const b = this.randomNum(min, max);
      return `rgb(${r},${g},${b})`;
    },
    // 生成验证码
    generateCode() {
      const numbers = '0123456789';
      let code = '';
      for (let i = 0; i < 4; i++) {
        const index = this.randomNum(0, numbers.length);
        code += numbers[index];
      }
      return code;
    },
    // 绘制验证码
    drawCode() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');

      ctx.textBaseline = 'bottom';
      ctx.fillStyle = this.randomColor(180, 240);
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      this.code = this.generateCode();

      for (let i = 0; i < this.code.length; i++) {
        this.drawText(ctx, this.code[i], i);
      }
    },
    drawText(ctx, txt, i) {
      ctx.fillStyle = this.randomColor(50, 160);
      ctx.font = this.randomNum(16, 40) + 'px SimHei';
      const x = (i + 1) * (this.canvasWidth / (this.code.length + 1));
      const y = this.randomNum(40, this.canvasHeight - 5);
      const deg = this.randomNum(-45, 45);
      ctx.translate(x, y);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.fillText(txt, 0, 0);
      ctx.rotate((-deg * Math.PI) / 180);
      ctx.translate(-x, -y);
    },
    // 刷新验证码
    refreshCode() {
      this.drawCode();
      this.userInput = '';
    },
    // 验证用户输入
    checkCode() {
      if (this.userInput === this.code) {
        console.log('验证码正确');
        this.verCode= true;
      } else {
        this.verCode= false;
        console.log('验证码不正确');
      }
    },
  },
};
</script>

<style scoped>
.verification-code {
  display: flex;
  align-items: center;
  position: relative;

  .code-input {
    position: relative;
    width: 100%;

    .code-display {
      position: absolute;
      right: 5px;
      top: 5px;
      border-radius: 2px;
      overflow: hidden;
      height: 40px;
      cursor: pointer;
    }
  }

  .refresh-button {
    position: absolute;
    color: #FFFFFF;
    right: 0;
    bottom: -36px;
    cursor: pointer;
  }
}

</style>
