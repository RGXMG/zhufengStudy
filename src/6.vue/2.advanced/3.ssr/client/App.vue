<template>
  <!-- NOTE ssr时没有名为id的app，所以这里需要激活渲染   -->
  <div id="app">
    <Header />
    App
    {{ $store.state.count }}
    <button @click="hello"></button>
    <router-link to="/user">USER</router-link>
    <router-link to="/home">HOME</router-link>
    <hr />
    <router-view />
  </div>
</template>

<script>
import Header from "./components/Header";
export default {
  components: {
    Header
  },
  methods: {
    hello() {
      alert("1123");
    }
  }
};
</script>
<style lang="less">
body {
  background: #9fcdff;
}
</style>
