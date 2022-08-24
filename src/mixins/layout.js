import PageLoader from '../components/PageLoader'

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
  },

  async mounted() {
    if (this.isDev) {
      try {
        await this.$store.dispatch('user/authInR2D2')
      }
      catch (e) {
        this.error = e
      }
      finally {
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

          await Promise.all([
            this.$store.dispatch('user/loadCurrentUserData'),
            this.$store.dispatch('user/loadCurrentUserAdminStatus'),
            this.$store.dispatch('user/authInR2D2')
          ])

          this.loaded = true
        })
      }
      catch (e) {
        this.error = e
      }
      finally {
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
