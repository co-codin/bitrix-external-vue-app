<template>
  <div ref="layout" class="pa-2">
    <page-loader v-if="!loaded" />
    <v-alert v-else-if="error" type="error" text>
      Произошла ошибка при загрузке Битрикс 24
    </v-alert>
    <slot v-else></slot>
  </div>
</template>

<script>
import PageLoader from '@/components/PageLoader'

export default {

  components: {
    PageLoader
  },
  data: () => ({
    loaded: false,
    error: null
  }),
  updated() {
    !this.isDev && BX24.fitWindow()
    !this.isDev && BX24.scrollParentWindow(0)
  },

  async mounted() {
    if (this.isDev) {
      try {
        await this.$store.dispatch('user/authInR2D2')
      } catch (e) {
        this.error = e
      } finally {
        this.loaded = true
      }

      return
    }

    const script = await document.createElement('script')

    await script.setAttribute('src', 'https://api.bitrix24.com/api/v1/')
    await document.head.appendChild(script)

    script.addEventListener('load', () => {
      try {
        BX24.init(async () => {
          await this.$store.dispatch('user/loadCurrentUserData')
          await this.$store.dispatch('user/loadCurrentUserAdminStatus')
          // await this.$store.dispatch('user/authInR2D2')

          this.loaded = true
        })
      } catch (e) {
        this.error = e
        this.loaded = true
      }
    })
  },
  computed: {
    isDev() {
      return process.env.NODE_ENV !== 'production'
    }
  }
}
</script>
