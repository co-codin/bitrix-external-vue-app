<template>
  <v-alert :type="type" :color="color">
    {{ message }}
  </v-alert>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    color: {
      type: String || null,
      default: null
    }
  }
}
</script>
