import Vue from 'vue';
import App from './pages/app';
import router from './router';
import VcKeepAlive from 'vc-keep-alive';
import VcPopupBase from 'vc-popup-base';

import './components';
import './styles/reset';
import './styles/component';
import './styles/animations';

Vue.use(VcKeepAlive);
Vue.use(VcPopupBase);

function random(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}
Vue.prototype.$color = () => {
  return `rgb(${random(0, 180)}, ${random(0, 180)}, ${random(0, 180)})`;
};

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
