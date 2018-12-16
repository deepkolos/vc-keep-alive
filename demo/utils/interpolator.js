// viscousFluid从安卓Scroller移植
// const SCROLL_FRICTION = 0.015;
// const VISCOUS_FLUID_SCALE = 8.0;
// const VISCOUS_FLUID_NORMALIZE = 1.0 - viscousFluid(1.0);
// const VISCOUS_FLUID_OFFSET = 1.0 - VISCOUS_FLUID_NORMALIZE * viscousFluid(1.0);

// function viscousFluid(x) {
//   x *= VISCOUS_FLUID_SCALE;
//   if (x < 1.0) {
//     x -= 1.0 - Math.exp(-x);
//   } else {
//     let start = 0.36787944117; // 1/e == exp(-1)
//     x = 1.0 - Math.exp(1.0 - x);
//     x = start + x * (1.0 - start);
//   }
//   return x;
// }

export const Interpolator = {
  // viscousFluid: {
  //   style: '',
  //   fn: function(x) {
  //     let interpolated = VISCOUS_FLUID_NORMALIZE * viscousFluid(x);
  //     if (interpolated > 0) {
  //       return interpolated + VISCOUS_FLUID_OFFSET;
  //     }
  //     return interpolated;
  //   }
  // },
  easeInOutCubic: {
    style: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    fn: function(x) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
  },
  easeOutQuint: {
    style: 'cubic-bezier(0.23, 1, 0.32, 1)',
    fn: function(t) {
      return 1 + --t * t * t * t * t;
    }
  },
  easeOutQuard: {
    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fn: function(t) {
      return t * (2 - t);
    }
  },
  easeOutQuart: {
    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    fn: function(t) {
      return 1 - --t * t * t * t;
    }
  }
};
