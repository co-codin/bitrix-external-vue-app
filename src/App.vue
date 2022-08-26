<template>
  <v-app>
    <component :is="currentLayout" v-if="isRouterLoaded">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </component>
    <v-snackbar v-model="toast.show" :timeout="toast.timeout" :color="toast.color" bottom>
      {{ toast.message }}
      <v-btn v-if="toast.timeout === 0" color="white" text @click="toast.show = false">{{ $t('common.close') }}</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import config from './configs'
import defaultLayout from '@/layouts/DefaultLayout'
import academyLayout from './layouts/AcademyLayout'
import externalAppLayout from './layouts/ExternalAppLayout'
import errorLayout from './layouts/ErrorLayout'

export default {
  components: {
    errorLayout,
    academyLayout,
    defaultLayout,
    externalAppLayout
  },
  computed: {
    ...mapState('app', ['toast']),
    isRouterLoaded: function() {
      return this.$route.name !== null
    },
    currentLayout: function() {
      const layout = this.$route.meta.layout || 'default'

      return layout + 'Layout'
    }
  },
  head: {
    link: [
      ...config.icons.map((href) => ({ rel: 'stylesheet', href }))
    ]
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
