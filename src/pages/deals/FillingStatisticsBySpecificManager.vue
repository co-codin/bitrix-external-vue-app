<template>
  <div>
    <page-header h1="Заполнение сделок по менеджеру" :breadcrumbs="breadcrumbs" :home-link="homeLink" />

    <user-select-field v-if="isAdmin" :value="manager" :disabled="loading" @input="changeManager" />

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
            <svg-icon name="refresh" width="30" height="30" />
          </v-btn>
          <v-btn icon @click="exportExcel">
            <svg-icon name="download" width="30" height="30" />
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
          <template #item="{ item, headers, index }">
            <tr>
              <td>
                <div v-if="item.name" class="font-weight-bold text-no-wrap text-center">
                  {{ index + 1 }}
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
                      <svg-icon name="check-circle" solid width="20" height="20" />
                    </span>
                    <span v-else-if="item[header.value] === false" class="red--text text--darken-4" v-bind="attrs" v-on="on">
                      <svg-icon name="x-circle" solid width="20" height="20" />
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
import PageHeader from '@/components/PageHeader'
import ExcelJS from 'exceljs'
import FillingStatisticsService from '@/services/FillingStatisticsService'
import UserSelectField from '@/components/UserSelectField'
import BX24Wrapper from '@/utils/bx24-wrapper'

export default {
  components: {
    PageHeader,
    UserSelectField
  },
  data: () => ({
    loading: false,
    manager: null,
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
      return FillingStatisticsService.calculateSummary(this.deals)
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
        this.manager = {
          id: this.$route?.params.manager,
          name: `${users[0]?.NAME} ${users[0]?.LAST_NAME}`
        }
      }
    }

    if (!this.isAdmin) {
      this.manager = {
        id: user.ID,
        name: user.NAME
      }
    }

    if (this.isUserSelected) {
      await this.refreshDeals()
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
        ...FillingStatisticsService.getExportColumns()
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
    async loadDeals() {
      this.deals = await new FillingStatisticsService(this.manager.id).getData()
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
    },
    async changeManager(manager) {
      this.manager = manager
      await this.refreshDeals()
    }
  }
}
</script>
