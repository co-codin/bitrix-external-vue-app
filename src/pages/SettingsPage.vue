<template>
  <div>
    <page-header h1="Настройки" :breadcrumbs="breadcrumbs" />
    <v-card>
      <v-alert dense type="info" outlined>
        В этом разделе будут настройки приложений
      </v-alert>
    </v-card>
  </div>
</template>

<script>
import PageHeader from '../components/PageHeader'

export default {
  components: {
    PageHeader
  },
  data: () => ({
    breadcrumbs: [{ text: 'Настройки' }]
  })
}
</script>
