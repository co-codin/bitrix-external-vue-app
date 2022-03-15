<template>
  <div>
    <page-header h1="Создание подзадач закупщиком" :show-home-link="false" />
    <v-alert dense outlined type="info">
      Перед созданием подзадач, загрузите документы к базовой задаче во вкладке "Документы"
    </v-alert>
    <v-form @submit.prevent="createTasks">
      <v-expansion-panels multiple>
        <v-expansion-panel v-for="(task, index) in tasks" :key="index">
          <v-expansion-panel-header class="title">
            {{ task.type ? task.type.text : '(выберите тип)' }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-select
              v-model="task.type"
              label="Тип задачи"
              dense
              return-object
              :items="taskTypes"
              placeholder="Выберите тип задачи"
            />
            <v-select
              v-if="isAvailableField(task.type, 'bill')"
              v-model="task.bill"
              label="Счет"
              dense
              :items="files"
              placeholder="Выберите счет"
            />
            <v-select
              v-if="isAvailableField(task.type, 'transfer_document')"
              v-model="task.transfer_document"
              label="УПД"
              dense
              :items="files"
              placeholder="Выберите УПД"
            />
            <v-textarea
              v-if="isAvailableField(task.type, 'manager_contacts')"
              v-model="task.manager_contacts"
              label="Контактный менеджер"
              placeholder="Введите контакты менеджера"
              rows="5"
            />
            <v-textarea
              v-if="isAvailableField(task.type, 'logistics_contacts')"
              v-model="task.logistics_contacts"
              label="Контакты логиста + адрес склада"
              placeholder="Введите контакты логиста + адрес склада"
              rows="5"
            />
            <v-textarea
              v-if="isAvailableField(task.type, 'equipment')"
              v-model="task.equipment"
              label="Комплектация"
              placeholder="Введите комплектацию оборудования"
              rows="5"
            />
            <v-textarea
              v-if="isAvailableField(task.type, 'serial_number')"
              v-model="task.serial_number"
              label="Серийный номер"
              placeholder="Введите серийный номер"
              rows="3"
            />
            <v-divider class="my-2"/>
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
        <v-divider class="my-3"/>
        <div class="text-right">
          <v-btn
            type="submit"
            color="green"
            dark
            large
            :loading="loading"
            :disabled="loading"
          >
            Создать подзадачи ({{ tasks.length }})
          </v-btn>
        </div>
      </template>
    </v-form>
  </div>
</template>

<script>
import PageHeader from '../../components/PageHeader'
import config from '../../configs'
import BX24Wrapper from '@/utils/bx24-wrapper'

export default {
  components: {
    PageHeader
  },
  data: () => ({
    taskId: null,
    loading: false,
    taskTypes: [
      { header: 'Отгрузка' },
      { text: 'Отгрузка от поставщика', value: 1, fields: ['bill', 'transfer_document', 'manager_contacts', 'logistics_contacts'] },
      { text: 'Отгрузка с нашего склада', value: 2, fields: ['bill', 'transfer_document'] },
      { text: 'Отгрузка без отписки от поставщика', value: 3, fields: ['bill', 'transfer_document', 'manager_contacts', 'logistics_contacts'] },
      { text: 'Отгрузка без отписки с нашего склада', value: 4, fields: ['bill', 'transfer_document'] },
      { text: 'Самовывоз', value: 5, fields: ['bill', 'transfer_document'] },
      { text: 'Получение груза у поставщика', value: 6, fields: ['bill', 'manager_contacts', 'logistics_contacts'] },
      { text: 'Частичная отгрузка от поставщика', value: 7, fields: ['bill', 'transfer_document', 'manager_contacts', 'logistics_contacts'] },
      { text: 'Частичная отгрузка с нашего склада', value: 8, fields: ['bill', 'transfer_document'] },
      { text: 'Финальная отгрузка', value: 9, fields: ['bill', 'transfer_document', 'manager_contacts', 'logistics_contacts'] },
      { header: 'Документооборот' },
      { text: 'Документооборот с поставщиком', value: 16, fields: ['bill', 'transfer_document', 'manager_contacts'] },
      { header: 'Отписка' },
      { text: 'Отписка', value: 10, fields: ['bill', 'transfer_document', 'equipment'] },
      { text: 'Частичная отписка', value: 11, fields: ['bill', 'transfer_document', 'equipment'] },
      { text: 'Финальная отписка', value: 12, fields: ['bill', 'transfer_document', 'equipment'] },
      { text: 'Отписка без перехода права собственности', value: 13, fields: ['bill', 'transfer_document', 'equipment'] },
      { header: 'Ввод в эксплуатацию' },
      { text: 'Установка оборудования при помощи сторонних компаний', value: 14, fields: ['equipment', 'serial_number', 'bill', 'transfer_document', 'company_contacts'] },
      { text: 'Установка оборудования за наш счет', value: 15, fields: ['equipment', 'serial_number'] }
    ],
    files: [],
    tasks: []
  }),
  mounted() {
    this.getTaskFiles()
  },
  methods: {
    async getTaskFiles() {
      const { options } = BX24.placement.info()

      this.taskId = options?.ID ?? options?.TASK_ID

      try {
        const task = await (new BX24Wrapper()).callMethod(
          'task.item.getdata',
          [this.taskId]
        )

        this.files = task.UF_TASK_WEBDAV_FILES
        this.files = this.files.map((file) => {
          return {
            text: file.NAME,
            value: file.FILE_ID
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    addTask() {
      this.tasks.push({
        type: null, // тип задачи
        bill: null, // счет
        transfer_document: null, // упд
        manager_contacts: null, // контактный менеджер
        company_contacts: null, // контакты компании
        logistics_contacts: null, // контакты логиста
        equipment: null, // оборудование / комплектация
        serial_number: null, // серийный номер
        description: null,
        name: null
      })
    },
    deleteTask(index) {
      this.tasks.splice(index, 1)
    },
    async createTasks() {
      this.loading = true

      this.tasks.forEach((task, index) => {
        task.name =  this.taskTypes.find(type => type.value === task.type.value).text
        if (task.type) {
          task.description += 'Тип задачи: ' + taskName + '\n'
        }

        if (task.bill) {
          task.description += 'Счет: в приложении' + '\n'
        }

        if (task.transfer_document) {
          task.description += 'УПД: в приложении' + '\n'
        }

        if (task.manager_contacts) {
          task.description += 'Контактный менеджер: ' + task.manager_contacts + '\n'
        }

        if (task.company_contacts) {
          task.description += 'Контактный компании: ' + task.company_contacts + '\n'
        }

        if (task.logistics_contacts) {
          task.description += 'Контактный логиста: ' + task.logistics_contacts + '\n'
        }

        if (task.equipment) {
          task.description += 'Оборудование / комплектация: ' + task.equipment + '\n'
        }

        if (task.serial_number) {
          task.description += 'Серийный номер: ' + task.serial_number + '\n'
        }
      })

      const batch = this.tasks.map((task) => {
        return [
          'task.item.add',
          {
            PARENT_ID: this.taskId,
            TITLE: task.name,
            RESPONSIBLE_ID: config.bitrix.responsible_ids.supplier,
            DESCRIPTION: task.description
          }
        ]
      })

      try {
        const batchResponse = await (new BX24Wrapper()).callBatch(batch, false)

        console.log(batchResponse)
      } catch (e) {
        this.$snackbar(e.message)
      }

      // BX24.callMethod('task.item.add', [{
      //   PARENT_ID: this.taskId,
      //   TITLE: taskName,
      //   RESPONSIBLE_ID: config.bitrix.responsible_ids.supplier,
      //   DESCRIPTION: description
      // }], (res) => {
      // if (res.data()) {
      //   const currentTaskId = res.data()
      //
      //   if (task.bill) {
      //     BX24.callMethod('tasks.task.files.attach', {
      //       taskId: currentTaskId,
      //       fileId: task.bill
      //     }, () => {
      //     })
      //   }
      //
      //   if (task.transfer_document) {
      //     BX24.callMethod('tasks.task.files.attach', {
      //       taskId: currentTaskId,
      //       fileId: task.transfer_document
      //     }, () => {
      //     })
      //   }
      //   this.tasks.splice(index, 1)
      // }
      //
      //   if (res.error()) {
      //     this.$snackbar(res.error()?.ex?.error_description)
      //   }
      // })

      this.loading = false
    },
    isAvailableField(type, field) {
      return (type?.fields ?? []).includes(field)
    }
  }
}
</script>
