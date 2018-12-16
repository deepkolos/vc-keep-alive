<template>
  <div class="page">
    <vc-nav />

    <div class="list">
      <vc-colorful-div v-for="(item, i) in tabs" :key="i">
        <router-link :to="item" replace class="list-item">
          {{ item }} {{ i === 0 ? ' default' : ''}}
        </router-link>
      </vc-colorful-div>
    </div>

    <div class="list">
      <vc-colorful-div v-for="(item, i) in others" :key="i">
        <router-link :to="item" class="list-item">
          {{ item }}
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
    const id = this.$route.params.id;
    return {
      tabs: [`/page-1/tab-0/${id}`, `/page-1/tab-1/${id}`],
      others: [`/page-1/${~~id + 1}`]
    };
  },

  created() {
    console.log('page-0 created');
  }
};
</script>
