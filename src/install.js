import VcKeepAlive from './vc-keep-alive';

const version = process.VERSION;
const install = function(Vue) {
  if (install.installed) return;
  Vue.component(VcKeepAlive.name, VcKeepAlive);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  version,
  VcKeepAlive
};
