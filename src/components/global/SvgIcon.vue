<template>
  <component :is="icon.component"></component>
</template>

<script>

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    solid: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    icon() {
      return {
        component: () => import('@/assets/icons/' + this.name + '.svg')
      }
    }
  }
}
</script>
