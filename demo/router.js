import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const page = view => {
  view instanceof Array && (view = view[0]);

  return require(`./pages/${view}`).default;
};

const cfg = {
  mode: 'hash',
  routes: [
    // 首页
    {
      alias: '/',
      path: '/home',
      component: page`home`
    },

    // 包含子路由静态路由
    {
      path: '/page-0',
      component: page`page-0`,
      children: [
        {
          alias: '',
          path: 'tab-0',
          component: page`page-0/tab-0`
        },
        {
          path: 'tab-1',
          component: page`page-0/tab-1`
        }
      ]
    },

    // 包含子路由动态路由
    {
      path: '/page-1/:id/',
      component: page`page-1`,
      children: [
        {
          alias: '',
          path: '/page-1/tab-0/:id/',
          component: page`page-1/tab-0`
        },
        {
          path: '/page-1/tab-1/:id/',
          component: page`page-1/tab-1`
        }
      ]
    },

    // 子路由不使用router-view控制的路由, 比如使用view-pager做控制的
    {
      path: '/page-2/:pagerTab?/',
      component: page`page-2`
    },
    {
      path: '/page-3/:pagerTab?/:id/',
      component: page`page-3`
    },

    // 忽略功能性路由, 比如vc-popup的返回键支持
    {
      path: '/page-4',
      component: page`page-4`
    }
  ]
};

export default new VueRouter(cfg);
