export default {
  data: () => ({
    loading: true
  }),
  methods: {
    showLoading() {
      this.loading = true
    },
    hideLoading() {
      this.loading = false
    }
  }
}
