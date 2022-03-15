<template>
  <div>
    <page-header h1="Статистика заполнения сделок" :show-home-link="false"/>
    <v-btn @click="selectUser">
      <span v-if="isUserSelected">
        {{ manager.name }}
      </span>
      <span v-else>
        Выбрать пользователя
      </span>
    </v-btn>

    <v-card v-if="isUserSelected" class="mt-3">
      <v-data-table
        v-if="deals.length"
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
      <v-alert v-else color="primary" text class="text-center">
        Выберите ответственного менеджера
      </v-alert>
    </v-card>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'

export default {
  name: 'FillingStatistics',
  components: {
    PageHeader
  },
  data: () => ({
    loading: false,
    manager: null,
    deals: [
      { id: 10202, name: '#22102 / Максим / Москва', is_phone_filled: 'Да' }
    ],
    headers: [
      { text: 'Сделка', align: 'left', value: 'name', sortable: false },
      { text: 'Телефон заполнен?', align: 'left', value: 'is_phone_filled', sortable: false },
      { text: '', sortable: false, align: 'right', value: 'action' }
    ],
    managers: [
      { text: 'Иван Петров', value: 1 },
      { text: 'Иван Петров', value: 2 },
      { text: 'Иван Петров', value: 3 },
      { text: 'Иван Петров', value: 4 }
    ]
  }),
  computed: {
    isUserSelected() {
      return !! this.manager?.name
    }
  },
  methods: {
    openDeal(dealId) {
      // open deal slider
    },
    selectUser() {
      BX24.selectUser((data) => {
        console.log(data)
      })
    }
  }
}
</script>
