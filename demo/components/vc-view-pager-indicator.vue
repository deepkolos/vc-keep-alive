<template>
  <div :class="`vc-view-pager-indicator ${state}`" @click="onClick">
    <slot></slot>
  </div>
</template>

<script>
const nop = () => {};
export const api = ['enterStart', 'enterEnd', 'leaveStart', 'leaveEnd'].reduce(
  (obj, curr) => {
    obj[curr] = nop;
    return obj;
  },
  {}
);

export default {
  name: 'vc-view-pager-indicator',
  data() {
    return {
      state: ''
    };
  },
  methods: {
    // private methods
    onClick() {},
    enterStart() {
      this.state = 'enter-start';
    },

    enterEnd() {
      this.state = 'enter-end';
    },

    leaveStart() {
      this.state = 'leave-start';
    },

    leaveEnd() {
      this.state = 'leave-end';
    }
  }
};
</script>
