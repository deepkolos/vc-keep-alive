<style lang="scss" scoped>
.vc-view-pager-page {
  width: 100%;
}
</style>

<template>
  <div class="vc-view-pager-page" v-swipe:vertical="{enable: false}">
    <slot v-if="inited"></slot>
  </div>
</template>

<script>
import swipeDirective from 'vue-swipe-directive';

export default {
  name: 'vc-view-pager-page',

  directives: {
    swipe: swipeDirective
  },

  props: {
    lazy: {
      type: Boolean,
      default: true
    },
    scrollMutex: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      inited: false
    };
  },

  created() {
    if (!this.lazy) this.inited = true;
  },

  mounted() {
    this.$parent && this.$parent.updatePageLen && this.$parent.updatePageLen();
  },

  methods: {
    // private methods
    init() {
      if (!this.inited) {
        this.inited = true;
        this.$emit('inited', this);
      }
    },

    enterStart() {
      this.$emit('onEnterStart');
    },

    enterEnd() {
      this.$emit('onEnterEnd');
    },

    leaveStart() {
      this.$emit('onLeaveStart');
    },

    leaveEnd() {
      this.$emit('onLeaveEnd');
    }
  }
};
</script>
