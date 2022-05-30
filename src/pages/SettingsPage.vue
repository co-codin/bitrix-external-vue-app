<template>
  <div>
    <page-header h1="Настройки" :breadcrumbs="breadcrumbs" />
    <v-card>
      <v-card-title>Выходные и праздничные дни</v-card-title>
      <v-card-text>
        <p>Введите праздничные дни через запятую</p>
        <v-combobox
          v-model="settings[`holidays-${$dayjs().format('YYYY')}`].value"
          :search-input.sync="settings[`holidays-${$dayjs().format('YYYY')}`].searchText"
          filled
          chips
          deletable-chips
          :items="defaultHolidays"
          multiple
          hide-details="auto"
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  По запросу "<strong>{{ settings[`holidays-${$dayjs().format('YYYY')}`].searchText }}</strong>" ничего не найдено. Нажмите <kbd>enter</kbd> для того, чтобы добавить день
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-combobox>
        <v-btn text class="mt-1" color="primary" @click="addDefaultHolidays">Добавить все праздники по умолчанию</v-btn>
        <div class="text-right">
          <v-btn type="submit" color="green" dark @click="saveSetting('holidays')">Сохранить</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import PageHeader from '../components/PageHeader'

export default {
  components: {
    PageHeader
  },
  data() {
    const data = {
      breadcrumbs: [{ text: 'Настройки' }],
      defaultHolidays: [
        '01.01',
        '07.01',
        '23.02',
        '08.03',
        '01.05',
        '09.05'
      ],
      settings: {}
    }

    data.settings[`holidays-${this.$dayjs().format('YYYY')}`] = {
      value: null,
      searchText: null
    }

    return data
  },
  created() {
    Object.keys(this.settings)
      .map((key) => BX24.appOption.get(`settings.${key}`))
      .forEach((value, key) => this.settings[key].value = JSON.parse(value))
  },
  methods: {
    addDefaultHolidays() {
      this.settings[`holidays-${this.$dayjs().format('YYYY')}`].value = this.defaultHolidays
    },
    saveSetting(key) {
      const { value } = this.settings[key]

      BX24.appOption.set(`settings.holidays-${this.$dayjs().format('YYYY')}`, JSON.stringify(value), () => {
        this.$snackbar('Настройки успешно сохранены')
      })
    }
  }
}
</script>
