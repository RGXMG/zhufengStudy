<template>
  <div>
    <h2>我是儿子1：</h2>
    <div>
      接收到的父组件传递的钱数：{{ value }}，<button @click="change">
        改变
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {};
  },
  methods: {
    change() {
      // NOTE .sync语法糖的触发事件
      // this.$emit("update:value", 200);
      // NOTE v-model语法糖的触发事件
      this.$emit("input", 200);
    }
  }
};
</script>

<style scoped></style>
