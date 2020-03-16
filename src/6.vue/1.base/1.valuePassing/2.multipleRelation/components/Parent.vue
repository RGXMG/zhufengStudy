<template>
  <div>
    <h2>我是父亲</h2>
    <div>父亲的钱数：{{ myMoney }}</div>
    <Son1 v-model="myMoney"></Son1>

    <Son2 name="xmg" age="95" value="50"></Son2>
    <button @click="$broadcast('show')">儿子show</button>
  </div>
</template>

<script>
import Son1 from "./Son1";
import Son2 from "./Son2";
export default {
  components: {
    Son1,
    Son2
  },
  data() {
    return {
      myMoney: 100
    };
  },
  methods: {
    change(v) {
      this.myMoney = v;
    }
  }
};
</script>

<style scoped></style>
