<template>
  <div class="page">
    <vc-colorful-div class="title">
      vc-keep-alive
    </vc-colorful-div>

    <div class="list">
      <vc-colorful-div v-for="(item, i) in items" :key="i">
        <router-link :to="item.link" class="list-item">
          {{ item.link }}<br>
          <template v-if="item.partern">
            {{ item.partern }}<br>
          </template>
          {{ item.text }}
        </router-link>
      </vc-colorful-div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          link: '/page-0',
          text: '包含子路由静态路由'
        },
        {
          link: '/page-1/0',
          partern: '/page-1/:id/',
          text: '包含子路由动态路由'
        },
        {
          link: '/page-2',
          partern: '/page-2/:pagerTab?/',
          text: '子路由不使用router-view控制的静态路由'
        },
        {
          link: '/page-3/0',
          partern: '/page-3/:id/:pagerTab?/',
          text: '子路由不使用router-view控制的动态路由'
        },
        {
          link: '/page-4',
          text: '忽略功能性路由, 比如vc-popup的返回键支持'
        }
      ]
    };
  },

  created() {
    console.log('home created');
  }
};
</script>
