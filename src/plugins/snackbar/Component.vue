<template>
  <v-snackbar
    :top="true"
    :centered="true"
    :value="true"
    :timeout="timeout"
  >
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="blue"
        text
        v-bind="attrs"
        @click="close"
      >
        {{ closeButtonText }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { VSnackbar } from 'vuetify/lib'

export default {
  components: {
    VSnackbar
  },
  props: {
    message: {
      type: String,
      required: true
    },
    timeout: {
      type: Number,
      default: 3000
    },
    closeButtonText: {
      type: String,
      default: 'Закрыть'
    }
  },
  methods: {
    close() {
      this.$destroy()
    }
  }
}
</script>
