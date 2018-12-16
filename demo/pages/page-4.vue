<style lang="scss">
.gallery {
  display: flex;
  justify-content: space-between;

  &-item {
    height: 100px;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    img {
      width: 100%;
    }
  }
}
</style>

<template>
  <div class="page">
    <vc-nav />

    <vc-colorful-div class="block content" style="margin-top: 0;">
      可以查看sessionStorage<br>
      包含popup=不会压入栈
    </vc-colorful-div>

    <div class="gallery block" ref="gallery">
      <vc-colorful-div class="gallery-item">
        <img src="https://cn.vuejs.org/images/logo.png" alt="">
      </vc-colorful-div>

      <vc-colorful-div class="gallery-item">
        <img src="https://angular.io/assets/images/logos/angular/angular.svg" alt="">
      </vc-colorful-div>

      <vc-colorful-div class="gallery-item">
        <img src="https://cdn.idevie.com/wp-content/uploads/2015/12/React.js_logo.svg_.png" alt="">
      </vc-colorful-div>
    </div>
  </div>
</template>

<script>
import '../popups/imgs-viewer';
import { on, off } from '../utils/dom';

export default {
  mounted() {
    this.$imgs = this.$refs.gallery.getElementsByTagName('img');
    Array.prototype.forEach.call(this.$imgs, $img =>
      on($img, 'click', this.openViewer)
    );
    this.popupImgsViewer = new this.$popup.ImgsViewer({
      propsData: {
        imgs: this.$imgs
      }
    });
  },

  destroyed() {
    Array.prototype.forEach.call(this.$imgs, $img =>
      off($img, 'click', this.openViewer)
    );
  },

  methods: {
    openViewer(e) {
      this.popupImgsViewer.open(e);
    }
  }
};
</script>
