<template>
  <div>
    <page-header h1="Количество сделок" :breadcrumbs="breadcrumbs" :home-link="homeLink" />
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="counts"
      disable-pagination
      hide-default-footer
    >
    </v-data-table>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import BX24Wrapper from '@/utils/bx24-wrapper'

export default {
  components: {
    PageHeader
  },
  data:() => ({
    homeLink: {
      text: 'Отчеты по сделкам',
      to: { name: 'deals.reports' }
    },
    breadcrumbs: [
      { text: 'Количество сделок' }
    ],
    loading: true,
    headers: [
      { text: '#', align: 'center', value: 'index', sortable: true },
      { text: 'Менеджер', align: 'left', value: 'name', sortable: true },
      { text: 'Количество сделок', align: 'center', value: 'dealsNumber', sortable: true }
    ],
    counts: []
  }),
  async mounted() {
    // get all managers (only managers)
    const bx24 = new BX24Wrapper()

    console.log(await bx24.callBatchListMethod('crm.deal.list', { limit: 1000, select: ['ID', 'TITLE'] }))

    // get all deals (only needed columns)
    // count deals by managers
    // show the table
  }
}
</script>
