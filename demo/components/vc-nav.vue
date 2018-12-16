<style lang="scss">
.nav {
  display: flex;

  .title {
    text-align: left;
  }
}
.btn-back {
  flex: none;
  margin: 15px 0px 15px 15px;
  display: flex;

  button {
    padding: 10px;
    font-size: 18px;
    border: none;
    color: white;
    background: none;
  }
}
</style>

<template>
  <div class="nav">
    <vc-colorful-div class="btn-back">
      <button @click="$router.back()">back</button>
    </vc-colorful-div>

    <div class="title" :style="`background: ${titleColor}`">{{ $route.path }}</div>
  </div>
</template>

<script>
export default {
  name: 'vc-nav',

  data() {
    return {
      titleColor: this.$color()
    };
  }
};
</script>
