# vc-keep-alive

![](https://travis-ci.com/deepkolos/vc-keep-alive.svg?branch=master)

[线上 Demo](https://deepkolos.github.io/vc-keep-alive/)

<div style="width: 250px; margin: 0 auto;">
  <img src="https://upload-images.jianshu.io/upload_images/252050-acdf854f3a00d3b0.gif?imageMogr2/auto-orient/strip"/>
</div>

> 改变了`keepAlive`的缓存机制, 可以像 APP 那样`前进重建`, `返回销毁`\
> 不过目前仅仅用于`Page`级别, 也就是一级路由, 其他级路由似乎没有需要\
> 原本的`keepAlive`默认是以`componentName`来做缓存的 key\
> 当然如果有`vnode.key`的话则会使用`vnode.key`, 所以网上很多通过`$route.fullPath`当作 key\
> 可以实现`params/query`的变更新建组件, 但是无法做到返回销毁\
> 如果使用`$destroy()`去手动销毁, 但是`keepAlive`里面还是存在缓存标记\
> 导致从 3 级路由返回到 2 级路由时拿缓存的`instance`是失效的, 进而导致重建\
> 所以通过`Page`前进返回行为分析, 总结出 key 的生成规则

# 解决的痛点

0. 子路由的更新和父级路由无关, 所以一级路由的缓存 key 是命中路由的父一级路由相关, 目前是父路由的 path + 父子路由相同的 params
1. 还有就是自己功能性路由的支持
1. 0. 比如使用支持返回键的 imgsViewer, 需要 history 压栈而不触发 forward/backward 事件, 所以提供了 ignorePaths 参数
1. 1. 比如子路由不适用 router-view 来渲染, 而是使用 view-pager 来自行控制,
      支持左右滑动切换, 如果 view-pager 的页面状态是需要保存到 url, 则需要一级路由的一个动态路由占位符, 充当子路由, 所以提供了 ignoreParams 参数

### 使用

```shell
npm install vc-keep-alive
```

```vue
<template>
  <div id="app" :class="pageAct">
    <transition name="page-slide">
      <vc-keep-alive
        :ignorePaths="ignorePaths"
        :ignoreParams="ignoreParams"
        @init="log('init', $event);"
        @forward="log('forward', $event);"
        @replace="log('replace', $event);"
        @backward="log('backward', $event);"
      >
        <router-view />
      </vc-keep-alive>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue';
import VcKeepAlive from 'vc-keep-alive';

Vue.use(VcKeepAlive);

export default {
  data() {
    return {
      pageAct: '',
      ignorePaths: ['popup='],
      ignoreParams: ['pagerTab']
    };
  },

  methods: {
    log(act, args) {
      console.log(act, args);
      this.pageAct = 'page-' + act;
    }
  }
};
</script>
```
