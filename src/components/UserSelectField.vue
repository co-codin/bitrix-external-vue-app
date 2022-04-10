<template>
  <v-card v-bind="$attrs">
    <v-card-title class="cursor-pointer" @click="selectUser">
      <svg-icon name="document-search" width="30" height="30" class="mr-1" />
      {{ label }}
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Выберите пользователя'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object || Array,
      default: null
    }
  },
  computed: {
    label() {
      if (!this.value || (Array.isArray(this.value) && !this.value.length)) {
        return this.placeholder
      }

      if (this.multiple) {
        return this.value.map((user) => user.name).join(', ')
      }

      return this.value.name
    },
    selectMethod() {
      return this.multiple ? 'selectUsers' : 'selectUser'
    }
  },
  methods: {
    selectUser() {
      BX24[this.selectMethod](async (data) => {
        if (!data) {
          return
        }
        this.$emit('input', data)
      })
    }
  }
}
</script>
