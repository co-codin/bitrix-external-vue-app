<template>
  <div>
    <page-header h1="Генератор QR кода для пользователя" :show-home-link="false" />
    <page-loader v-if="loading" />
    <v-alert v-else-if="error" type="error" text>
      Произошла ошибка при загрузке Битрикс 24
    </v-alert>
    <template v-else>
      <div>
        <v-btn color="primary">Скачать</v-btn>
        <v-btn color="primary" class="ml-2">Скопировать</v-btn>
      </div>
      <v-card class="mt-2" style="max-width: 200px">
        <v-img
          src="https://ru.qr-code-generator.com/wp-content/themes/qr/new_structure/markets/basic_market/generator/dist/generator/assets/images/websiteQRCode_noFrame.png"
        />
      </v-card>
    </template>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import PageLoader from '@/components/PageLoader'

export default {
  components: {
    PageHeader,
    PageLoader
  },
  data: () => ({
    user: null,
    error: null,
    loading: true
  }),

  mounted() {
    // const options = BX24.placement?.info()

    this.loadUser()
  },
  methods: {
    loadUser() {
      this.user = {
        first_name: 'Петр'
      }
      this.loading = false
    }
  }
}
</script>
