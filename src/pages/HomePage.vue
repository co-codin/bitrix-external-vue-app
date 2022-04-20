<template>
  <div>
    <page-header h1="MEDEQ Bitrix24 Application" :show-home-link="false" />
    <v-card class="mb-3" light>
      <v-card-title>Приложения</v-card-title>
      <v-card-subtitle>Перейдите в раздел для установки приложений</v-card-subtitle>
      <v-card-text>
        <v-btn dark :to="{name: 'install-apps'}">
          Приложения
        </v-btn>
      </v-card-text>
    </v-card>
    <v-card class="mt-3" light>
      <v-card-title>Настройки</v-card-title>
      <v-card-subtitle>Перейдите в раздел для настройки приложений</v-card-subtitle>
      <v-card-text>
        <v-btn dark :to="{name: 'settings'}">
          Настройки
        </v-btn>
      </v-card-text>
    </v-card>

    <div>
      <user-search-field v-model="users" multiple />
    </div>

  </div>
</template>

<script>
import PageHeader from '../components/PageHeader'
import UserSearchField from '@/components/UserSearchField'

export default {
  components: {
    UserSearchField,
    PageHeader
  },
  data: () => ({
    users: ['1']
  })
}
</script>
