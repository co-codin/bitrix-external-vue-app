<template>
  <div>
    <v-card>
      <v-alert outlined dense type="info">
        Скоро здесь появится возможность загружать документы
      </v-alert>
      <input ref="uploader" type="file">
      <v-btn @click="upload">Загрузить выбранный файл</v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    files: [],
    headers: [

    ]
  }),
  methods: {
    uploadFile() {
      window.BX24.callMethod('disk.storage.uploadfile', {
        id: 688,
        fileContent: this.$refs.uploader,
        data: {
          NAME: '2102102.jpg'
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
