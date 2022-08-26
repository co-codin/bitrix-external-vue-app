<template>
  <div>
    <page-header h1="Настройки" :breadcrumbs="breadcrumbs" :home-link="homeLink" />
    <v-card>
      <v-card-title>Выходные и праздничные дни</v-card-title>
      <v-card-text>
        <v-combobox
          v-model="settings[holidays.settingKey]"
          :search-input.sync="holidays.searchText"
          filled
          chips
          deletable-chips
          :items="holidays.defaultHolidays"
          multiple
          clearable
          hide-details="auto"
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  По запросу "<strong>{{ holidays.searchText }}</strong>" ничего не найдено. Нажмите <kbd>enter</kbd> для того, чтобы добавить день
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-combobox>
        <v-btn text class="mt-1" color="primary" @click="addDefaultHolidays">Добавить все праздники по умолчанию</v-btn>
      </v-card-text>
      <v-card-actions class="card-actions">
        <v-btn
          type="submit"
          color="green"
          dark
          @click="saveSetting(holidays.settingKey)"
        >Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'

export default {
  components: {
    PageHeader
  },
  data() {
    const data = {
      breadcrumbs: [{ text: 'Настройки' }],
      settings: {},
      holidays: {
        searchText: null,
        defaultHolidays: [
          '01.01',
          '07.01',
          '23.02',
          '08.03',
          '01.05',
          '09.05'
        ],
        settingKey: `holidays-${this.$dayjs().format('YYYY')}`
      },
      homeLink: {
        text: 'MEDEQ Application',
        to: { name: 'external-app.home' }
      }
    }

    data.settings[data.holidays.settingKey] = null

    return data
  },
  created() {
    Object.keys(this.settings)
      .forEach((key) => this.settings[key] = JSON.parse(BX24.appOption.get(`settings.${key}`) || '""'))
  },
  methods: {
    addDefaultHolidays() {
      this.settings[this.holidays.settingKey] = this.holidays.defaultHolidays
    },
    saveSetting(key) {
      BX24.appOption.set(`settings.${key}`, JSON.stringify(this.settings[key]), () => {
        this.$snackbar('Настройки успешно сохранены')
      })
    }
  }
}
</script>

<style>
.card-actions {
  padding: 15px;
  background: #f9fafb;
  justify-content: right;
  text-align: right;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
</style>
