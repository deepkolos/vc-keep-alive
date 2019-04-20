import bus from './bus';
import { initPatch } from './router-patch';
import { getFirstComponentChild } from './utils';
// import { initMap, getRouterKey } from './router-map';
import { initMap } from './router-map';

let initialed = false;

function getAncestorRoute(curr) {
  while (curr.parent) curr = curr.parent;

  return curr;
}

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
      // const key = (vnode.key = getRouterKey(this.router.history.current.path));
      const key = (vnode.key = this.getRouterKey(this.router));
      console.log('TCL: render -> key', key);
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
  },

  methods: {
    getRouterKey() {
      const {
        current: { matched, path }
      } = this.router.history;
      let urlParams = [];
      let tabIndexes = [];
      const target = matched[matched.length - 1];
      const ancestorRoute = getAncestorRoute(target);
      let matchedRoute = matched
        .map(route => {
          return { route, params: route.regex.exec(path + '/') };
        })
        .filter(i => i.params !== null)[0];

      if (matchedRoute) {
        urlParams = matchedRoute.params.slice(1);

        matchedRoute.route.regex.keys.forEach((v, k) => {
          if (this.ignoreParams.includes(v.name)) {
            tabIndexes.unshift(k);
          }
        });
        tabIndexes.forEach(k => {
          urlParams.splice(k, 1);
        });
      }

      console.log('TCL: urlParams', urlParams);
      console.log('TCL: ancestorRoute', ancestorRoute);

      return ancestorRoute.path + urlParams.toString();
    }
  }
};
