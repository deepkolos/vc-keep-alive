# vc-keep-alive

![](https://travis-ci.com/deepkolos/vc-keep-alive.svg?branch=master)

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
> 所以通过`Page`前进返回行为分析, 总结出 key 的生成规则\

### key 的生成过程

1.计算出命中路由的一级路由\
2.分析其一级路由, 把命中路由的动态路由部分拼接到一级路由的动态路由里面去

### 使用

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
