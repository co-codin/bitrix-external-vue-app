<template>
  <v-card>
    <v-card-title class="cursor-pointer" @click="selectUser">
      <document-search-icon width="30" height="30" class="mr-1" />
      {{ label }}
    </v-card-title>
  </v-card>
</template>

<script>
import DocumentSearchIcon from '@/components/heroicons/DocumentSearchIcon'

export default {
  components: { DocumentSearchIcon },
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
      if (!this.value) {
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
