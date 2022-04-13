<template>
  <div>
    <page-header h1="Количество сделок" :breadcrumbs="breadcrumbs" :home-link="homeLink" />
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="statistics"
      disable-pagination
      hide-default-footer
    />
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
      { text: 'Количество сделок', align: 'center', value: 'dealsNumber', sortable: true },
      { text: 'Новая', align: 'center', value: 'counts.NEW', sortable: true },
      { text: 'Первичная консультация', align: 'center', value: 'counts.DETAILS', sortable: true },
      { text: 'Отправлено КП', align: 'center', value: 'counts.5', sortable: true },
      { text: 'Активные переговоры', align: 'center', value: 'counts.PROPOSAL', sortable: true },
      { text: 'Проведена встреча', align: 'center', value: 'counts.6', sortable: true },
      { text: 'Отправлен договор и счет', align: 'center', value: 'counts.NEGOTIATION', sortable: true }
    ],
    users: [],
    deals: [],
    stages: []
  }),
  computed: {
    dealsByUser() {
      return this.deals.reduce((hash, obj) => ({ ...hash, [obj['ASSIGNED_BY_ID']]:( hash[obj['ASSIGNED_BY_ID']] || [] ).concat(obj) }), {})
    },
    statistics() {
      return Object.entries(this.dealsByUser).map(([key, deals]) => ({
        name: this.users[key],
        counts: value.reduce((total, value) => {
          total[value.STAGE_ID] = (total[value.STAGE_ID] || 0) + 1

          return total
        }, {})
      }))
    }
  },
  async mounted() {
    // load all users
    // this.users = await

    // load all stages
    this.stages = await this.$bx24.callMethod('crm.status.list', { filter: { 'ENTITY_ID': 'DEAL_STAGE' } })
    // load all deals
    this.deals = this.$bx24.callBatchListMethod('crm.deal.list', { select: ['ASSIGNED_BY_ID', 'STAGE_ID'] })

    this.loading = false
  }
}
</script>
