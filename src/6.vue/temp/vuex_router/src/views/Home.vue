<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div>{{ $store.state.name }}</div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home"
};
</script>
