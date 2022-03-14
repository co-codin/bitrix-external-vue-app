<template>
  <div>
    <v-card loading>
      <v-card-text class="text-caption">
        {{ message }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: 'Идет загрузка...'
    }
  }
}
</script>
