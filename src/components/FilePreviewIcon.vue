<template>
  <v-card class="file-preview-icon">
    <div class="pa-2">
      <v-img class="mx-auto" width="100" height="100" :src="icon" />
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
  computed: {
    formattedExtension() {
      const lookupTable = {
        jpeg: 'jpg'
      }
      let extension = this.extension.toLowerCase()

      if (extension in lookupTable) {
        extension = lookupTable[extension]
      }

      return extension
    },
    icon() {
      return `/icons/file-extensions/${this.extension}.svg`
    }
  }
}
</script>

<style>
.file-preview-icon {
  max-width: 200px;
}
</style>
