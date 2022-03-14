<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="value"
        prepend-icon="mdi-calendar"
        v-bind="Object.assign({}, attrs, $attrs)"
        @input="$emit('input', $event)"
        v-on="on"
      />
    </template>
    <v-date-picker
      :value="value"
      no-title
      scrollable
      locale="ru-RU"
      @input="$emit('input', $event); $refs.menu.save($event)"
    >
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="menu = false">Отмена</v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(value)">OK</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data: () => ({
    menu: false,
    showMenu: false
  })
}
</script>
