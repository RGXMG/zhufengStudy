<template>
  <div>
    {{ hello }}
    <LevelFunctional v-bind:key="i" v-for="i in 6" :type="i"
      >标题</LevelFunctional
    >
    <List
      :render="renderItem"
      :data="['apple', 'banner', 'pear', 'peach', 'grape']"
    />
  </div>
</template>

<script type="text/jsx">
import List from "./components/List";
import LevelFunctional from "./components/LevelFunctional";
export default {
  components: {
    LevelFunctional,
    List
  },
  methods: {
    renderItem(k, i) {
      return <span key={k}>{i}</span>
    }
  },
  data() {
    return {
      hello: "Hello World"
    };
  }
};
</script>

<style scoped></style>
