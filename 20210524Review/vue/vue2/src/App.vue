<template>
  <div id="app">
    <HelloWorld />
    <div id="nav">12312321</div>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
export default {
  components: {
    HelloWorld,
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
