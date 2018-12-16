<style lang="scss" scoped>
#app {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  & > div:nth-child(2) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: white;
  }
}
</style>

<template>
  <div id="app" :class="pageAct">
    <transition name="page-slide">
      <vc-keep-alive :ignoreParams="ignoreParams" :ignorePaths="ignorePaths" @forward="log('forward', $event)" @backward="log('backward', $event)" @replace="log('replace', $event)" @init="log('init', $event)">
        <router-view />
      </vc-keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageAct: '',
      ignorePaths: ['popup='],
      ignoreParams: ['pagerTab']
    };
  },

  methods: {
    log(act, args) {
      console.log(act, args);
      this.pageAct = 'page-' + act;
    }
  }
};
</script>
