<template>
  <div class="display-1 mb-1">{{ h1 }}</div>
</template>

<script>
export default {
  props: {
    h1: {
      type: String,
      required: true
    }
  }
}
</script>
