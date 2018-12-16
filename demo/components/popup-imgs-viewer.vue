<style lang="scss" scoped>
.popup-imgs-viewer {
  width: 100vw;
  height: 100vh;
  position: relative;

  &-indicator {
    position: absolute;
    top: 29px;
    left: 0;
    right: 0;
    margin: 0 auto;

    font-size: 16px;

    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    text-align: center;
  }

  &-img {
    // Viewport Units Buggyfill ignore
    content: normal !important;
    width: 100vw;
    position: absolute;
    transition: all 0ms ease;
    will-change: transform, opacity;
  }

  &-img-wrapper {
    width: 100vw;
    height: 100vh;
    overflow: auto;
    position: absolute;
  }
}

.view-pager {
  height: 100%;

  &-page {
    margin-right: 16px;
  }
}
</style>

<template>
  <div class="popup-imgs-viewer">
    <vc-view-pager class="view-pager" ref="pager" v-model="pageIndex">
      <vc-view-pager-page :lazy="false" v-for="(img, i) in originalImgs" :key="i" class="view-pager-page">
        <div class="popup-imgs-viewer-img-wrapper" v-swipe:down="swipeConfig" @click="$popupCtrl.close()">
          <img class="popup-imgs-viewer-img" :src="img.src" alt="">
        </div>
      </vc-view-pager-page>
    </vc-view-pager>
    <div class="popup-imgs-viewer-indicator">{{ pageIndex + 1 }} / {{ pageLen }}</div>
  </div>
</template>

<script>
import swipeDirective from 'vue-swipe-directive';
import { transform, on, off, rFA } from '../utils/dom';

// TODO: 补丁太多了..., 后面动画还是需要接入vue的transition
// TODO: 缩放支持

const duration = '280ms';

export default {
  directives: {
    swipe: swipeDirective
  },

  props: {
    e: {
      default: null
    },
    imgs: {
      type: [Array, HTMLCollection],
      required: true
    }
  },

  data() {
    return {
      pageLen: 0,
      pageIndex: 0,
      originalImgs: []
    };
  },

  created() {
    this.popupEvt = {
      beforeEnter: () => {
        let $onSwipeImg = this.getSwipeImg(this.pageIndex);
        let $onSwipeImgStyle = transform($onSwipeImg);
        let vmPager = this.$refs.pager;

        let {
          clipTop,
          clipLeft,
          clipBottom,
          clipRight,
          clipRadius,
          translateX,
          translateY,
          scale,
          hasClip
        } = this.getAnimationSettings(this.pageIndex);

        vmPager.updateSize();

        this.$popupCtrl.vmBase.setAnimateDom($onSwipeImg);
        this.initPosition();

        $onSwipeImgStyle.transitionDuration('0s');
        $onSwipeImgStyle.transform(
          `translate3d(${translateX}px, ${translateY}px,0) scale(${scale})`
        );

        if (hasClip)
          $onSwipeImgStyle.clipPath(
            `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px round ${clipRadius})`
          );

        this.$nextTick(() => {
          rFA(() => {
            rFA(() => {
              $onSwipeImgStyle.transitionDuration(duration);
              $onSwipeImgStyle.transform('translate3d(0, 0, 0) scale(1)');
              if (hasClip)
                $onSwipeImgStyle.clipPath('inset(0px 0px 0px 0px round 0px)');
            });
          });
        });
      },
      beforeLeave: () => {
        let $onSwipeImg = this.getSwipeImg(this.pageIndex);
        let $onSwipeImgStyle = transform($onSwipeImg);

        let {
          clipTop,
          clipLeft,
          clipBottom,
          clipRight,
          clipRadius,
          translateX,
          translateY,
          scale,
          hasClip
        } = this.getAnimationSettings(this.pageIndex);

        $onSwipeImgStyle.transitionDuration('280ms');
        this.$popupCtrl.vmBase.setAnimateDom($onSwipeImg);

        if (hasClip)
          $onSwipeImgStyle.clipPath('inset(0px 0px 0px 0px round 0px)');

        rFA(() => {
          $onSwipeImgStyle.transform(
            `translate3d(${translateX}px, ${translateY}px,0) scale(${scale})`
          );
          if (hasClip)
            $onSwipeImgStyle.clipPath(
              `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px round ${clipRadius})`
            );
        });
      }
    };

    this.swipeConfig = {
      start: this.onItemSwipeStart,
      move: this.onItemSwipeMove,
      end: this.onItemSwipeDone
    };

    let e = this.e,
      self = this,
      defaultIndex;

    this.originalImgs = this.imgs;
    this.wHeight = window.innerHeight;
    this.wWidth = window.innerWidth;
    this.wRotaio = this.wWidth / this.wHeight;
    this.status = {
      swipeStartX: null,
      swipeStartY: null
    };

    if (e.targetChangeTo)
      defaultIndex = Array.prototype.indexOf.call(
        this.originalImgs,
        e.targetChangeTo
      );
    else
      defaultIndex = Array.prototype.indexOf.call(this.originalImgs, e.target);

    if (defaultIndex === -1) {
      console.log(
        'popup-img-viewer open的时候指定的img不在所导入的列表当中,检查传递的是否正确~'
      );
      defaultIndex = 0;
    }
    this.pageIndex = defaultIndex;
    this.pageLen = this.originalImgs.length;

    //关联源img的src,这个传参的问题,唉不方便啊
    this.syncImgSrc = function() {
      let $originImg = this;
      let index = Array.prototype.indexOf.call(self.originalImgs, $originImg);
      let $showImg = self.getSwipeImg(index);

      $showImg.setAttribute('src', $originImg.getAttribute('src'));
      self.initPosition(index);
    };
    Array.prototype.forEach.call(this.imgs, $img => {
      on($img, 'load', this.syncImgSrc);
    });
  },

  destory() {
    this.imgs.forEach($img => {
      off($img, 'load', this.syncImgSrc);
    });
  },

  methods: {
    getAnimationSettings(index) {
      let wHeight = this.wHeight,
        wWidth = this.wWidth,
        wRotaio = this.wRotaio,
        scale,
        translateX,
        translateY,
        triggeredImgCenterX,
        triggeredImgCenterY,
        zoomedImgCenterX,
        zoomedImgCenterY,
        clipTop,
        clipRight,
        clipBottom,
        clipLeft,
        clipRadius,
        hasClip,
        clipRightVals,
        $img = this.originalImgs[index],
        iRatio = $img.naturalWidth / $img.naturalHeight,
        imgRect = $img.getBoundingClientRect(),
        contianerRect = $img.parentElement.getBoundingClientRect(),
        containerStyle = getComputedStyle($img.parentElement);

      //生成开始位置
      scale = imgRect.width / wWidth;
      zoomedImgCenterX = wWidth / 2;
      zoomedImgCenterY = iRatio > wRotaio ? wHeight / 2 : wWidth / iRatio / 2;
      triggeredImgCenterX = imgRect.left + imgRect.width / 2;
      triggeredImgCenterY = imgRect.top + imgRect.height / 2;

      //然后做动画偏移, 需要区分布局偏移
      translateX = triggeredImgCenterX - zoomedImgCenterX;
      translateY = triggeredImgCenterY - zoomedImgCenterY;

      //设置clip-path
      clipTop = contianerRect.top - imgRect.top;
      clipLeft = contianerRect.left - imgRect.left;
      clipBottom = imgRect.bottom - contianerRect.bottom;
      clipRight = imgRect.right - contianerRect.right;
      clipRadius = containerStyle.borderRadius;

      clipTop = clipTop > 0 ? clipTop / scale : 0;
      clipLeft = clipLeft > 0 ? clipLeft / scale : 0;
      clipBottom = clipBottom > 0 ? clipBottom / scale : 0;
      clipRight = clipRight > 0 ? clipRight / scale : 0;

      //clipRadius放大麻烦一丢丢, 仅仅px, 先是最简单版本
      clipRightVals = clipRadius.split(' ');

      clipRightVals.forEach((val, i) => {
        //提取数值
        let num = parseFloat(val);
        let unit = val.replace(num.toString(), '');

        if (unit !== '%') {
          num /= scale;
          clipRightVals[i] = num + unit;
        }
      });
      clipRadius = clipRightVals.join(' ');

      hasClip =
        clipTop !== 0 ||
        clipLeft !== 0 ||
        clipBottom !== 0 ||
        clipRight !== 0 ||
        clipRadius !== '0px';

      return {
        clipTop: clipTop,
        clipLeft: clipLeft,
        clipBottom: clipBottom,
        clipRight: clipRight,
        clipRadius: clipRadius,
        translateX: translateX,
        translateY: translateY,
        scale: scale,
        hasClip: hasClip
      };
    },

    getSwipeImg(index) {
      return this.$refs.pager.$refs.container.children[index].children[0]
        .children[0];
    },

    initPosition(index) {
      let i,
        iRatio,
        iHeight,
        iWidth,
        $img,
        $imgZoom,
        $imgZoomStyle,
        fromTop,
        wHeight = this.wHeight,
        wWidth = this.wWidth,
        wRotaio = this.wRotaio;

      let ajustOne = i => {
        $img = this.originalImgs[i];
        $imgZoom = this.getSwipeImg(i);
        $imgZoomStyle = transform($imgZoom);
        iHeight = $img.naturalHeight;
        iWidth = $img.naturalWidth;
        iRatio = iWidth / iHeight;

        //生成结束位置
        if (iRatio > wRotaio) {
          //设置垂直居中
          fromTop = (wHeight - (wWidth / iWidth) * iHeight) / 2;
        } else {
          // 设置自然布局
          fromTop = 0;
          $imgZoom.overHeight = true;
        }

        //设置的是swiper里面的图片
        $imgZoom.style.top = fromTop + 'px';
        $imgZoomStyle.clipPath('inset(0px 0px 0px 0px 0px)');
      };

      if (index !== undefined) ajustOne(index);
      else for (i = 0; i < this.originalImgs.length; i++) ajustOne(i);

      $img = null;
    },

    onItemSwipeStart(info) {
      let $item = info.element;
      let $img = $item.children[0];
      let $imgStyle = transform($img);

      $imgStyle.transitionDuration('0ms');
      $imgStyle.transformOrigin($img.overHeight ? 'center 17%' : '');

      this.$popupCtrl.vmBase.trunOffMaskTransition();

      if ($item.scrollTop !== 0) {
        this.swipeStartX = info.movingX;
        this.swipeStartY = info.movingY;
      } else {
        $item.style.overflow = 'hidden';
      }
    },

    onItemSwipeMove(info, lock) {
      let scale,
        x,
        y,
        $item = info.element,
        $img = $item.children[0],
        $imgStyle = transform($img);

      if ($item.scrollTop !== 0) {
        this.swipeStartX = info.movingX;
        this.swipeStartY = info.movingY;
      } else {
        lock(true);

        y = info.movingY - (this.swipeStartY || info.startY);
        x = info.movingX - (this.swipeStartX || info.startX);

        if (info.directionFour === 'down') scale = 1 - y / this.wWidth;
        else scale = 1;

        scale < 0 && (scale = 0);

        rFA(() => {
          $imgStyle.transform(`translate3d(${x}px, ${y}px,0) scale(${scale})`);
          this.$popupCtrl.vmBase.setMaskOpacity(scale);
        });
      }
    },

    onItemSwipeDone(info) {
      let $item = info.element,
        $img = $item.children[0],
        $imgStyle = transform($img),
        y = info.movingY - (this.swipeStartY || info.startY);

      this.swipeStartX = null;
      this.swipeStartY = null;

      requestAnimationFrame(() => {
        $imgStyle.transform('');
        $imgStyle.transformOrigin('');
        $imgStyle.transitionDuration(duration);
        this.$popupCtrl.vmBase.setMaskOpacity(1);
        this.$popupCtrl.vmBase.trunOnMaskTransition();
      });

      if (
        info.directionFour === 'down' &&
        $item.scrollTop === 0 &&
        y >= 284 / 3
      ) {
        this.$popupCtrl.close();
      } else {
        $item.style.overflow = '';
      }
    }
  }
};
</script>
