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
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import DocumentSearchIcon from '@/components/heroicons/DocumentSearchIcon'

export default {
  components: {
    DocumentSearchIcon
  },
  data: () => ({
    loading: false,
    manager: null,
    deals: [
      { id: 10202, name: '#22102 / Максим / Москва', is_phone_filled: 'Да' }
    ],

    headers: [
      { text: '', align: 'left', value: 'name', sortable: false },
      { text: 'Указана компания', value: 'is', sortable: false },
      { text: 'Указан ИНН', value: 'is', sortable: false },
      { text: 'Указано имя', value: 'is', sortable: false },
      { text: 'Указана почта', value: 'is', sortable: false },
      { text: 'БД', value: 'is', sortable: false },
      { text: 'Просрочен звонок', value: 'is', sortable: false },
      { text: 'За последние 60 дней не было звонка', value: 'is', sortable: false },
      { text: 'Звонок позже 60 дней', value: 'is', sortable: false },
      { text: 'Указана сумма', value: 'is', sortable: false }
    ]
  }),
  computed: {
    isUserSelected() {
      return !! this.manager?.name
    }
  },
  methods: {
    openDeal(dealId) {
      BX24.openPath(`/crm/deal/details/${dealId}`)
      // open deal slider
    },
    selectUser() {
      BX24.selectUser((data) => {
        this.manager = { ...data }
        this.loadDeals()
      })
    },
    loadDeals() {
      this.loading = true
      // loading deals for selected user
      this.loading = false
    }
  }
}
</script>
