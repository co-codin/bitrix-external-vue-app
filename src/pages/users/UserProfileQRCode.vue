<template>
  <div>
    QR code here... Coming soon
  </div>
</template>

<script>
export default {
  mounted() {
    const options = BX24.placement?.info()?.options

    console.log(options)
  }
}
</script>
