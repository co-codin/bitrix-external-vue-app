<template>
  <div class="pa-2">
    <page-loader
      v-if="!loaded"
    />
    <v-alert v-else-if="error" type="error" text>
      Произошла ошибка при загрузке Битрикс 24
    </v-alert>
    <slot v-else></slot>
  </div>
</template>

<script>
import PageLoader from '../components/PageLoader'
import axios from 'axios'

export default {
  components: {
    PageLoader
  },
  data: () => ({
    loaded: false,
    error: null
  }),
  updated() {
    BX24.fitWindow()
  },
  async mounted() {
    const script = await document.createElement('script')

    await script.setAttribute('src', 'https://api.bitrix24.com/api/v1/')
    await document.head.appendChild(script)

    script.addEventListener('load', () => {
      try {
        BX24.init(async () => {

          await axios.all([
            this.$store.dispatch('user/loadCurrentUserData'),
            this.$store.dispatch('user/loadCurrentUserAdminStatus'),
            this.$store.dispatch('user/authInR2D2')
          ])

          this.loaded = true
        })
      }
      catch (e) {
        this.error = e
        this.loaded = true
      }
    })
  }
}
</script>
