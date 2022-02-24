<template>
  <div>
    <page-header h1="Установка приложений" :breadcrumbs="breadcrumbs" />
    <page-loader v-if="loading" message="Идет загрузка приложений" />
    <v-expansion-panels v-else>
      <v-expansion-panel v-for="(app, index) in apps" :key="index">
        <v-expansion-panel-header class="title">
          {{ app.name }}
          <span v-if="app.isInstalled" class="text-sm-caption green--text ml-2">
            Установлено
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            {{ app.description }}
          </p>
          <div>
            <v-btn
              v-if="!app.isInstalled"
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
import PageLoader from '../components/PageLoader'

export default {
  components: {
    PageHeader,
    PageLoader
  },
  data: () => ({
    breadcrumbs: [{ text: 'Установка приложений' }],
    loading: true,
    installedApps: []
  }),
  computed: {
    apps() {
      return this.$config.apps.map((app) => ({
        ...app,
        isInstalled: this.isInstalled(app)
      }))
    }
  },
  mounted() {
    BX24.init(this.loadInstalledApps)
  },
  methods: {
    installApp(app) {
      try {
        BX24.callMethod('placement.bind', {
          PLACEMENT: app.placement,
          HANDLER: this.getHandlerFullPath(app.handler),
          TITLE: app.buttonLabel,
          DESCRIPTION: app.description
        })
        this.loadInstalledApps()
      }
      catch (e) {
        console.log(e)
      }
    },
    loadInstalledApps() {
      BX24.callMethod('placement.get', {}, (response) => {
        if (response.data()) {
          this.installedApps = response.data()
          this.loading = false

          return
        }

        alert('Произошла ошибка при загрузке приложений')
      })
    },
    deleteApp(app) {
      try {
        BX24.callMethod('placement.unbind', {
          PLACEMENT: app.placement,
          HANDLER: this.getHandlerFullPath(app.handler)
        })
        this.loadInstalledApps()
      }
      catch (e) {
        console.log(e)
      }
    },
    isInstalled(app) {
      return !! this.installedApps.find((installedApp) => {
        return installedApp.handler === this.getHandlerFullPath(app.handler)
          && installedApp.placement === app.placement
      })
    },
    getHandlerFullPath(handler) {
      return `https://bitrix-external-app.medeqstars.com${handler}`
    }
  }
}
</script>
