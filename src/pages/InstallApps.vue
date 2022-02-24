<template>
  <div>
    <page-header h1="Установка приложений" :breadcrumbs="breadcrumbs" />
    <div v-if="loading">
      <v-card :loading="loading">
        <v-card-text class="text-caption">
          Идет загрузка приложений...
        </v-card-text>
      </v-card>
    </div>
    <v-expansion-panels v-else>
      <v-expansion-panel v-for="(app, index) in $config.apps" :key="index">
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
    breadcrumbs: [{ text: 'Установка приложений' }],
    loading: true
  }),
  mounted() {
    BX24.init(this.loadInstalledApps)
  },
  methods: {
    installApp(app) {
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
    loadInstalledApps() {
      BX24.callMethod('placement.get', {}, (response) => {
        if (response.data()) {
          console.log(response.data())
          this.loading = false

          return
        }

        alert('Произошла ошибка при загрузке приложений')
      })
    },
    deleteApp(app) {
      console.log(app)
    }
  }
}
</script>
