<template>
  <div>
    <div>{{ msg }}</div>
    <div>{{ value }}</div>
    <Cascader :lazy-load="load" :options="options" v-model="value" />
  </div>
</template>

<script>
import Cascader from "./lib";
import address from "./json/address.json";
function fetchData(pid) {
  return new Promise(res => {
    setTimeout(() => {
      res(address.filter(i => i.pid === pid));
    }, 500);
  });
}
export default {
  mounted() {
    this.getAsyncAddress(0).then(data => {
      this.options = data;
    });
  },
  components: {
    Cascader
  },
  data() {
    return {
      options: [],
      value: [],
      msg: "Cascader"
    };
  },
  methods: {
    load(key, callback) {
      this.getAsyncAddress(key).then(data => {
        callback(data);
      });
    },
    async getAsyncAddress(pid) {
      const res = await fetchData(pid);
      return res;
    }
  }
};
</script>

<style scoped></style>
