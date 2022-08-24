<template>
  <div class="pa-2">
    <page-loader v-if="!loaded" />
    <v-alert v-else-if="error" type="error" text>
      Произошла ошибка при загрузке Битрикс 24
    </v-alert>
    <slot v-else></slot>
  </div>
</template>

<script>
import LayoutMixin from '@/mixins/layout'

export default {
  mixins: [
    LayoutMixin
  ]
}
</script>
