<template>
  <div>
    <page-header h1="Количество сделок" :breadcrumbs="breadcrumbs" :home-link="homeLink" />
    <user-search-field v-model="userIds" @input="refreshStatistics" />
    <v-data-table
      v-if="userIds.length"
      :loading="loading"
      :headers="headers"
      :items="statistics"
      disable-pagination
      hide-default-footer
      loading-text="Идет загрузка сделок"
      no-data-text="Нет данных"
    >
      <template #item.index="{ item, index }">
        <div class="font-weight-bold">{{ index + 1 }}</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import UserSearchField from '@/components/UserSearchField'

export default {
  components: {
    PageHeader,
    UserSearchField
  },
  data: () => ({
    homeLink: {
      text: 'Отчеты по сделкам',
      to: { name: 'deals.reports' }
    },
    breadcrumbs: [
      { text: 'Количество сделок' }
    ],
    loading: true,
    headers: [
      { text: '#', align: 'left', value: 'index', sortable: true },
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
    userIds: [],
    deals: [],
    stages: []
  }),
  computed: {
    usersById() {
      return this.users.reduce((hash, obj) => ({
        ...hash,
        [obj['ID']]: (hash[obj['ID']] || []).concat(obj)
      }), {})
    },
    dealsByUser() {
      return this.deals.reduce((hash, obj) => ({
        ...hash,
        [obj['ASSIGNED_BY_ID']]: (hash[obj['ASSIGNED_BY_ID']] || []).concat(obj)
      }), {})
    },
    statistics() {
      return Object.entries(this.dealsByUser).map(([key, deals]) => ({
        name: this.usersById[key]?.NAME || '',
        dealsNumber: deals.length,
        counts: deals.reduce((total, value) => {
          total[value.STAGE_ID] = (total[value.STAGE_ID] || 0) + 1

          return total
        }, {})
      }))
    }
  },
  async mounted() {
    // load all users
    this.users = await this.$bx24.callBatchListMethod('user.get', { filter: { ACTIVE: true } })

    // // load all stages
    this.stages = await this.$bx24.callMethod('crm.status.list', { filter: { 'ENTITY_ID': 'DEAL_STAGE' } })

    this.loading = false
  },
  methods: {
    refreshStatistics() {
      this.loading = true
      this.deals = []
      this.loadDeals()
      this.loading = false
    },
    async loadDeals() {
      // load all deals
      this.deals = await this.$bx24.callBatchListMethod('crm.deal.list', { select: ['ASSIGNED_BY_ID', 'STAGE_ID'], filter: { ASSIGNED_BY_ID: this.userIds } })
    }
  }
}
</script>
