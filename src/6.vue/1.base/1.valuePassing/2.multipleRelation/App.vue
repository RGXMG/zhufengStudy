<template>
  <div>
    <Parent />
  </div>
</template>

<script>
import "./bootstrap";
import Parent from "./components/Parent";
export default {
  components: {
    Parent
  },
  created() {},
  data() {
    return {
      hello: "hello world"
    };
  }
};
</script>

<style scoped></style>
