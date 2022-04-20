<template>
  <v-dialog
    v-model="dialog"
    width="90%"
    scrollable
    max-width="1200"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-card v-bind="attrs" v-on="on">
        <v-card-title class="cursor-pointer">
          <svg-icon name="document-search" width="30" height="30" class="mr-1" />
          {{ placeholder }}
        </v-card-title>
      </v-card>
    </template>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Выбор пользователя
      </v-card-title>
      <v-card-text>
        <user-search v-model="selected" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green"
          :dark="hasChanges"
          :disabled="!hasChanges"
          @click="save"
        >
          Применить
        </v-btn>
        <v-btn
          outlined
          color="red"
          @click="close"
        >
          Отменить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import UserSearch from '@/components/UserSearch'

export default {
  components: {
    UserSearch
  },
  props: {
    value: {
      type: Array || Number,
      required: true
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialog: false,
      selected: Array.isArray(this.value)
        ? [...this.value]
        : this.value
    }
  },
  computed: {
    hasChanges() {
      return this.value?.length !== this.selected?.length || (!this.multiple ? this.value !== this.selected : !! this.value.find((value, index) => value !== this.selected[index]))
    },
    placeholder() {
      if (!this.value || !this.value.length) {
        return 'Выберите пользователя'
      }

      return `${this.$declension(this.value.length, ['Выбран', 'Выбрано', 'Выбрано'])} ${this.value.length} ${this.$declension(this.value.length, ['пользователь', 'пользователя', 'пользователей'])}`
    }
  },
  methods: {
    save(value) {
      this.$emit('input', this.selected)
      this.dialog = false
    },
    close() {
      this.dialog = false
    }
  }
}
</script>
