<template>
  <div>
    <page-header h1="Установка приложений" :breadcrumbs="breadcrumbs" />
    <v-expansion-panels>
      <v-expansion-panel v-for="(app, index) in apps" :key="index">
        <v-expansion-panel-header class="title">
          {{ app.name }}
          <span v-if="app.installed" class="text-sm-caption green--text ml-2">
            Установлено
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            {{ app.description }}
          </p>
          <div>
            <v-btn
              v-if="!app.installed"
              small
              color="green"
              dark
              @click="installApp(app)"
            >Установить</v-btn>
            <v-btn
              v-else
              small
              color="red"
              dark
              @click="deleteApp(app)"
            >Удалить</v-btn>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import PageHeader from '../components/PageHeader'

export default {
  components: {
    PageHeader
  },
  data: () => ({
    apps: [
      {
        name: 'Вкладка "Документы" в задачах',
        buttonLabel: 'Документы',
        description: 'Загрузка документов к задачам',
        placement: 'TASK_VIEW_TAB',
        handler: '/tasks/documents',
        installed: false
      },
      {
        name: 'Создание подзадач закупщиком',
        buttonLabel: 'Постпродажный процесс',
        description: 'Создание подзадач закупщиком к базовой задаче',
        placement: 'TASK_LIST_CONTEXT_MENU',
        handler: '/tasks/create-supplier-tasks',
        installed: false
      }
    ],
    breadcrumbs: [{ text: 'Установка приложений' }]
  }),
  methods: {
    installApp(app) {
      console.log(window.BX24?.placement)
      try {
        window.BX24.callMethod('placement.bind', {
          PLACEMENT: app.placement,
          HANDLER: `https://bitrix-external-app.medeqstars.com${app.handler}`,
          TITLE: app.buttonLabel,
          DESCRIPTION: app.description
        })
      }
      catch (e) {
        console.log(e)
      }
    },
    deleteApp(app) {
      console.log(app)
    }
  }
}
</script>
