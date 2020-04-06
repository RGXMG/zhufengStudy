<template>
  <div>
    User
    <router-link to="./home">ToUser</router-link>
  </div>
</template>

<script>
export default {
  asyncData(store) {
    console.log("user:::", store.dispatch);
    return store.dispatch("add");
  }
};
</script>

<style scoped></style>
