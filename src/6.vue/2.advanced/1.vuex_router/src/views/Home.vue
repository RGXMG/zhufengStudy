<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div>我的名字：{{ $store.state.name }}</div>
    <div>
      我的年龄：{{ $store.getters.getAge }}
      <button @click="changeAge">sync change age</button>
      <button @click="asyncChangeAge">async change age</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  mounted() {
    // setInterval(() => {
    //   this.$store.state.age += 1;
    // }, 1000);
  },
  methods: {
    changeAge() {
      this.$store.commit("upAge", 10);
    },
    asyncChangeAge() {
      this.$store.dispatch("asyncUpAge", 10);
    }
  }
};
</script>
