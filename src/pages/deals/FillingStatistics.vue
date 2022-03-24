<template>
  <div>
    <v-card>
      <v-card-title class="cursor-pointer" @click="selectUser">
        <document-search-icon width="30" height="30" class="mr-1" />
        {{ isUserSelected ? manager.name : 'Выберите ответственного менеджера' }}
      </v-card-title>
    </v-card>

    <v-card v-if="isUserSelected" class="mt-3">
      <v-card-title>
        Сделки
        <v-spacer />
        <v-btn icon>
          <download-icon width="30" height="30" />
        </v-btn>
      </v-card-title>
      <v-data-table
        item-key="id"
        :items-per-page="100"
        :headers="headers"
        :items="deals"
        :loading="loading"
        loading-text="Идет загрузка..."
        hide-default-footer
      >
        <template #item.name="{ item }">
          <div class="font-weight-bold text-no-wrap">
            <a href="#" @click.prevent="openDeal(item.id)">{{ item.name }}</a>
          </div>
        </template>

        <template #item="{ headers, item }">
          <tr>
            <td>
              <div class="font-weight-bold text-no-wrap">
                <a href="#" @click.prevent="openDeal(item.id)">{{ item.name }}</a>
              </div>
            </td>
            <td v-for="(header, i) in headers.slice(1)" :key="i">
              <div v-if="Boolean(item[header.value])" class="green--text text--darken-4">
                <div class="d-flex justify-center align-center">
                  <check-circle-solid-icon width="15" height="15" />
                  <div class="text-caption font-weight-bold ml-1">Да</div>
                </div>
              </div>
              <div v-else class="red--text text--darken-4">
                <div class="d-flex justify-center align-center">
                  <x-circle-solid-icon width="15" height="15" />
                  <div class="text-caption font-weight-bold ml-1">Нет</div>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import DocumentSearchIcon from '@/components/heroicons/DocumentSearchIcon'
import CheckCircleSolidIcon from '@/components/heroicons/CheckCircleSolidIcon'
import XCircleSolidIcon from '@/components/heroicons/XCircleSolidIcon'
import DownloadIcon from '@/components/heroicons/DownloadIcon'
import BX24Wrapper from '@/utils/bx24-wrapper'

export default {
  components: {
    DocumentSearchIcon,
    CheckCircleSolidIcon,
    XCircleSolidIcon,
    DownloadIcon
  },
  data: () => ({
    loading: false,
    manager: null,
    deals: [],

    headers: [
      { text: '', align: 'left', value: 'name', sortable: false, fixed: true },
      { text: 'Компания', value: 'has_company_name', sortable: false },
      { text: 'ИНН', value: 'has_inn', sortable: false },
      { text: 'Имя', value: 'has_name', sortable: false },
      { text: 'E-mail', value: 'has_email', sortable: false },
      { text: 'Дело', value: 'has_planned_activity', sortable: false },
      { text: 'Сумма', value: 'has_sum', sortable: false },
      { text: 'Нет просроченных звонков', value: 'has_no_overdue_calls', sortable: false },
      { text: 'За последние 60 дней был звонок', value: 'has_no_recent_calls', sortable: false },
      { text: 'Звонок позже 60 дней', value: 'has_planned_call', sortable: false }
    ]
  }),
  computed: {
    isUserSelected() {
      return !! this.manager?.name
    }
  },
  methods: {
    openDeal(dealId) {
      BX24.openPath(`/crm/deal/details/${dealId}/`)
      // open deal slider
    },
    async selectUser() {
      BX24.selectUser(async (data) => {
        this.manager = data
        await this.loadDeals()
      })

    },
    async loadDeals() {
      const bx24 = await new BX24Wrapper()

      this.loading = true

      const deals = await bx24.callListMethod('crm.deal.list', {
        order: { 'CLOSEDATE': 'DESC' },
        filter: { 'ASSIGNED_BY_ID': this.manager.id },
        select: ['ID', 'TITLE', 'COMPANY_ID', 'CONTACT_ID', 'OPPORTUNITY', 'CLOSEDATE', 'ADDITIONAL_INFO', 'UF_ADDITIONAL_INN']
      })

      console.log(deals.length)

      const companyBatch = deals.map((deal) => {
        return [
          'crm.company.list', { filter: { ID: deal.COMPANY_ID } }
        ]
      })

      const companies = await bx24.callListMethod('crm.company.list', { filter: { ID: deal.COMPANY_ID } })

      console.log(companies.length)

      const dealContactBatch = deals.map((deal) => {
        return [
          'crm.deal.contact.items.get', { id: deal.ID }
        ]
      })

      const dealContacts = await (new BX24Wrapper()).callLongBatch(dealContactBatch, false)

      console.log(dealContacts.length)

      const contactBatch = dealContacts.map((dealContact) => {
        return [
          'crm.contact.list', { filter: { ID: dealContact.map((dealContact) => dealContact.CONTACT_ID) } }
        ]
      })

      const contacts = await (new BX24Wrapper()).callLongBatch(contactBatch, false)

      console.log(contacts.length)

      const callBatch = contacts.map((contact) => {
        return [
          'voximplant.statistic.get', { FILTER: { CRM_ENTITY_ID: contact.map((item) => item.CONTACT_ID) } }
        ]
      })

      const calls = await (new BX24Wrapper()).callLongBatch(callBatch, false)

      console.log(calls.length)

      const activityBatch = calls.map((call) => {
        return [
          'crm.activity.list', { filter: { ID: call.map((call) => call.CRM_ACTIVITY_ID) } }
        ]
      })

      const activities = await (new BX24Wrapper()).callLongBatch(activityBatch, false)

      console.log(activities.length)

      deals.forEach((deal, index) => {
        const hasNoRecentCalls = activities[index].map((activity) => {
          return ((new Date()).getTime() - (new Date(activity.START_TIME)).getTime()) / (1000 * 3600 * 24) < 60
        }).includes(true)

        const hasNoOverdueCalls = activities[index].map((activity) => {
          return ((new Date(activity.START_TIME)).getTime() - (new Date(activity.DEADLINE)).getTime()) / (1000 * 3600 * 24) > 1
        }).includes(true)

        const hasPlannedCalls = activities[index].map((activity) => {
          return ((new Date(activity.DEADLINE)).getTime() - (new Date()).getTime()) / (1000 * 3600 * 24) > 55
        }).includes(true)

        this.deals.push({
          id: deal.ID,
          name: deal.TITLE,
          has_company_name: !!companies[index].map((company) => company.TITLE).length,
          has_inn: !!deal.UF_ADDITIONAL_INN,
          has_name: !!deal.CONTACT_ID,
          has_planned_activity: !!deal.CLOSEDATE,
          has_sum: !!deal.OPPORTUNITY,
          has_email: contacts[index].map((contact) => contact.HAS_EMAIL).includes('Y'),
          has_no_overdue_calls: hasNoOverdueCalls,
          has_no_recent_calls: hasNoRecentCalls,
          has_planned_call: hasPlannedCalls
        })
      })

      this.loading = false
    },
    getResultCellText(result = true) {

    }
  }
}
</script>
