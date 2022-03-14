<template>
  <div @click="$emit('click', $event)" v-html="require(`assets/icons/${name}.svg?raw`)"></div>
</template>
<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
