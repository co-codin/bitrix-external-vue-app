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
        item-key="name"
        :items-per-page="10000"
        :headers="headers"
        fixed-header
        height="100%"
        :items="deals"
        :loading="loading"
        loading-text="Идет загрузка..."
        hide-default-footer
      >
        <template #item.name="{ item }">
          <div class="font-weight-bold text-no-wrap headcol">
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
      { text: '', align: 'left', value: 'id', sortable: false },
      { text: '', align: 'left', value: 'name', sortable: false },
      { text: 'Компания', align: 'left', value: 'has_company_name', sortable: false },
      { text: 'ИНН', align: 'left', value: 'has_inn', sortable: false },
      { text: 'Контакт', align: 'left', value: 'has_name', sortable: false },
      { text: 'E-mail', align: 'left', value: 'has_email', sortable: false },
      { text: 'Дело', align: 'left', value: 'has_planned_activity', sortable: false },
      { text: 'Сумма', align: 'left', value: 'has_sum', sortable: false },
      { text: 'Нет просроченных звонков', align: 'left', value: 'has_no_overdue_calls', sortable: false },
      { text: 'За последние 60 дней был звонок', align: 'left', value: 'has_no_recent_calls', sortable: false },
      { text: 'Звонок позже 60 дней', align: 'left', value: 'has_planned_call', sortable: false }
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
        this.deals = []
        await this.loadDeals()
      })

    },
    async loadDeals() {
      const bx24 = new BX24Wrapper()

      this.loading = true

      const deals = await bx24.callListMethod('crm.deal.list', {
        order: { 'CLOSEDATE': 'DESC' },
        filter: { 'ASSIGNED_BY_ID': this.manager.id },
        select: ['ID', 'TITLE', 'COMPANY_ID', 'CONTACT_ID', 'OPPORTUNITY', 'CLOSEDATE', 'ADDITIONAL_INFO', 'UF_ADDITIONAL_INN']
      })

      console.log(deals.length)

      const companyIds = deals.map((deal) => deal.COMPANY_ID).filter(Boolean)

      const companies = await bx24.callListMethod('crm.company.list', {
        filter: { 'ID': companyIds },
        select: ['ID', 'TITLE', 'BANKING_DETAILS']
      })

      const companiesById = {}

      companies.forEach((company) => {
        companiesById[company.ID] = company
      })

      console.log(companies.length)

      const dealIds = deals.map((deal) => deal.ID).filter(Boolean)

      const now = this.$dayjs()

      const activityBatch = [
        [
          // hasNoRecentCalls
          'crm.activity.list',
          {
            filter: {
              OWNER_ID: dealIds,
              OWNER_TYPE_ID: 2,
              TYPE_ID: 2,
              COMPLETED: 'Y',
              '>=CREATED': now.subtract(50, 'day').format('YYYY-MM-DD HH:mm:ss'),
              '<=CREATED': now.format('YYYY-MM-DD HH:mm:ss')
            },
            select: ['OWNER_ID']
          }
        ],
        [
          // hasNoOverdueCalls
          'crm.activity.list',
          {
            filter: {
              OWNER_ID: dealIds,
              OWNER_TYPE_ID: 2,
              TYPE_ID: 2,
              COMPLETED: 'N',
              '>=END_TIME': now.format('YYYY-MM-DD HH:mm:ss')
            },
            select: ['OWNER_ID']
          }
        ],
        [
          // hasPlannedCalls
          'crm.activity.list',
          {
            filter: {
              OWNER_ID: dealIds,
              OWNER_TYPE_ID: 2,
              TYPE_ID: 2,
              COMPLETED: 'N',
              '<END_TIME': now.format('YYYY-MM-DD HH:mm:ss')
            },
            select: ['OWNER_ID']
          }
        ],
        [
          // hasPlannedActivities
          'crm.activity.list',
          {
            filter: {
              OWNER_ID: dealIds,
              OWNER_TYPE_ID: 2,
              COMPLETED: 'N',
              '>END_TIME': now.format('YYYY-MM-DD HH:mm:ss')
            },
            select: ['OWNER_ID']
          }
        ]
      ]

      const activityResponse = await bx24.callBatch(activityBatch, false)

      console.log(activityResponse)

      const dealContactBatch = deals.map((deal) => {
        return [
          'crm.deal.contact.items.get', { id: deal.ID }
        ]
      })

      const dealContacts = await bx24.callLongBatch(dealContactBatch, false)

      console.log(dealContacts.length)

      const contactBatch = dealContacts.map((dealContact) => {
        return [
          'crm.contact.list', {
            filter: {
              ID: dealContact.map((dealContact) => dealContact.CONTACT_ID)
            },
            select: [
              'NAME',
              'HAS_EMAIL'
            ]
          }
        ]
      })

      const contacts = await bx24.callLongBatch(contactBatch, false)

      console.log(contacts.length)

      deals.forEach((deal, index) => {
        const hasNoRecentCalls = !!activityResponse[0]?.filter((activity) => {
          return activity.OWNER_ID === deal.ID
        }).length

        const hasNoOverdueCalls = !!activityResponse[1]?.filter((activity) => {
          return activity.OWNER_ID === deal.ID
        }).length

        const hasPlannedCalls = !!activityResponse[2]?.filter((activity) => {
          return activity.OWNER_ID === deal.ID
        }).length

        const hasPlannedActivities = !!activityResponse[3]?.filter((activity) => {
          return activity.OWNER_ID === deal.ID
        }).length

        this.deals.push({
          id: index + 1,
          name: deal.TITLE,
          has_company_name: !! (companiesById?.[deal.COMPANY_ID]?.TITLE?.length),
          has_inn: !!deal.UF_ADDITIONAL_INN || (companiesById?.[deal.COMPANY_ID]?.BANKING_DETAILS?.length),
          has_name: !!contacts[index]?.NAME?.length,
          has_planned_activity: hasPlannedActivities,
          has_sum: !!deal.OPPORTUNITY,
          has_email: contacts[index]?.map((contact) => contact?.HAS_EMAIL).includes('Y'),
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

<style scoped>
.headcol {
  position:absolute;
  width:30%;
  left:0;
  background:#eee;
  text-align: center !important;
  padding-top: 10px !important;
}
</style>
