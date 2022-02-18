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
        name: 'Файлы к задачам',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto asperiores consequuntur cum dicta, dolorem eligendi expedita placeat porro quod temporibus? Dignissimos et hic id iusto libero modi sed sunt temporibus unde vitae! Ad corporis ducimus molestias, perspiciatis quam quia ut. A, adipisci alias animi autem beatae consectetur consequuntur, ducimus eveniet excepturi exercitationem fuga in iure magnam maxime nisi optio pariatur porro quaerat quisquam quod repellat saepe soluta suscipit voluptas voluptatum? Accusamus atque dignissimos id natus odit praesentium vel velit. Aspernatur beatae explicabo molestias, odio quae quis velit? Accusantium, amet culpa, cumque dicta doloremque neque nulla porro repellendus sapiente, unde velit.',
        placement: 'task.tabs',
        installed: false
      },
      {
        name: 'Создание подзадач закупщика',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto asperiores consequuntur cum dicta, dolorem eligendi expedita placeat porro quod temporibus? Dignissimos et hic id iusto libero modi sed sunt temporibus unde vitae! Ad corporis ducimus molestias, perspiciatis quam quia ut. A, adipisci alias animi autem beatae consectetur consequuntur, ducimus eveniet excepturi exercitationem fuga in iure magnam maxime nisi optio pariatur porro quaerat quisquam quod repellat saepe soluta suscipit voluptas voluptatum? Accusamus atque dignissimos id natus odit praesentium vel velit. Aspernatur beatae explicabo molestias, odio quae quis velit? Accusantium, amet culpa, cumque dicta doloremque neque nulla porro repellendus sapiente, unde velit.',
        placement: 'task.tabs',
        installed: true
      }
    ],
    breadcrumbs: [{ text: 'Установка приложений' }]
  }),
  created() {
    window.BX24.callMethod('user.get', { ID: 126 }, (res) => {
      if (res.data()) {
        const user = res.data()?.[0]

        if (user)
          alert('Пользователя №' + user?.ID + ' зовут ' + user?.NAME)
      }
    })
  },
  methods: {
    installApp(app) {
      console.log(app)
    },
    deleteApp(app) {
      console.log(app)
    }
  }
}
</script>
