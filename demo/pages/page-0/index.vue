<template>
  <div class="page">
    <vc-nav />

    <div class="list">
      <vc-colorful-div v-for="(item, i) in items" :key="i">
        <router-link :to="item.link" replace class="list-item">
          {{ item.link }} {{ i === 0 ? ' default' : ''}}
        </router-link>
      </vc-colorful-div>
    </div>

    <div class="block">
      no-keep-alive
    </div>
    <router-view />

    <div class="block">
      with-keep-alive
    </div>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          link: '/page-0/tab-0'
        },
        {
          link: '/page-0/tab-1'
        }
      ]
    };
  },

  created() {
    console.log('page-0 created');
  }
};
</script>
