<template>
  <div>
    <page-header h1="Изменение статуса задачи" :show-home-link="false"/>
    <page-loader v-if="loading"/>
    <v-alert v-else-if="error" type="error" text v-text="error" />
    <template v-else>
      <v-form @submit.prevent="changeTaskStatus">
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
          <v-btn color="primary" type="submit">Изменить статус задачи</v-btn>
        </div>
      </v-form>
    </template>
  </div>
</template>

<script>
import PageHeader from '../../components/PageHeader'
import PageLoader from '../../components/PageLoader'

export default {
  components: {
    PageHeader,
    PageLoader
  },
  data: () => ({
    loading: true,
    error: null,
    taskStatusLabels: [
      { text: 'В оплате', value: 'В оплате' },
      { text: 'Ждем поставку', value: 'Ждем поставку' },
      { text: 'Отписка', value: 'Отписка' },
      { text: 'Отгрузка', value: 'Отгрузка' },
      { text: 'Установка', value: 'Установка' }
    ],
    form: {
      status: null
    },
    task: null
  }),
  mounted() {
    this.loadTask()
  },
  methods: {
    loadTask() {
      const { options } = BX24.placement.info()
      const taskId = options?.ID ?? options?.TASK_ID // bitrix из списка задач отдает ID, а через карточку задачи TASK_ID

      BX24.callMethod('tasks.task.get', { taskId, select: ['uf_task_status'] }, (response) => {
        this.loading = false
        if (response.data()) {
          this.task = response.data().task

          return
        }
        this.error = 'Произошла ошибка при получении данных'
      })
    },
    changeTaskStatus() {
      BX24.callMethod(
        'tasks.task.update',
        { taskId: this.task.id, fields: { UF_TASK_STATUS: this.form.status } },
        () => {
          BX24.closeApplication()
        }
      )
    }
  }
}
</script>
