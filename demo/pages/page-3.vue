<style lang="scss" scoped>
</style>

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

    <vc-view-pager v-model="currTab" overflow="none">
      <vc-view-pager-page>
        <div class="block">
          <vc-colorful-div class="content">
            content of /page-2/tab-0<br>
            向左滑动试试<br>
          </vc-colorful-div>
        </div>
      </vc-view-pager-page>

      <vc-view-pager-page>
        <div class="block">
          <vc-colorful-div class="content">
            content of /page-2/tab-1<br>
            刷新后再向右滑动试试
          </vc-colorful-div>
        </div>
      </vc-view-pager-page>
    </vc-view-pager>
  </div>
</template>

<script>
export default {
  data() {
    const id = this.$route.params.id;
    return {
      currTab: 0,
      tabs: [`/page-3/tab-0/${id}`, `/page-3/tab-1/${id}`],
      others: [`/page-3/${~~id + 1}`]
    };
  },

  created() {
    this.updateTab();
  },

  watch: {
    currTab() {
      this.updatePath();
    },
    $route() {
      this.updateTab();
    }
  },

  methods: {
    updateTab() {
      let tab = -1;
      let currPath = this.$route.path;
      this.tabs.every((path, i) => {
        if (currPath === path) {
          tab = i;
          return false;
        }
        return true;
      });
      if (~tab) this.currTab = tab;
    },
    updatePath() {
      if (this.$route.path !== this.tabs[this.currTab]) {
        this.$router.replace(this.tabs[this.currTab]);
      }
    }
  }
};
</script>
