export default {
  updated() {
    this.updateTitle()
  },
  created() {
    this.updateTitle()
  },
  methods: {
    updateTitle() {
      const title = this.getTitle()

      if (!title) {
        return
      }

      document.title = title

      if (document.getElementById('pagetitle')) {
        document.getElementById('pagetitle').innerText = title
      }
    },
    getTitle() {
      const { title } = this.$options

      if (!title) {
        return null
      }

      return typeof title === 'function'
        ? title.call(this)
        : title
    }
  }
}
