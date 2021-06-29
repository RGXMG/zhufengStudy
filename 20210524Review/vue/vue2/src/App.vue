<template>
  <div id="app">
    <HelloWorld>
      <template #name="{ name }" v-if="show"> {{ age }} {{ name }} </template>
      <template #age="{ age }"> {{ age }}</template>
    </HelloWorld>
    <button @click="show = !show">点击</button>
    <div id="nav">12312321</div>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
export default {
  components: {
    HelloWorld,
  },
  data() {
    return {
      age: "33",
      show: true,
    };
  },
  updated() {
    console.log("---");
  },
  mounted() {
    window._this = this;
    console.log(this);
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
