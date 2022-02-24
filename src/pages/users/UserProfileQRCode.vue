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
      BX24.selectCRM({
        entityType: ['lead', 'contact', 'company', 'deal', 'quote'],
        multiple: true,
        value: { lead:[1348,2,35], contact:[2], company:[4,3], deal:[1,2], quote:[1] }
      }, function(data) {
        console.log(data)
      })
    }
  }
}
</script>
