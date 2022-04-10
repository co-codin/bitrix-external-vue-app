<template>
  <div>
    <page-header h1="Заполнение сделок по менеджеру" :breadcrumbs="breadcrumbs" :home-link="homeLink" />

    <v-card v-if="isAdmin" :disabled="loading">
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
          Сделки ({{ deals.length }})
          <v-spacer />
          <v-btn icon @click="refreshDeals">
            <refresh-icon width="30" height="30" />
          </v-btn>
          <v-btn icon @click="exportExcel">
            <download-icon width="30" height="30" />
          </v-btn>
        </v-card-title>
        <v-data-table
          dense
          item-key="name"
          :headers="headers"
          fixed-header
          :height="tableHeight"
          :items="deals"
          disable-pagination
          hide-default-footer
        >
          <template #header.has_company_name="{ header }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ header.text }}</span>
              </template>
              <div>
                <p class="mb-1">Указана комания клиента</p>
                <v-img
                  class="mb-1"
                  max-width="400px"
                  src="/images/deals-filling-statistics-fields/has_company_name.png"
                />
              </div>
            </v-tooltip>
          </template>
          <template #header.has_inn="{ header }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ header.text }}</span>
              </template>
              <div>
                <p class="mb-1">Указан ИНН компании</p>
                <v-img
                  class="mb-1"
                  max-width="400px"
                  src="/images/deals-filling-statistics-fields/has_inn.png"
                />
              </div>
            </v-tooltip>
          </template>
          <template #header.has_name="{ header }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ header.text }}</span>
              </template>
              <div>
                <p class="mb-1">Указано ФИО клиента</p>
                <v-img
                  class="mb-1"
                  max-width="400px"
                  src="/images/deals-filling-statistics-fields/has_name.png"
                />
              </div>
            </v-tooltip>
          </template>
          <template #header.has_email="{ header }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ header.text }}</span>
              </template>
              <div>
                <p class="mb-1">Указан E-mail клиента</p>
                <v-img
                  class="mb-1"
                  max-width="400px"
                  src="/images/deals-filling-statistics-fields/has_email.png"
                />
              </div>
            </v-tooltip>
          </template>
          <template #header.has_sum="{ header }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ header.text }}</span>
              </template>
              <div>
                <p class="mb-1">Указана сумма сделки</p>
                <v-img
                  class="mb-1"
                  max-width="400px"
                  src="/images/deals-filling-statistics-fields/has_sum.png"
                />
              </div>
            </v-tooltip>
          </template>
          <template #header.has_client_type="{ header }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ header.text }}</span>
              </template>
              <div>
                <p class="mb-1">Указан тип клиента</p>
              </div>
            </v-tooltip>
          </template>
          <template #header.has_category="{ header }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ header.text }}</span>
              </template>
              <div>
                <p class="mb-1">Указана хотя бы одна категория</p>
              </div>
            </v-tooltip>
          </template>
          <template #header.has_region="{ header }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ header.text }}</span>
              </template>
              <div>
                <p class="mb-1">Указан регион</p>
              </div>
            </v-tooltip>
          </template>
          <template #header.has_planned_call="{ header }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ header.text }}</span>
              </template>
              <div>
                <p class="mb-1">Есть запланированный звонок</p>
              </div>
            </v-tooltip>
          </template>
          <template #header.has_correct_call_description="{ header }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ header.text }}</span>
              </template>
              <div>
                <p class="mb-1">Тема звонка указана вручную</p>
              </div>
            </v-tooltip>
          </template>
          <template #header.has_planned_call_after_last_call="{ header }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ header.text }}</span>
              </template>
              <div>
                <p class="mb-1">Не был запланирован звонок позже 60 дней от последнего звонка по данной сделке</p>
              </div>
            </v-tooltip>
          </template>
          <template #header.has_no_overdue_calls="{ header }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ header.text }}</span>
              </template>
              <div>
                <p class="mb-1">Звонок в данной сделке просрочен более чем на 24 часа от указаного времени звонка</p>
              </div>
            </v-tooltip>
          </template>
          <template #header.has_recent_calls="{ header }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ header.text }}</span>
              </template>
              <div>
                <p class="mb-1">Есть звонок совершенный за последние 60 дней от крайней активности</p>
              </div>
            </v-tooltip>
          </template>
          <template #item="{ item, headers }">
            <tr>
              <td>
                <div v-if="item.index" class="font-weight-bold text-no-wrap text-center">
                  {{ item.index }}
                </div>
              </td>
              <td style="max-width: 450px">
                <div v-if="item.name" class="font-weight-bold">
                  <a href="#" @click.prevent="openDeal(item.id)">{{ item.name }}</a>
                </div>
              </td>
              <td v-for="(header, i) in headers.slice(2)" :key="i" class="text-center">
                <v-tooltip bottom :color="getTooltipColor(item[header.value])">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-if="item[header.value] === true" class="green--text text--darken-4" v-bind="attrs" v-on="on">
                      <check-circle-solid-icon width="20" height="20" />
                    </span>
                    <span v-else-if="item[header.value] === false" class="red--text text--darken-4" v-bind="attrs" v-on="on">
                      <x-circle-solid-icon width="20" height="20" />
                    </span>
                    <span v-else class="blue-grey--text text--lighten-1">
                      &mdash;
                    </span>
                  </template>
                  <div v-if="item[header.value] === true">
                    {{ header.positiveLabel }}
                  </div>
                  <div v-else-if="item[header.value] === false">
                    {{ header.negativeLabel }}
                  </div>
                  <div v-else>
                    {{ header.negativeLabel }}
                  </div>
                </v-tooltip>
              </td>
            </tr>
          </template>
          <template #body.prepend="{ headers, originalItemsLength }">
            <tr>
              <th></th>
              <th></th>
              <th v-for="(header, i) in headers.slice(2)" :key="i" class="text-center">
                <div>
                  <span class="red--text text--darken-4 subtitle-1">{{ summary[header.value] }}</span> / <span class="green--text text--darken-4">{{ originalItemsLength - summary[header.value] }}</span>
                </div>
              </th>
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
import RefreshIcon from '@/components/heroicons/RefreshIcon'

export default {
  components: {
    RefreshIcon,
    PageHeader,
    DocumentSearchIcon,
    CheckCircleSolidIcon,
    XCircleSolidIcon,
    DownloadIcon
  },
  data: () => ({
    loading: false,
    manager: {
      id: null,
      name: null
    },
    deals: [],
    tableHeight: null,
    homeLink: {
      text: 'Отчеты по заполнению сделок',
      to: { name: 'deals.filling-statistics' }
    },
    headers: [
      { text: '#', align: 'center', value: 'index', sortable: true },
      { text: 'Сделка', align: 'left', value: 'name', sortable: true },
      { text: 'Компания', align: 'center', value: 'has_company_name', sortable: true, positiveLabel: 'Компания указана', negativeLabel: 'Компания не указана' },
      { text: 'ИНН', align: 'center', value: 'has_inn', sortable: true, positiveLabel: 'ИНН в компании указан', negativeLabel: 'ИНН в компании не указан' },
      { text: 'Контакт', align: 'center', value: 'has_name', sortable: true, positiveLabel: 'Контакт указан', negativeLabel: 'Контакт не указан' },
      { text: 'E-mail', align: 'center', value: 'has_email', sortable: true, positiveLabel: 'E-mail в контакте или компании указан', negativeLabel: 'E-mail в контакте или компании не указан' },
      { text: 'Сумма', align: 'center', value: 'has_sum', sortable: true, positiveLabel: 'Сумма в сделке указана', negativeLabel: 'Сумма в сделке не указана' },
      { text: 'Тип клиента', align: 'center', value: 'has_client_type', sortable: true, positiveLabel: 'Тип клиента в сделке указан', negativeLabel: 'Тип клиента в сделке не указан' },
      { text: 'Категория', align: 'center', value: 'has_category', sortable: true, positiveLabel: 'Категория в сделке указана', negativeLabel: 'Категория в сделке не указана' },
      { text: 'Регион', align: 'center', value: 'has_region', sortable: true, positiveLabel: 'Регион в сделке указан', negativeLabel: 'Регион в сделке не указан' },
      { text: 'Активность', align: 'center', value: 'has_planned_call', sortable: true, positiveLabel: 'Есть дела в сделке', negativeLabel: 'Сделка без дел' },
      { text: 'Тема звонка', align: 'center', value: 'has_correct_call_description', sortable: true, positiveLabel: 'Тема звонка введена вручную', negativeLabel: 'Тема звонка введена вручную' },
      { text: 'Звонок позже 60 дней', align: 'center', value: 'has_planned_call_after_last_call', sortable: true, positiveLabel: 'Звонок запланирован на ближайшие 60 дней', negativeLabel: 'Нет запланированного звонка на ближайшие 60 дней' },
      { text: 'Нет просроченных звонков', align: 'center', value: 'has_no_overdue_calls', sortable: true, positiveLabel: 'Нет просроченных звонков', negativeLabel: 'Есть просроченные звонки' },
      { text: 'За последние 60 дней был звонок', align: 'center', value: 'has_recent_calls', sortable: true, positiveLabel: 'За последние 60 дней был звонок', negativeLabel: 'За последние 60 дней не было звонка' }
    ],
    breadcrumbs: [
      { text: 'Заполнение сделок по менеджеру' }
    ],
    additionalAdminUserIds: [
      29, // Соловьев
      654, // Пальчун
      537, // Моисеева
      366 // Балаян
    ],
    isAdmin: false
  }),
  computed: {
    isUserSelected() {
      return !! this.manager?.name
    },
    summary() {
      const summary = {
        name: 0,
        has_company_name: 0,
        has_inn: 0,
        has_name: 0,
        has_sum: 0,
        has_client_type: 0,
        has_category: 0,
        has_region: 0,
        has_email: 0,
        has_planned_call: 0,
        has_correct_call_description: 0,
        has_planned_call_after_last_call: 0,
        has_no_overdue_calls: 0,
        has_recent_calls: 0
      }

      this.deals.forEach((deal) => {
        summary.has_company_name += !deal.has_company_name ? 1 : 0
        summary.has_inn += deal.has_inn === false ? 1 : 0
        summary.has_name += deal.has_name === false ? 1 : 0
        summary.has_email += deal.has_email === false ? 1 : 0
        summary.has_sum += deal.has_sum === false ? 1 : 0
        summary.has_client_type += deal.has_client_type === false ? 1 : 0
        summary.has_category += deal.has_category === false ? 1 : 0
        summary.has_region += deal.has_region === false ? 1 : 0
        summary.has_planned_call += deal.has_planned_call === false ? 1 : 0
        summary.has_correct_call_description += deal.has_correct_call_description === false ? 1 : 0
        summary.has_planned_call_after_last_call += deal.has_planned_call_after_last_call === false ? 1 : 0
        summary.has_no_overdue_calls += deal.has_no_overdue_calls === false ? 1 : 0
        summary.has_recent_calls += deal.has_recent_calls === false ? 1 : 0
      })

      return summary
    }
  },
  async mounted() {
    this.calculateTableHeight()
    window.addEventListener('resize', this.calculateTableHeight)

    const bx24 = new BX24Wrapper()

    const user = await bx24.callMethod('user.current')

    this.isAdmin = (await bx24.callMethod('user.admin')) || this.additionalAdminUserIds.includes(+user.ID)

    if (this.$route?.params?.manager) {
      const users = await bx24.callMethod('user.get', { ID: this.$route?.params.manager })

      if (users.length) {
        this.manager.id = this.$route?.params.manager
        this.manager.name = `${users[0]?.NAME} ${users[0]?.LAST_NAME}`
      }
    }

    if (!this.isAdmin) {
      this.manager.id = user.ID
      this.manager.name = user.NAME
    }

    if (this.isUserSelected) {
      this.loading = true
      await this.loadDeals()
      this.loading = false
    }
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
        { header: 'Сумма', key: 'has_sum', width: 15 },
        { header: 'Тип клиента', key: 'has_client_type', width: 15 },
        { header: 'Категория', key: 'has_category', width: 15 },
        { header: 'Регион', key: 'has_region', width: 15 },
        { header: 'Активность', key: 'has_planned_call', width: 15 },
        { header: 'Тема звонка', key: 'has_correct_call_description', width: 15 },
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
          else if (cell.value === false) {
            row.getCell(colNumber).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FE634D' }
            }
            cell.value = ''
          }
          else if (cell.value === 'not-available') {
            cell.value = ''
          }
        })
      })

      worksheet.getColumn(1).eachCell((cell) => {
        cell.alignment = { wrapText: true }
      })

      const uint8Array = await workbook.xlsx.writeBuffer()
      const blob = new Blob([uint8Array], { type: 'application/octet-binary' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = `${this.manager.name} - ведение сделок.xlsx`
      a.click()
      a.remove()

    },
    async selectUser() {
      BX24.selectUser(async (data) => {
        if (!data || !data?.name) {
          return
        }
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
        select: ['ID', 'TITLE', 'COMPANY_ID', 'UF_PROCEEDS', 'ASSIGNED_BY_ID', 'DATE_CREATE', 'STAGE_ID', 'UF_CRM_CATEGORY', 'UF_CRM_CLIENT_TYPE', 'UF_CRM_DISTRICT']
      })

      const companyIds = deals.map((deal) => deal.COMPANY_ID).filter(Boolean)

      const companies = await bx24.callListMethod('crm.company.list', {
        filter: { 'ID': companyIds },
        select: ['ID', 'TITLE', 'BANKING_DETAILS', 'HAS_EMAIL']
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

      const activities = (await bx24.callListMethod('crm.activity.list', {
        filter: {
          'OWNER_ID': dealIds,
          'OWNER_TYPE_ID': 2,
          'TYPE_ID': 2,
          '>=DEADLINE': now.subtract(61, 'day').format('YYYY-MM-DD HH:mm:ss')
        },
        select: ['COMPLETED', 'OWNER_ID', 'OWNER_TYPE_ID', 'DEADLINE', 'ASSIGNED_BY_ID', 'SUBJECT'],
        order: { 'DEADLINE': 'DESC' }
      })).reduce((hash, obj) => ({ ...hash, [obj['OWNER_ID']]:( hash[obj['OWNER_ID']] || [] ).concat(obj) }), {})

      const contactActivities = (await bx24.callListMethod('crm.activity.list', {
        filter: {
          'OWNER_ID': contactIds,
          'OWNER_TYPE_ID': 3,
          'TYPE_ID': 2,
          '>=DEADLINE': now.subtract(61, 'day').format('YYYY-MM-DD HH:mm:ss')
        },
        select: ['COMPLETED', 'OWNER_ID', 'OWNER_TYPE_ID', 'DEADLINE', 'ASSIGNED_BY_ID'],
        order: { 'DEADLINE': 'DESC' }
      })).reduce((hash, obj) => ({ ...hash, [obj['OWNER_ID']]:( hash[obj['OWNER_ID']] || [] ).concat(obj) }), {})

      const contactsById = contacts.reduce((o, key) => ({ ...o, [key.ID]: { ...key } }), {})

      deals.forEach((deal, index) => {

        const currentDealContacts = dealContacts[index].map((dealContact) => contactsById[dealContact.CONTACT_ID])

        const dealContactActivities = currentDealContacts.map((contact) => contactActivities?.[contact.ID] ?? []).flat()

        const dealActivities = (activities?.[deal.ID] || []).concat(dealContactActivities)
          .sort((a,b) => new Date(b.DEADLINE) - new Date(a.DEADLINE))

        // есть ли просроченные звонки
        const hasNoOverdueCall = ! dealActivities.find((activity) => activity.COMPLETED === 'N' && activity.ASSIGNED_BY_ID === deal.ASSIGNED_BY_ID && this.$dayjs(activity.DEADLINE) < now.subtract(1, 'day'))

        // последний звонок
        const lastCall = dealActivities.find((activity) => activity.COMPLETED === 'Y')

        const nearestPlannedCall = dealActivities
          .find((activity) => activity.COMPLETED === 'N' ?? activity.ASSIGNED_BY_ID === deal.ASSIGNED_BY_ID)

        const hasPlannedCall = !! nearestPlannedCall

        const row = {
          index: index + 1,
          id: deal.ID,
          name: deal.TITLE,
          has_company_name: ['NEW', 'DETAILS'].includes(deal.STAGE_ID) || !!(companiesById?.[deal.COMPANY_ID]?.TITLE?.length),
          has_inn: ['NEW', 'DETAILS'].includes(deal.STAGE_ID) || !! companyRequisites?.[deal.COMPANY_ID],
          has_name:  !! currentDealContacts.filter((contact) => !! contact.NAME?.length || !! contact.LAST_NAME?.length || contact.SECOND_NAME?.length).length,
          has_email: currentDealContacts?.map((contact) => contact?.HAS_EMAIL).includes('Y') || companiesById?.[deal.COMPANY_ID]?.HAS_EMAIL === 'Y',
          has_sum: ['NEW', 'DETAILS'].includes(deal.STAGE_ID) ? !! deal.UF_PROCEEDS : !! deal.UF_PROCEEDS && deal.UF_PROCEEDS !== '100|RUB',
          has_client_type: !! deal.UF_CRM_CLIENT_TYPE,
          has_category: !! deal.UF_CRM_CATEGORY,
          has_region: !! deal.UF_CRM_DISTRICT,
          has_planned_call: hasPlannedCall,
          has_correct_call_description: hasPlannedCall
            ? !nearestPlannedCall.SUBJECT?.startsWith('Исходящий звонок') || false
            : 'not-available',
          has_planned_call_after_last_call: hasPlannedCall
            ? this.$dayjs(lastCall ? lastCall.DEADLINE : deal.DATE_CREATE).add(60, 'day') >= this.$dayjs(nearestPlannedCall.DEADLINE)
            : 'not-available',
          has_no_overdue_calls: hasPlannedCall ? hasNoOverdueCall : 'not-available',
          has_recent_calls: !! lastCall
        }

        this.deals.push(row)
      })
    },
    getTooltipColor(value) {
      if (value === true) {
        return 'green darken-4'
      }

      if (value === false) {
        return 'red darken-4'
      }

      return 'orange lighten-1'
    },
    async refreshDeals() {
      this.loading = true
      this.deals = []
      await this.loadDeals()
      this.loading = false
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
