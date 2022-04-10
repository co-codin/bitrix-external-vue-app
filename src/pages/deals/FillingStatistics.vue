<template>
  <div>
    <page-header h1="Отчеты по заполнению сделок" :show-home-link="false" />
    <v-list two-line subheader>
      <v-subheader inset>Выберите тип отчета</v-subheader>

      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.route"
      >
        <v-list-item-avatar>
          <v-icon
            :class="[item.iconClass]"
            v-text="item.icon"
          ></v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            {{ item.title }}
            <v-chip
              v-if="item.badge"
              color="green lighten-1"
              label
              dark
              x-small
              class="ml-1"
            >
              {{ item.badge }}
            </v-chip>
          </v-list-item-title>
          <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
        </v-list-item-content>

      </v-list-item>

    </v-list>

  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'

export default {
  components: {
    PageHeader
  },
  data: () => ({
    items: [
      { icon: 'mdi-account', iconClass: 'blue white--text', title: 'Заполнение по менеджеру', subtitle: 'Выбираем менеджера и смотрим статистику по нему', route: { name: 'deals.filling-statistics.by-manager' } },
      { icon: 'folder', iconClass: 'amber white--text', title: 'Сводка по менеджерам', subtitle: 'Смотрим сводку по всем менеджерам в одной таблице', route: { name: 'deals.filling-statistics.by-managers' }, badge: 'Новое' }
    ]
  })
}
</script>
