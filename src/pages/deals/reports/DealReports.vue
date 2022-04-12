<template>
  <div>
    <page-header h1="Отчеты по сделкам" :show-home-link="false" />
    <v-list two-line subheader>
      <v-subheader inset>Выберите тип отчета</v-subheader>

      <v-list-item :to="{ name: 'deals.reports.filling-statistics-by-manager' }">
        <v-list-item-avatar>
          <v-icon class="blue white--text">mdi-account</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            Заполнение сделок по менеджеру
          </v-list-item-title>
          <v-list-item-subtitle>Выбираем менеджера и смотрим статистику по нему</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="isAdmin('fillingStatistics')" :to="{ name: 'deals.reports.filling-statistics-by-managers' }">
        <v-list-item-avatar>
          <v-icon class="amber white--text">folder</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            Заполнение сделок по менеджерам
            <v-chip
              color="green lighten-1"
              label
              dark
              x-small
              class="ml-1"
            >
              новое
            </v-chip>
          </v-list-item-title>
          <v-list-item-subtitle>Смотрим сводку по всем менеджерам в одной таблице</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="isAdmin()" :to="{ name: 'deals.reports.deal-count' }">
        <v-list-item-avatar>
          <v-icon class="amber white--text">numeric-nine-plus-box</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            Количество сделок
            <v-chip
              color="green lighten-1"
              label
              dark
              x-small
              class="ml-1"
            >
              новое
            </v-chip>
          </v-list-item-title>
          <v-list-item-subtitle>Количество сделок по менеджерам</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeader
  },
  computed: {
    ...mapGetters({
      isAdmin: 'user/isAdmin'
    })
  }
}
</script>
