<template>
  <div>
    QR code here... Coming soon
    <v-text-field
      @focus="openDialog"
    />
  </div>
</template>

<script>
export default {
  mounted() {
    const options = BX24.placement?.info()

    console.log(BX24)
    console.log(options)
    console.log(this.$route.query)
  },
  methods: {
    openDialog() {
      BX24.selectUsers(() => {
        console.log(1)
      })
    }
  }
}
</script>
