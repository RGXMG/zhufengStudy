<template>
  <div>
    <Parent />
  </div>
</template>

<script>
import Parent from "./components/Parent";
export default {
  components: {
    Parent
  },
  data() {
    return {
      hello: "hello world"
    };
  }
};
</script>

<style scoped></style>
