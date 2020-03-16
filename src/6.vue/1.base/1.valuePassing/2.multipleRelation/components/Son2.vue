<template>
  <div>
    <h2>我是儿子2组件</h2>
    <div>{{ $attrs }}</div>
    <GrandSon2 v-bind="$attrs" />
  </div>
</template>

<script>
import GrandSon2 from "./GrandSon2";
export default {
  // 属性绑定到DOM上，默认为true
  // 就是父组件在子组件上定义的普通属性，非子组件中的props属性
  inheritAttrs: false,
  components: {
    GrandSon2
  },
  data() {
    return {};
  }
};
</script>

<style scoped></style>
