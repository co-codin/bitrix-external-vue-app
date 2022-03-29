<template>
  <div>
    <page-header h1="Заполнение сделок по менеджеру" :breadcrumbs="breadcrumbs" :home-link="homeLink" />
    <v-card>
      <v-card-title class="cursor-pointer" @click="selectUser">
        <document-search-icon width="30" height="30" class="mr-1" />
        {{ isUserSelected ? manager.name : 'Выберите ответственного менеджера' }}
      </v-card-title>
    </v-card>

    <div v-if="isUserSelected" class="mt-3">
      <div v-if="loading" class="text-center mt-5">
        <v-progress-circular
          :size="70"
          :width="7"
          color="purple"
          indeterminate
        />
      </div>
      <v-card v-else>
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
          :height="tableHeight"
          :items="deals"
          hide-default-footer
        >
          <!--        <template #item.index="{ item }">-->
          <!--          <div class="font-weight-bold text-no-wrap headcol">-->
          <!--            # {{ item.index }}-->
          <!--          </div>-->
          <!--        </template>-->

          <!--        <template #item.name="{ item }">-->
          <!--          <div class="font-weight-bold text-no-wrap">-->
          <!--            <a href="#" @click.prevent="openDeal(item.id)">{{ item.name }}</a>-->
          <!--          </div>-->
          <!--        </template>-->

          <template #item="{ headers, item }">
            <tr>
              <td>
                <div class="font-weight-bold text-no-wrap">
                  {{ item.index }}
                </div>
              </td>
              <td style="max-width: 450px">
                <div class="font-weight-bold">
                  <a href="#" @click.prevent="openDeal(item.id)">{{ item.name }}</a>
                </div>
              </td>
              <td v-for="(header, i) in headers.slice(2)" :key="i">
                <div v-if="Boolean(item[header.value])" class="green--text text--darken-4">
                  <div class="d-flex justify-center align-center">
                    <check-circle-solid-icon width="15" height="15" />
                  </div>
                </div>
                <div v-else class="red--text text--darken-4">
                  <div class="d-flex justify-center align-center">
                    <x-circle-solid-icon width="15" height="15" />
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>

    </div>
  </div>
</template>

<script>
import DocumentSearchIcon from '@/components/heroicons/DocumentSearchIcon'
import CheckCircleSolidIcon from '@/components/heroicons/CheckCircleSolidIcon'
import XCircleSolidIcon from '@/components/heroicons/XCircleSolidIcon'
import DownloadIcon from '@/components/heroicons/DownloadIcon'
import BX24Wrapper from '@/utils/bx24-wrapper'
import PageHeader from '@/components/PageHeader'

export default {
  components: {
    PageHeader,
    DocumentSearchIcon,
    CheckCircleSolidIcon,
    XCircleSolidIcon,
    DownloadIcon
  },
  data: () => ({
    loading: true,
    manager: null,
    deals: [],
    tableHeight: null,
    homeLink: {
      text: 'Отчеты по заполнению сделок',
      to: { name: 'deals.filling-statistics' }
    },
    headers: [
      { text: '', align: 'left', value: 'index', sortable: false },
      { text: '', align: 'left', value: 'name', sortable: false },
      { text: 'Компания', align: 'left', value: 'has_company_name', sortable: false },
      { text: 'ИНН', align: 'left', value: 'has_inn', sortable: false },
      { text: 'Контакт', align: 'left', value: 'has_name', sortable: false },
      { text: 'E-mail', align: 'left', value: 'has_email', sortable: false },
      { text: 'Сумма', align: 'left', value: 'has_sum', sortable: false },
      { text: 'Дело', align: 'left', value: 'has_planned_activity', sortable: false },
      { text: 'Звонок позже 60 дней', align: 'left', value: 'has_planned_call', sortable: false },
      { text: 'Нет просроченных звонков', align: 'left', value: 'has_no_overdue_calls', sortable: false },
      { text: 'За последние 60 дней был звонок', align: 'left', value: 'has_no_recent_calls', sortable: false }
    ],
    breadcrumbs: [
      { text: 'Заполнение сделок по менеджеру' }
    ]
  }),
  computed: {
    isUserSelected() {
      return !! this.manager?.name
    }
  },
  mounted() {
    this.tableHeight = window.innerHeight - 280
  },
  methods: {
    openDeal(dealId) {
      BX24.openPath(`/crm/deal/details/${dealId}/`)
    },
    async selectUser() {
      BX24.selectUser(async (data) => {
        this.manager = data
        this.loading = true
        this.deals = []
        await this.loadDeals()
        this.loading = false
      })

    },
    async loadDeals() {
      const bx24 = new BX24Wrapper()

      const deals = await bx24.callListMethod('crm.deal.list', {
        order: { 'CLOSEDATE': 'DESC' },
        filter: { 'ASSIGNED_BY_ID': this.manager.id },
        select: ['ID', 'TITLE', 'COMPANY_ID', 'UF_PROCEEDS']
      })

      console.log(deals.length)

      const companyIds = deals.map((deal) => deal.COMPANY_ID).filter(Boolean)

      const companies = await bx24.callListMethod('crm.company.list', {
        filter: { 'ID': companyIds },
        select: ['ID', 'TITLE', 'BANKING_DETAILS']
      })

      const companiesById = companies.reduce((o, key) => ({ ...o, [key.ID]: { ...key } }), {})

      const companyRequisites = (await bx24.callListMethod('crm.requisite.list', {
        filter: {
          'ENTITY_ID': companyIds,
          'ENTITY_TYPE_ID': 4
        },
        select: ['ENTITY_ID', 'RQ_INN']
      })).filter((requisite) => !! requisite?.RQ_INN?.length).reduce((o, key) => ({ ...o, [key.ENTITY_ID]: key.RQ_INN }), {})

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
              TYPE_ID: 2,
              COMPLETED: 'N',
              '>END_TIME': now.format('YYYY-MM-DD HH:mm:ss')
            },
            select: ['OWNER_ID']
          }
        ]
      ]

      const activityResponse = await bx24.callBatch(activityBatch, false)

      const dealContactBatch = deals.map((deal) => {
        return [
          'crm.deal.contact.items.get', { id: deal.ID }
        ]
      })

      const dealContacts = await bx24.callLongBatch(dealContactBatch, false)

      const contactIds = dealContacts.flat().map((dealContact) => dealContact.CONTACT_ID)

      const contacts = await bx24.callListMethod('crm.contact.list', {
        filter: { 'ID': contactIds },
        select: [
          'ID',
          'NAME',
          'HAS_EMAIL',
          'LAST_NAME',
          'SECOND_NAME'
        ]
      })

      const contactsById = contacts.reduce((o, key) => ({ ...o, [key.ID]: { ...key } }), {})

      deals.forEach((deal, index) => {

        const currentDealContacts = dealContacts[index].map((dealContact) => contactsById[dealContact.CONTACT_ID])

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
          index: index + 1,
          id: deal.ID,
          name: deal.TITLE,
          has_company_name: !!(companiesById?.[deal.COMPANY_ID]?.TITLE?.length),
          has_inn: !! companyRequisites?.[deal.COMPANY_ID],
          has_name:  !! currentDealContacts.filter((contact) => !! contact.NAME?.length || !! contact.LAST_NAME?.length || contact.SECOND_NAME?.length).length,
          has_planned_activity: hasPlannedActivities,
          has_sum: !!deal.UF_PROCEEDS,
          has_email: currentDealContacts?.map((contact) => contact?.HAS_EMAIL).includes('Y'),
          has_no_overdue_calls: hasNoOverdueCalls,
          has_no_recent_calls: hasNoRecentCalls,
          has_planned_call: hasPlannedCalls
        })
      })
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
