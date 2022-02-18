<template>
  <div>
    <page-header h1="Создание подзадач закупщиком" />
    <p>Добавьте подзадачи и заполните обязательные поля.</p>
    <v-form>
      <v-expansion-panels multiple>
        <v-expansion-panel v-for="(task, index) in tasks" :key="index">
          <v-expansion-panel-header class="title">
            {{ task.type ? getTaskTypeLabel(task.type) : '(выберите тип)' }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-select
              v-model="task.type"
              dense
              :items="taskTypes"
              placeholder="Выберите тип задачи"
            />
            <v-divider class="my-2" />
            <div class="text-center">
              <v-btn small color="red" dark @click="deleteTask(index)">Удалить</v-btn>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel readonly>
          <v-expansion-panel-header hide-actions>
            <div class="text-center">
              <v-btn color="primary" @click="addTask">Добавить подзадачу</v-btn>
            </div>
          </v-expansion-panel-header>
        </v-expansion-panel>
      </v-expansion-panels>
      <template v-if="tasks.length">
        <v-divider class="my-3" />
        <div class="text-right">
          <v-btn type="submit" color="green" dark large>
            Создать подзадачи ({{ tasks.length }})
          </v-btn>
        </div>
      </template>
    </v-form>
  </div>
</template>

<script>
import PageHeader from '../../components/PageHeader'

export default {
  components: {
    PageHeader
  },
  data: () => ({
    taskTypes: [
      { header: 'Отгрузка' },
      { text: 'Отгрузка от поставщика', value: 1 },
      { text: 'Отгрузка с нашего склада', value: 2 },
      { text: 'Отгрузка без отписки от поставщика', value: 3 },
      { text: 'Отгрузка без отписки с нашего склада', value: 4 },
      { text: 'Самовывоз', value: 5 },
      { text: 'Получение груза у поставщика', value: 6 },
      { text: 'Частичная отгрузка от поставщика', value: 7 },
      { text: 'Частичная отгрузка с нашего склада', value: 8 },
      { text: 'Финальная отгрузка', value: 9 },
      { header: 'Документооборот' },
      { text: 'Документооборот с поставщиком' },
      { header: 'Отписка' },
      { text: 'Отписка', value: 10 },
      { text: 'Частичная отписка', value: 11 },
      { text: 'Финальная отписка', value: 12 },
      { text: 'Отписка без перехода права собственности', value: 13 },
      { header: 'Ввод в эксплуатацию' },
      { text: 'Установка оборудования при помощи сторонних компаний', value: 14 },
      { text: 'Установка оборудования за наш счет', value: 15 }
    ],
    tasks: []
  }),
  mounted() {
    console.log(this.$route.query)
  },
  methods: {
    addTask() {
      this.tasks.push({
        type: null
      })
    },
    deleteTask(index) {
      this.tasks.splice(index, 1)
    },
    getTaskTypeLabel(type) {
      return this.taskTypes.find((task) => task.value === type)?.text
    }
  }
}
</script>
