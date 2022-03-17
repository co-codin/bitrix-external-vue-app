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
      { text: '', align: 'left', value: 'name', sortable: false },
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
      this.loading = true

      const deals = await (new BX24Wrapper()).callMethod('crm.deal.list', {
        order: { 'CLOSEDATE': 'DESC' },
        filter: { 'ASSIGNED_BY_ID': this.manager.id },
        select: ['ID', 'TITLE', 'COMPANY_ID', 'CONTACT_ID', 'OPPORTUNITY', 'CLOSEDATE', 'ADDITIONAL_INFO', 'UF_ADDITIONAL_INN']
      })

      deals.forEach((deal) => {
        (new BX24Wrapper()).callMethod('crm.deal.contact.items.get', {
          id: deal.ID
        }).then((contact) => {
          if (contact.length) {
            (new BX24Wrapper()).callMethod('crm.contact.list', {
              filter: { 'ID': contact.map((item) => item.CONTACT_ID) }
            }).then((res) => {
              const hasEmail = res.map((item) => item.HAS_EMAIL).includes('Y');

              (new BX24Wrapper()).callMethod('crm.timeline.comment.list', {
                filter: {
                  'ENTITY_ID': 82368,
                  'ENTITY_TYPE': 'deal'
                },
                select: ['ID', 'COMMENT ', 'FILES']
              }).then((comments) => {
                console.log(comments)
              })

              const has_no_overdue_calls = false
              const has_no_recent_calls = false
              const has_planned_call = false

              this.deals.push({
                id: deal.ID,
                name: deal.TITLE,
                has_company_name: !!deal.COMPANY_ID,
                has_inn: !!deal.UF_ADDITIONAL_INN,
                has_name: !!deal.CONTACT_ID,
                has_email: hasEmail,
                has_planned_activity: !!deal.CLOSEDATE,
                has_sum: !!deal.OPPORTUNITY,
                has_no_overdue_calls,
                has_no_recent_calls,
                has_planned_call
              })
            })
          }
        })
      })

      this.loading = false
    },
    getResultCellText(result = true) {

    }
  }
}
</script>
