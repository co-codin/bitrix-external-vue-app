<template>
  <component :is="icon" v-bind="$attrs"></component>
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
    dir() {
      return this.solid ? 'solid' : 'outline'
    },
    icon() {
      return () => import('@/assets/icons/' + this.dir + '/' + this.name + '.svg')
    }
  }
}
</script>
