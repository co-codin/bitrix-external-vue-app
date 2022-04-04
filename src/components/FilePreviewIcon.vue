<template>
  <v-card class="file-preview-icon">
    <div class="pa-2">
      <v-img
        class="mx-auto"
        width="100"
        height="100"
        :src="icon"
        @error="handleError"
      />
    </div>
    <v-divider />
    <div class="py-1 px-2 text-caption">
      <slot></slot>
    </div>
  </v-card>
</template>

<script>

export default {
  props:  {
    extension: {
      type: String,
      required: true
    }
  },
  data: () => ({
    hasError: false
  }),
  computed: {
    icon() {
      if (this.hasError) {
        return '/icons/file-extensions/file.svg'
      } else {
        return `/icons/file-extensions/${this.extension}.svg`
      }
    }
  },
  methods: {
    handleError(error) {
      if (error) {
        this.hasError = true
      }
    }
  }
}
</script>

<style>
.file-preview-icon {
  max-width: 200px;
}
</style>
