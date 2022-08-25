<template>
  <div ref="layout" class="pa-2">
    <slot></slot>
  </div>
</template>

<script>
export default {
  components: {
  },
  async mounted() {
    await this.$store.dispatch('user/loadCurrentUserDataAction')
  },
  methods: {

  }
}
</script>

<style lang="scss">
.academy-content {
  background: white;
  &__sidebar {
    background: #f2f5f8;
  }
  &__main > div {
  }
}
</style>
