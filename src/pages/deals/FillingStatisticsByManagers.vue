<template>
  <div>
    <page-header h1="Сводка по менеджерам" :breadcrumbs="breadcrumbs" :home-link="homeLink" />

    <template v-if="isAdmin">
      <user-select-field :value="managers" :multiple="true" :disabled="loading" @input="changeManager" />
      <v-expansion-panels class="mt-3">
        <v-expansion-panel>
          <v-expansion-panel-header class="title">
            <div class="d-flex align-center">
              <svg-icon name="cog" width="28" height="28" class="mr-1" />
              <div>
                Настройки
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-switch
              v-model="asPercent"
              label="В процентах"
              dense
              inset
              hide-details
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
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
            Менеджеры ({{ managers.length }})
            <v-spacer />
            <v-btn icon @click="refreshData">
              <svg-icon name="refresh" width="25" height="25" />
            </v-btn>
            <v-btn icon @click="exportExcel">
              <svg-icon name="download" width="25" height="25" />
            </v-btn>
          </v-card-title>
          <v-data-table
            item-key="id"
            :headers="headers"
            fixed-header
            :height="tableHeight"
            :items="statistics"
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
                  <div v-if="item.name" class="font-weight-bold text-center text-no-wrap">
                    {{ index + 1 }}
                  </div>
                </td>
                <td style="max-width: 350px">
                  <div v-if="item.name" class="font-weight-bold text-no-wrap subtitle-1">
                    <a href="#" @click.prevent="openUserProfile(item.id)">{{ item.name }}</a>
                  </div>
                </td>
                <td>
                  <div v-if="item.name" class="font-weight-bold text-center text-no-wrap d-flex align-center justify-center">
                    <div>
                      {{ item.dealsNumber }}
                    </div>
                    <router-link :to="{ 'name': 'deals.filling-statistics.by-manager', params: { manager: item.id } }" class="ml-1 mt-1">
                      <svg-icon name="collection" width="24" height="24" />
                    </router-link>
                  </div>
                </td>
                <td v-for="(header, i) in headers.slice(3)" :key="i" class="text-center text-body-1">
                  <v-tooltip bottom max-width="300">
                    <template v-slot:activator="{ on, attrs }">
                      <span :class="{'green--text text--darken-4 font-weight-medium': item[header.value].negative === 0, 'red--text text--darken-4': item[header.value].negative > 0}" v-bind="attrs" v-on="on">
                        {{ asPercent ? `${item[header.value].negativePercent} %` : item[header.value].negative }}
                      </span>
                    </template>
                    <div>
                      <span v-if="item[header.value].negative > 0">
                        {{ item[header.value].negative }} {{ $declension(item[header.value].negative, ['ошибка', 'ошибки', 'ошибок']) }} в {{ item.dealsNumber }} {{ $declension(item.dealsNumber, ['сделке', 'сделках', 'сделках']) }} ({{ Math.round(100 * item[header.value].negative / item.dealsNumber) }} %)
                      </span>
                      <span v-else>
                        Ошибок нет
                      </span>
                    </div>
                  </v-tooltip>
                </td>
              </tr>
            </template>
            <template #body.prepend="{ headers }">
              <tr>
                <th></th>
                <th></th>
                <th class="text-center">
                  <span class="text--darken-4 subtitle-1">
                    {{ deals.length }}
                  </span>
                </th>
                <th v-for="(header, i) in headers.slice(3)" :key="i" class="text-center">
                  <template v-if="asPercent">
                    <span class="red--text text--darken-4 subtitle-1">{{ Math.round(100 * summary[header.value] / deals.length) }} %</span> / <span class="green--text text--darken-4">{{ Math.round( 100 * (deals.length - summary[header.value]) / deals.length) }} %</span>
                  </template>
                  <template v-else>
                    <span class="red--text text--darken-4 subtitle-1">{{ summary[header.value] }}</span> / <span class="green--text text--darken-4">{{ deals.length - summary[header.value] }}</span>
                  </template>
                </th>
              </tr>
            </template>
          </v-data-table>
        </v-card>

      </div>
    </template>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import ExcelJS from 'exceljs'
import FillingStatisticsService from '@/services/FillingStatisticsService'
import UserSelectField from '@/components/UserSelectField'
import BX24Wrapper from '@/utils/bx24-wrapper'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeader,
    UserSelectField
  },
  data: () => ({
    loading: false,
    managers: [],
    deals: [],
    tableHeight: null,
    homeLink: {
      text: 'Отчеты по ведению сделок',
      to: { name: 'deals.filling-statistics' }
    },
    headers: [
      { text: '#', align: 'center', value: 'index', sortable: true },
      { text: 'Менеджер', align: 'left', value: 'name', sortable: true },
      { text: 'Количество сделок', align: 'center', value: 'dealsNumber', sortable: true },
      { text: 'Компания', align: 'center', value: 'has_company_name', sortable: true, positiveLabel: 'Компания указана', negativeLabel: 'Компания не указана', sort: (a, b) => a.negative - b.negative },
      { text: 'ИНН', align: 'center', value: 'has_inn', sortable: true, positiveLabel: 'ИНН в компании указан', negativeLabel: 'ИНН в компании не указан', sort: (a, b) => a.negative - b.negative },
      { text: 'Контакт', align: 'center', value: 'has_name', sortable: true, positiveLabel: 'Контакт указан', negativeLabel: 'Контакт не указан', sort: (a, b) => a.negative - b.negative },
      { text: 'E-mail', align: 'center', value: 'has_email', sortable: true, positiveLabel: 'E-mail в контакте или компании указан', negativeLabel: 'E-mail в контакте или компании не указан', sort: (a, b) => a.negative - b.negative },
      { text: 'Сумма', align: 'center', value: 'has_sum', sortable: true, positiveLabel: 'Сумма в сделке указана', negativeLabel: 'Сумма в сделке не указана', sort: (a, b) => a.negative - b.negative },
      { text: 'Тип клиента', align: 'center', value: 'has_client_type', sortable: true, positiveLabel: 'Тип клиента в сделке указан', negativeLabel: 'Тип клиента в сделке не указан', sort: (a, b) => a.negative - b.negative },
      { text: 'Категория', align: 'center', value: 'has_category', sortable: true, positiveLabel: 'Категория в сделке указана', negativeLabel: 'Категория в сделке не указана', sort: (a, b) => a.negative - b.negative },
      { text: 'Регион', align: 'center', value: 'has_region', sortable: true, positiveLabel: 'Регион в сделке указан', negativeLabel: 'Регион в сделке не указан', sort: (a, b) => a.negative - b.negative },
      { text: 'Активность', align: 'center', value: 'has_planned_call', sortable: true, positiveLabel: 'Есть дела в сделке', negativeLabel: 'Сделка без дел', sort: (a, b) => a.negative - b.negative },
      { text: 'Тема звонка', align: 'center', value: 'has_correct_call_description', sortable: true, positiveLabel: 'Тема звонка введена вручную', negativeLabel: 'Тема звонка введена вручную', sort: (a, b) => a.negative - b.negative },
      { text: 'Звонок позже 60 дней', align: 'center', value: 'has_planned_call_after_last_call', sortable: true, positiveLabel: 'Звонок запланирован на ближайшие 60 дней', negativeLabel: 'Нет запланированного звонка на ближайшие 60 дней', sort: (a, b) => a.negative - b.negative },
      { text: 'Нет просроченных звонков', align: 'center', value: 'has_no_overdue_calls', sortable: true, positiveLabel: 'Нет просроченных звонков', negativeLabel: 'Есть просроченные звонки', sort: (a, b) => a.negative - b.negative },
      { text: 'За последние 60 дней был звонок', align: 'center', value: 'has_recent_calls', sortable: true, positiveLabel: 'За последние 60 дней был звонок', negativeLabel: 'За последние 60 дней не было звонка', sort: (a, b) => a.negative - b.negative }
    ],
    breadcrumbs: [
      { text: 'Сводка по менеджерам' }
    ],
    additionalAdminUserIds: [
      29, // Соловьев
      654, // Пальчун
      537, // Моисеева
      366 // Балаян
    ],
    asPercent: false
  }),
  computed: {
    selectedManagerNames() {
      return this.managers.map((manager) => manager.name)
    },
    selectedManagerIds() {
      return this.managers.map((manager) => manager.id)
    },
    isUserSelected() {
      return Boolean(this.managers.length)
    },
    summary() {
      return FillingStatisticsService.calculateSummary(this.deals)
    },
    statistics() {
      const dealsManager = this.deals.reduce((hash, obj) => ({ ...hash, [obj['assigned_by_id']]:( hash[obj['assigned_by_id']] || [] ).concat(obj) }), {})

      return this.managers.map((manager) => {
        const managerDeals = dealsManager?.[manager.id] || []

        return {
          ...manager,
          dealsNumber: managerDeals.length,
          has_company_name: this.countOccurrences(managerDeals, 'has_company_name'),
          has_inn: this.countOccurrences(managerDeals, 'has_inn'),
          has_name: this.countOccurrences(managerDeals, 'has_name'),
          has_email: this.countOccurrences(managerDeals, 'has_email'),
          has_sum: this.countOccurrences(managerDeals, 'has_sum'),
          has_client_type: this.countOccurrences(managerDeals, 'has_client_type'),
          has_category: this.countOccurrences(managerDeals, 'has_category'),
          has_region: this.countOccurrences(managerDeals, 'has_region'),
          has_planned_call: this.countOccurrences(managerDeals, 'has_planned_call'),
          has_correct_call_description: this.countOccurrences(managerDeals, 'has_correct_call_description'),
          has_planned_call_after_last_call: this.countOccurrences(managerDeals, 'has_planned_call_after_last_call'),
          has_no_overdue_calls: this.countOccurrences(managerDeals, 'has_no_overdue_calls'),
          has_recent_calls: this.countOccurrences(managerDeals, 'has_recent_calls')
        }
      })
    },
    isAdmin() {
      return this.$store.getters['user/isAdmin']('fillingStatistics')
    }
  },
  async mounted() {
    this.calculateTableHeight()
    window.addEventListener('resize', this.calculateTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateTableHeight)
  },
  methods: {
    countOccurrences(data, column) {
      const negative = data.filter((item) => item[column] === false).length
      const positive = data.filter((item) => item[column] === true).length
      const negativePercent = Math.round(100 * negative / data.length)

      return {
        positive,
        negative,
        negativePercent
      }
    },
    calculateTableHeight() {
      this.tableHeight = window.innerHeight - 360
    },
    openUserProfile(id) {
      BX24.openPath(`/company/personal/user/${id}/`)
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
        { header: 'Менеджер', key: 'name', width: 60 },
        { header: 'Количество сделок', key: 'dealsNumber', width: 30 },
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

      this.statistics.forEach((deal) => {
        const row = worksheet.addRow(deal)

        row.eachCell((cell, colNumber) => {
          cell.font = { size: 14 }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
          if (cell.value?.negative > 0) {
            row.getCell(colNumber).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FE634D' }
            }
            cell.value = cell.value?.negative
          }
          else if (cell.value?.negative === 0) {
            row.getCell(colNumber).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '88F94E' }
            }
            cell.value = cell.value?.negative
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
      a.download = 'Ведение сделок.xlsx'
      a.click()
      a.remove()
    },
    async loadData() {
      this.deals = await new FillingStatisticsService(this.selectedManagerIds).getData()
    },
    async refreshData() {
      this.loading = true
      this.deals = []
      await this.loadData()
      this.loading = false
    },
    async changeManager(managers) {
      if (!managers || !managers.length) {
        return
      }
      this.managers = managers
      await this.refreshData()
    }
  }
}
</script>
