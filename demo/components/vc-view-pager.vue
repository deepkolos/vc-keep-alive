<style lang="scss" scoped>
.vc-view-pager {
  width: 100%;
  overflow: hidden;

  &-pages {
    height: 100%;
    display: flex;
  }

  /deep/ &-page {
    flex: 0 0 100%;
  }

  &[data-state='active'] & {
    &-pages {
      will-change: transform;
    }
  }
}
</style>

<template>
  <div class="vc-view-pager" v-swipe:horizonal.lock="swipeConf" :data-state="state">
    <div class="vc-view-pager-pages" ref="container">
      <slot></slot>
    </div>
    <div class="vc-view-pager-indicators" ref="indicators">
      <slot name="indicator"></slot>
    </div>
  </div>
</template>

<script>
import swipeDirective from 'vue-swipe-directive';
import { api as shadowIndicator } from './vc-view-pager-indicator';

import {
  on,
  off,
  tranX,
  getNow,
  transform,
  rFAWithLock as rFA
} from '../utils/dom';

const OVERFLOW_RATIO = 288 / 3 / 360;
const STATE_OPTIONS = ['active', 'inactive'];
const OVERFLOW_OPTIONS = ['default', 'none'];

const calcCanJump = (info, vm) => Math.abs(info.offset) / vm.pageWidth > 0.15;
const calcIsJumpNext = info => info.offset < 0;

export default {
  name: 'vc-view-pager',

  directives: {
    swipe: swipeDirective
  },

  props: {
    duration: {
      type: Number,
      default: 280
    },
    value: {
      type: Number,
      default: 0
    },
    overflow: {
      type: String,
      default: OVERFLOW_OPTIONS[0],
      validator: i => OVERFLOW_OPTIONS.includes(i)
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    delay: {
      type: Number,
      default: 3000
    },
    initAround: {
      type: Number,
      default: 1
    },
    state: {
      type: String,
      default: STATE_OPTIONS[0],
      validator: i => STATE_OPTIONS.includes(i)
    },
    dev: Boolean
    // continuous: {
    //   type: Boolean,
    //   default: false
    // },
  },

  data() {
    return {
      pageLen: 0,
      gapWidth: 0,
      pageIndex: 0,
      pageWidth: 0
    };
  },

  created() {
    this.swipeConf = {
      cancel: this.onSwipeCancel,
      start: this.onSwipeStart,
      move: this.onSwipeMove,
      end: this.onSwipeDone
    };
  },

  destroyed() {
    off(window, 'resize', this.onWindowResize);
  },

  mounted() {
    this.$can = this.$refs.container;
    this.$canStyle = transform(this.$can);
    this.$pages = this.$refs.container.children;
    this.$indicators = this.$refs.indicators.children;
    this.initialized = false;
    this.vmPages = [];
    this.vmIndicators = [];
    this.swipeStartTime = 0;
    this.currSwipeOffset = 0;
    this.pageIndex = this.value;
    this.durationAdjusted;

    this.updateSize();
    this.updatePageLen();
    // this.initPageAround(this.pageIndex);
    // 初始化的时候子项全部 mounted 完毕才会到这里mounted
    // 但是因为依赖的引用没有初始化所以还是需要在这里计算一次

    // 初始化
    if (this.vmPages[this.pageIndex]) {
      this.vmPages[this.pageIndex].enterEnd();
      this.vmIndicators[this.pageIndex].enterEnd();
    }

    this.planNext();
    this.$nextTick(() => {
      // TODO: 这里有不明确的执行流耦合
      this.initialized = true;
    });

    this.onWindowResize = () => {
      this.updateSize();
      setTimeout(() => this.updateSize(), 500);
    };

    on(window, 'resize', this.onWindowResize);
  },

  computed: {
    maxSwipeOffset() {
      return -this.swipeWidth * (this.pageLen - 1);
    },
    swipeOffset() {
      return -this.swipeWidth * this.pageIndex;
    },
    swipeWidth() {
      return this.pageWidth + this.gapWidth;
    },
    isFirst() {
      return this.pageIndex === 0;
    },
    isLast() {
      return this.pageIndex === this.pageLen - 1;
    }
  },

  watch: {
    value(val) {
      this.pageIndex = val;
    },

    pageIndex(val, old) {
      this.lastIndex = old;
      this.$emit('input', val);
      this.initPageAround(val);
      this.animate();
      this.initialized = true;
    },

    autoPlay() {
      this.loopTimer &&
        (!this.autoPlay || this.state === 'inactive') &&
        clearTimeout(this.loopTimer);
    },

    state(val) {
      if (val === 'active') {
        this.planNext();
      }
    }
  },

  methods: {
    updateSize() {
      this.pageWidth = this.$can.getBoundingClientRect().width;

      if (this.$pages.length > 1) {
        let firstRight = this.$pages[0].getBoundingClientRect().right;
        let secondLeft = this.$pages[1].getBoundingClientRect().left;
        this.gapWidth = secondLeft - firstRight;
      }

      // 初始化/同步 位置
      this.$nextTick(() => this.$canStyle.transform(tranX(this.swipeOffset)));
    },

    updatePageLen() {
      if (this.$pages) {
        this.pageLen = this.$pages.length;
        this.vmPages = Array.prototype.map.call(
          this.$pages,
          $page => $page.__vue__
        );
        this.vmIndicators = [];
        for (let i = 0; i < this.pageLen; i++) {
          this.vmIndicators.push(
            this.$indicators[i] ? this.$indicators[i].__vue__ : shadowIndicator
          );
        }
        this.initPageAround(this.pageIndex);
      }
    },

    // private method
    initPageAround(index) {
      let curr = this.vmPages[index];
      let aroundVms = [];

      for (var i = 1; i <= this.initAround; i++) {
        aroundVms.push(this.vmPages[index - i]);
        aroundVms.push(this.vmPages[index + i]);
      }

      curr && curr.init();
      aroundVms.forEach(vm => vm && vm.init());
    },

    onSwipeStart() {
      this.$canStyle.transitionDuration('0s');
      this.swipeStartTime = getNow();
      this.loopTimer && clearTimeout(this.loopTimer);
      this.startSwipeOffset = this.currSwipeOffset || this.swipeOffset;
      this.lastAnimator && this.lastAnimator.cancel();
    },

    onSwipeMove(info) {
      let isJumpNext = calcIsJumpNext(info);

      let isLast = this.isLast;
      let isFirst = this.isFirst;
      let isCommitting = this.isCommitting;
      let nextSwipeOffset = this.swipeOffset;

      // 跟手的时候
      if (
        (isJumpNext && !isLast) ||
        (!isJumpNext && !isFirst) ||
        isCommitting
      ) {
        // nextSwipeOffset = this.startSwipeOffset + info.offset;
        nextSwipeOffset = this.swipeOffset + info.offset;
      }

      // 溢出的时候
      // if (!isInRange(nextSwipeOffset, this.maxSwipeOffset, 0)) {
      if ((isJumpNext && isLast) || (!isJumpNext && isFirst)) {
        if (this.overflow === 'default')
          nextSwipeOffset = this.swipeOffset + info.offset * OVERFLOW_RATIO;

        if (this.overflow === 'none') nextSwipeOffset = this.swipeOffset;
      }

      rFA(() => {
        this.currSwipeOffset = nextSwipeOffset;
        this.$canStyle.transform(tranX(nextSwipeOffset));

        this.dev && console.log(nextSwipeOffset);
      });
      this.loopTimer && clearTimeout(this.loopTimer);
    },

    onSwipeDone(info) {
      let canJump = calcCanJump(info, this);
      let isJumpNext = calcIsJumpNext(info);

      let isLast = this.isLast;
      let isFirst = this.isFirst;
      let lastIndex = this.pageIndex;
      let commitingIndex = lastIndex;

      // 停留原本页面
      // if (!canJump) {
      //   commitingIndex = lastIndex;
      // }
      // 满足下一页条件
      if (canJump && isJumpNext && !isLast) {
        commitingIndex = lastIndex + 1;
      }
      // 满足上一页的条件
      if (canJump && !isJumpNext && !isFirst) {
        commitingIndex = lastIndex - 1;
      }

      // 左溢出条件
      if (!isJumpNext && isFirst) {
        // do nothing
        // TODO: 如果是循环的话
      }
      // 右溢出条件
      if (isJumpNext && isLast) {
        // do nothing
      }

      commitingIndex !== undefined &&
        rFA(() => {
          this.lastIndex = this.pageIndex;
          this.triggerFromSwipe = true;
          this.durationAdjusted = this.adjustDuration(info);
          this.pageIndex = commitingIndex;

          lastIndex === commitingIndex && this.animate();
          lastIndex === commitingIndex &&
            this.$nextTick(() => {
              this.vmPages[this.lastIndex].leaveStart();
              this.vmPages[this.pageIndex].enterStart();
              this.vmIndicators[this.lastIndex].leaveStart();
              this.vmIndicators[this.pageIndex].enterStart();
            });
        });
    },

    onSwipeCancel() {
      this.lastAnimator && this.lastAnimator.finish();
    },

    // 过度动画结束
    onFlingDone() {
      this.initPageAround(this.pageIndex);

      this.vmPages[this.lastIndex].leaveEnd();
      this.vmPages[this.pageIndex].enterEnd();
      this.vmIndicators[this.lastIndex].leaveEnd();
      this.vmIndicators[this.pageIndex].enterEnd();
    },

    animate() {
      let duration = this.initialized
        ? this.durationAdjusted || this.duration
        : 0;

      this.$canStyle.transitionDuration(duration + 'ms');
      this.durationAdjusted = null;

      this.planNext();

      this.$canStyle.transform(tranX(this.swipeOffset)).then(this.onFlingDone);

      if (this.currSwipeOffset === this.swipeOffset) return;

      this.dev && console.log('duration', duration);

      this.isCommitting = duration > 0;

      // this.lastAnimator = animate(
      //   { x: this.currSwipeOffset },
      //   { x: destination },
      //   duration,
      //   curr => {
      //     this.$canStyle.transform(tranX(curr.x));
      //     this.currSwipeOffset = curr.x;
      //     this.dev && console.log(curr.x);

      //     if (
      //       (this.lastIndex > this.pageIndex && curr.x > this.swipeOffset) ||
      //       (this.lastIndex < this.pageIndex && curr.x < this.swipeOffset)
      //     ) {
      //       this.isCommitting = false;
      //       this.lastAnimator && this.lastAnimator.cancel();
      //       this.$canStyle.transform(tranX(this.swipeOffset));
      //     }
      //   },
      //   this.triggerFromSwipe
      //     ? Interpolator.easeOutQuint.fn
      //     : Interpolator.easeInOutCubic.fn
      // ).then(this.onFlingDone);

      // this.triggerFromSwipe = false;

      !this.initialized && rFA(this.onFlingDone);
    },

    adjustDuration(info) {
      let duration = this.duration;
      let swipeTime = getNow() - this.swipeStartTime;
      let offsetToAnimate, swipeOffset, _duration;
      // let durationOfAnimate, avgSwipeDuration

      if (info) {
        swipeOffset = Math.abs(info.offset);
        offsetToAnimate = this.pageWidth - swipeOffset;
        // avgSwipeDuration = swipeOffset / swipeTime
        // durationOfAnimate = offsetToAnimate * avgSwipeDuration

        _duration = (offsetToAnimate / (swipeOffset / swipeTime)) * 1.2;

        if (_duration > 1.6 * duration) _duration = 1.6 * duration;

        if (_duration < 0.5 * duration) _duration = 0.5 * duration;
        duration = _duration;
      }

      return duration;
    },

    planNext() {
      if (this.autoPlay && this.state === 'active') {
        this.loopTimer && clearTimeout(this.loopTimer);
        this.loopTimer = setTimeout(() => {
          if (this.state !== 'active') return;

          if (this.pageIndex < this.pageLen - 1) {
            this.pageIndex++;
          } else {
            this.pageIndex = 0;
          }
        }, this.delay);
      }
    }
  }
};
</script>
