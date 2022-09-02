<template>
  <ul class="toc-list">
    <li v-for="(item, index) in items" :key="index">
      <a @click="goTo(`block-${item.id}`)">{{ item.name }}</a>
      <table-of-contents v-if="item.children && item.children.length" :items="item.children"/>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TableOfContents',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    scrollOptions: {
      duration: 450,
      offset: 15,
      easing: 'easeInOutCubic'
    }
  }),
  methods: {
    goTo(section) {
      this.$vuetify.goTo(`#${section}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.toc-list {
  counter-reset: item;
  margin-top: 10px;
  padding-left: 5px;

  .toc-list {
    padding-left: 20px;
  }

  a {
    text-decoration: none;
    border-bottom: 1px solid #0096c7;
  }

  li {
    display: block;
    font-size: 16px;
    margin-bottom: 10px;
  }

  li:before {
    //content: counters(item, ".") ". ";
    //counter-increment: item
  }
}
</style>
