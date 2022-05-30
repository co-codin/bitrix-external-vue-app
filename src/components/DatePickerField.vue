<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="value"
        :label="label"
        prepend-icon="mdi-calendar"
        v-bind="Object.assign(attrs, $attrs)"
        @click:prepend="menu = !menu"
        v-on="on"
        @change="$emit('input', $event)"
      />
    </template>
    <v-date-picker
      :value="formattedDate"
      scrollable
      locale="ru-RU"
      no-title
      @input="datePickerChanged"
    />
  </v-menu>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null
    },
    value: {
      required: true
    }
  },
  data: () => ({
    menu: false
  }),
  computed: {
    formattedDate() {
      if (!this.value) {
        return null
      }

      const [day, month, year] = this.value.split('.')

      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  },
  methods: {
    datePickerChanged(value) {
      this.menu = false
      this.$emit('input', this.formatDate(value))
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')

      return `${day}.${month}.${year}`
    }
  }
}
</script>
