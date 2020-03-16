<template>
  <div>
    <h2>我是孙子1：</h2>
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
      default: 1,
      type: Number
    }
  },
  created() {
    this.$on('show', function() {
      console.log('GrandSon1');
    });
  },
  data() {
    return {};
  },
  methods: {
    change() {
      // NOTE 1. 使用$parent触发父组件的事件
      // 弊端在于至多只能传递三级
      // this.$parent.$emit("input", 500);

      // NOTE 2. 通过定义在Vue上的$dispatch循环向上通知
      this.$dispatch("input", 500);
    }
  }
};
</script>

<style scoped></style>
