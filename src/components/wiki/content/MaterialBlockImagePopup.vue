<template>
  <v-dialog
    v-if="show"
    v-model="show"
    max-width="1500"
  >
    <v-card>
      <v-img :src="src" />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data: () => ({
    show: true
  }),
  created() {
    this.loadPopup()
    console.log(this.src)
  },
  methods: {
    async loadPopup() {
      this.show = true
    }
  }
}
</script>
