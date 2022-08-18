<template>
  <div>
    Выберите материал для обучения в левом меню
  </div>
</template>

<script>
export default {
  async created() {
    console.log()
    const documents = await this.$r2d2.get('/documents')

    console.log(documents)``
  }
}
</script>
