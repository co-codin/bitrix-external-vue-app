<template>
  <div>
    <page-header h1="Настройки" :breadcrumbs="breadcrumbs" />
    <v-alert dense type="info" outlined>
      В этом разделе будут настройки приложений
    </v-alert>
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
