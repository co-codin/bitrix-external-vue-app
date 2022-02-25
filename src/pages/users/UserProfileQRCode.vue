<template>
  <div>
    <page-loader v-if="loading" />
    <v-alert v-else-if="error" type="error" text>
      Произошла ошибка при загрузке Битрикс 24
    </v-alert>
    <template v-else>
      <v-card
        max-width="300"
      >
        <v-img
          class="white--text align-end"
          height="200px"
          contain
          :src="qrCode"
        />
        <v-divider/>
        <v-card-actions class="justify-center py-2">
          <v-btn
            icon
            class="pa-3"
            color="primary"
            title="Скопировать QR код в буфер обмена"
            @click="copyImageToClipboard"
          >
            <copy-icon width="38" height="38" />
          </v-btn>
          <v-btn
            class="pa-3"
            icon
            color="primary"
            title="Скачать QR код"
            @click="downloadImage"
          >
            <download-icon width="38" height="38" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </div>
</template>

<script>
import PageLoader from '@/components/PageLoader'
import CopyIcon from '@/components/heroicons/CopyIcon'
import DownloadIcon from '@/components/heroicons/DownloadIcon'

export default {
  components: {
    PageLoader,
    CopyIcon,
    DownloadIcon
  },
  data: () => ({
    user: null,
    error: null,
    loading: true
  }),
  computed: {
    qrCode() {
      return '/images/qr.png'
    }
  },

  mounted() {
    // const options = BX24.placement?.info()

    this.loadUser()
  },
  methods: {
    loadUser() {
      this.user = {
        first_name: 'Петр'
      }
      this.loading = false
    },
    async copyImageToClipboard() {
      const response = await fetch(this.qrCode)
      const blob = await response.blob()
      const data = [new ClipboardItem({ [blob.type]: blob })]

      await navigator.clipboard.write(data)
    }
  }
}
</script>
