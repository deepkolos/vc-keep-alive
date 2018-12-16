import bus from './bus';
import { initPatch } from './router-patch';
import { getFirstComponentChild } from './utils';
import { initMap, getRouterKey } from './router-map';

let initialed = false;

export default {
  name: 'vc-keep-alive',
  abstract: true,

  props: {
    ignorePaths: [Array, String, RegExp],
    ignoreParams: [Array, String]
  },

  created() {
    this.router = this._routerRoot._router;
    this.cache = Object.create(null);
    this.isBackward = false;
    this.backwardParams;

    bus.on('backward', params => {
      this.isBackward = true;
      this.backwardParams = params;
    });
    ['forward', 'backward', 'replace', 'init'].forEach(state => {
      bus.on(state, params => {
        this.$emit(state, params);
      });
    });

    if (initialed) return;
    initMap(this.router, this.ignoreParams);
    initPatch(this.router, this.ignorePaths);
    initialed = true;
  },

  destroyed() {
    for (const cached of this.cache) {
      if (cached && cached.componentInstance)
        cached.componentInstance.$destroy();
    }
  },

  render() {
    const slot = this.$slots.default;
    const vnode = getFirstComponentChild(slot);
    const componentOptions = vnode && vnode.componentOptions;
    const { fromRouterKey, nextRouterKey } = this.backwardParams || {};

    if (componentOptions) {
      const cache = this.cache;
      const key = (vnode.key = getRouterKey(this.router.history.current.path));
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;

        if (
          this.isBackward &&
          fromRouterKey !== nextRouterKey &&
          cache[fromRouterKey]
        ) {
          cache[fromRouterKey].componentInstance.$destroy();
          this.isBackward = false;
          this.backwardParams = null;
          cache[fromRouterKey] = null;
        }
      } else {
        cache[key] = vnode;
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0]);
  }
};
