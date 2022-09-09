<script>
export default {
  props:{
    fileName: {
      type: String,
      default: 'File'
    },
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {

    }
  },
  methods:{
    createDownloadLink({ data, headers }) {
      const a = document.createElement('a')
      const file = new Blob([data], { type: headers['content-type'] })

      a.href = window.URL.createObjectURL(file)
      a.download = this.fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    downloadFile() {
      this.$r2d2.get(this.url, { responseType: 'arraybuffer' }).then((resp) => {
        this.createDownloadLink(resp)
      }).finally(() => {
      })
    }
  },
  render() {
    return this.$scopedSlots.default({
      download: this.downloadFile
    })
  }
}
</script>
