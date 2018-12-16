<style lang="scss">
.vc-colorful-div {
  color: white;
}
</style>

<template>
  <div class="vc-colorful-div" v-once :style="`background: ${$color()}`">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'vc-colorful-div'
};
</script>
