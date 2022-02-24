<template>
  <div>
    <page-header h1="Изменение статуса задачи" :show-home-link="false" />
    <v-card>
      <v-card-text>
        <v-form>
          <v-select
            label="Статус задачи"
            :items="taskStatusLabels"
            placeholder="Выберите статус задачи"
          />
        </v-form>
      </v-card-text>
    </v-card>
    <div class="mt-2 text-right">
      <v-btn color="primary">Изменить статус</v-btn>
    </div>
  </div>
</template>

<script>
import PageHeader from '../../components/PageHeader'

export default {
  components: {
    PageHeader
  },
  data: () => ({
    taskStatusLabels: [
      { text: 'В оплате', value: 'В оплате' },
      { text: 'Ждем поставку', value: 'Ждем поставку' },
      { text: 'Отписка', value: 'Отписка' },
      { text: 'Отгрузка', value: 'Отгрузка' },
      { text: 'Установка', value: 'Установка' }
    ]
  })
}
</script>
