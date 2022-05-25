<template>
  <div>
    <v-input :label="label" class="user-search-input" v-bind="$attrs">
      <v-menu
        :close-on-content-click="false"
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <slot name="activator">
            <v-btn
              color="gray"
              v-bind="attrs"
              class="flex align-left"
              v-on="on"
            >
              <svg-icon name="document-search" width="30" height="30" class="mr-1"/>
              <span>{{ !selected || !selected.length ? 'Выберите пользователя' : `Выбрано (${selected.length})` }}</span>
            </v-btn>
          </slot>
        </template>
        <v-card width="800">
          <v-card-text class="pt-0 pb-0">
            <user-search v-model="selected" @input="save"/>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-input>
    <!--    <v-dialog-->
    <!--      v-model="dialog"-->
    <!--      width="90%"-->
    <!--      max-width="1200"-->
    <!--    >-->
    <!--      <template v-slot:activator="{ on, attrs }">-->
    <!--        <v-card v-bind="attrs" v-on="on">-->
    <!--          <v-card-title class="cursor-pointer">-->
    <!--            <svg-icon name="document-search" width="30" height="30" class="mr-1" />-->
    <!--            {{ placeholder }}-->
    <!--          </v-card-title>-->
    <!--        </v-card>-->
    <!--      </template>-->
    <!--      <v-card>-->
    <!--        <v-card-title class="text-h5 grey lighten-2">-->
    <!--          Выбор пользователя-->
    <!--          <v-spacer></v-spacer>-->
    <!--          <v-btn-->
    <!--            color="green"-->
    <!--            :dark="hasChanges"-->
    <!--            :disabled="!hasChanges"-->
    <!--            class="mr-1"-->
    <!--            @click="save"-->
    <!--          >-->
    <!--            Применить-->
    <!--          </v-btn>-->
    <!--          <v-btn-->
    <!--            outlined-->
    <!--            color="red"-->
    <!--            @click="close"-->
    <!--          >-->
    <!--            Отменить-->
    <!--          </v-btn>-->
    <!--        </v-card-title>-->
    <!--        <v-card-text>-->
    <!--          <user-search v-model="selected" />-->
    <!--        </v-card-text>-->
    <!--        <v-divider></v-divider>-->
    <!--      </v-card>-->
    <!--    </v-dialog>-->
  </div>
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
      default: () => []
    },
    label: {
      type: String,
      default: ''
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
      return this.value?.length !== this.selected?.length || (!this.multiple ? this.value !== this.selected : !!this.value.find((value, index) => value !== this.selected[index]))
    },
    placeholder() {
      if (!this.value || !this.value.length) {
        return 'Выберите пользователя'
      }

      return `${this.$declension(this.value.length, ['Выбран', 'Выбрано', 'Выбрано'])} ${this.value.length} ${this.$declension(this.value.length, ['пользователь', 'пользователя', 'пользователей'])}`
    }
  },
  watch: {
    value() {
      this.refreshValue()
    }
  },
  methods: {
    refreshValue() {
      this.selected = Array.isArray(this.value)
        ? [...this.value]
        : this.value
    },
    save() {
      this.$emit('input', this.selected)
      this.dialog = false
    },
    close() {
      this.dialog = false
    }
  }
}
</script>

<style lang="scss">
.user-search-input {
  > .v-input__control > .v-input__slot {
    align-items: start;
    flex-direction: column;
  }

  .v-label {
    margin-bottom: 12px;
  }
}
</style>
