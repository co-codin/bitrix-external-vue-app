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
          <v-btn icon @click="exportExcel">
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
import ExcelJS from 'exceljs'

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
      { text: 'Дело', align: 'left', value: 'has_planned_call', sortable: false },
      { text: 'Звонок позже 60 дней', align: 'left', value: 'has_planned_call_after_last_call', sortable: false },
      { text: 'Нет просроченных звонков', align: 'left', value: 'has_no_overdue_calls', sortable: false },
      { text: 'За последние 60 дней был звонок', align: 'left', value: 'has_recent_calls', sortable: false }
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
    this.calculateTableHeight()

    window.addEventListener('resize', this.calculateTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateTableHeight)
  },
  methods: {
    calculateTableHeight() {
      this.tableHeight = window.innerHeight - 280
    },
    openDeal(dealId) {
      BX24.openPath(`/crm/deal/details/${dealId}/`)
    },
    async exportExcel() {
      const workbook = new ExcelJS.Workbook()

      workbook.addWorksheet('sheet1', {
        views: [
          { state: 'frozen', ySplit: 1 }
        ]
      })
      const worksheet = workbook.getWorksheet('sheet1')

      worksheet.columns = [
        { header: 'Сделка', key: 'name', width: 100 },
        { header: 'Компания', key: 'has_company_name', width: 15 },
        { header: 'ИНН', key: 'has_inn', width: 15 },
        { header: 'Контакт', key: 'has_name', width: 15 },
        { header: 'E-mail', key: 'has_email', width: 15 },
        { header: 'Дело', key: 'has_planned_call', width: 15 },
        { header: 'Звонок позже 60 дней', key: 'has_planned_call_after_last_call', width: 30 },
        { header: 'Нет просроченныйх звонков', key: 'has_no_overdue_calls', width: 50 },
        { header: 'За последние 60 дней был звонок', key: 'has_recent_calls', width: 50 }
      ]

      worksheet.getRow(1).height = 50

      worksheet.getRow(1).eachCell((cell, colNumber) => {
        cell.font = {
          bold: true,
          size: 16
        }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      })

      this.deals.forEach((deal) => {
        const row = worksheet.addRow(deal)

        row.eachCell((cell, colNumber) => {
          cell.font = { size: 14 }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
          if (cell.value === true) {
            row.getCell(colNumber).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '88F94E' }
            }
            cell.value = ''
          }
          if (cell.value === false) {
            row.getCell(colNumber).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FE634D' }
            }
            cell.value = ''
          }
        })
      })

      worksheet.spliceRows()

      const uint8Array = await workbook.xlsx.writeBuffer()
      const blob = new Blob([uint8Array], { type: 'application/octet-binary' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = 'statistics.xlsx'
      a.click()
      a.remove()

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

      const activities = (await bx24.callListMethod('crm.activity.list', {
        filter: {
          'OWNER_ID': dealIds,
          'OWNER_TYPE_ID': 2,
          'TYPE_ID': 2,
          '>=DEADLINE': now.subtract(60, 'day').format('YYYY-MM-DD HH:mm:ss')
        },
        select: ['COMPLETED', 'OWNER_ID', 'DEADLINE'],
        order: { 'DEADLINE': 'DESC' }
      })).reduce((hash, obj) => ({ ...hash, [obj['OWNER_ID']]:( hash[obj['OWNER_ID']] || [] ).concat(obj) }), {})

      console.log(activities)

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

        const dealActivities = activities?.[deal.ID] || []

        // есть ли просроченные звонки
        const hasNoOverdueCall = ! dealActivities.find((activity) => activity.COMPLETED === 'N' && this.$dayjs(activity.DEADLINE) < now)

        // последний звонок
        const lastCall = dealActivities.find((activity) => activity.COMPLETED === 'Y' && this.$dayjs(activity.DEADLINE) <= now)

        // есть ли запланированный звонок
        const hasPlannedCall = !! dealActivities.find((activity) => activity.COMPLETED === 'N' && this.$dayjs(activity.DEADLINE) >= now)

        // есть ли запланированный звонок в течение 60 дней с момента последнего звонка
        const hasPlannedCallIn60DaysAfterLastCall = !! lastCall &&
          !! dealActivities.find((activity) => activity.COMPLETED === 'N' && this.$dayjs(activity.DEADLINE) >= now && this.$dayjs(activity.DEADLINE) <= this.$dayjs(lastCall.DEADLINE).add(60, 'day'))

        this.deals.push({
          index: index + 1,
          id: deal.ID,
          name: deal.TITLE,
          has_company_name: !!(companiesById?.[deal.COMPANY_ID]?.TITLE?.length),
          has_inn: !! companyRequisites?.[deal.COMPANY_ID],
          has_name:  !! currentDealContacts.filter((contact) => !! contact.NAME?.length || !! contact.LAST_NAME?.length || contact.SECOND_NAME?.length).length,
          has_sum: !!deal.UF_PROCEEDS,
          has_email: currentDealContacts?.map((contact) => contact?.HAS_EMAIL).includes('Y'),
          has_planned_call: hasPlannedCall,
          has_planned_call_after_last_call: hasPlannedCallIn60DaysAfterLastCall,
          has_no_overdue_calls: hasNoOverdueCall,
          has_recent_calls: !! lastCall
        })
      })
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
