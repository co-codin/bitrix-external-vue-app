<template>
  <div>
    <div class="display-1">{{ h1 }}</div>
    <v-breadcrumbs :items="allBreadcrumbs" class="pa-0 pt-1 pb-3" />
  </div>
</template>

<script>
export default {
  props: {
    h1: {
      type: String,
      required: true
    },
    breadcrumbs: {
      type: Array,
      default: () => []
    },
    showHomeLink: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    homeLink: {
      text: 'MEDEQ Application',
      to: { name: 'home' }
    }
  }),
  computed: {
    allBreadcrumbs() {
      if (!this.showHomeLink) {
        return this.breadcrumbs.map((item) => {
          item.exact = true

          return item
        })
      }

      return [this.homeLink].concat(this.breadcrumbs).map((item) => {
        item.exact = true

        return item
      })
    }
  }
}
</script>
