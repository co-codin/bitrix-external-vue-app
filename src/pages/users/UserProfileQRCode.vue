<template>
  <div>
    <page-loader v-if="loading" />
    <v-alert v-else-if="error" type="error" text>
      Произошла ошибка при загрузке Битрикс 24
    </v-alert>
    <template v-else>
      <v-row>
        <v-col md="6">
          <v-card>
            <v-card-text>
              <v-form @submit.prevent="generateQRCode">
                <v-text-field
                  v-model="form.last_name"
                  label="Фамилия"
                  dense
                />
                <v-text-field
                  v-model="form.first_name"
                  label="Имя"
                  dense
                />
                <v-text-field
                  v-model="form.middle_name"
                  label="Отчество"
                  dense
                />
                <v-text-field
                  v-model="form.position"
                  label="Должность"
                  dense
                />
                <v-text-field
                  v-model="form.phone"
                  label="Телефон"
                  dense
                />
                <v-text-field
                  v-model="form.email"
                  label="E-mail"
                  dense
                />
                <v-text-field
                  v-model="form.company"
                  label="Компания"
                  dense
                />
                <v-text-field
                  v-model="form.website"
                  label="Сайт"
                  dense
                />
              </v-form>
            </v-card-text>
          </v-card>
          <div class="text-right mt-2">
            <v-btn type="submit" color="primary">
              Сгенерировать QR код
            </v-btn>
          </div>
        </v-col>
        <v-col md="6">
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
        </v-col>
      </v-row>
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
    loading: true,
    form: {
      last_name: 'Петров',
      first_name: 'Иван',
      middle_name: null,
      position: null,
      company: 'MEDEQ',
      phone: null,
      email: null,
      website: 'https://medeq.ru'
    }
  }),
  computed: {
    // example of generated qr code
    qrCode() {
      return '/images/qr.png'
    }
  },

  mounted() {
    // get data from bx api
    // const options = BX24.placement?.info()

    // load current user data from bitrix
    this.loadUser()

    // fill form with current user data
    // this.fillForm()
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
    },
    downloadImage() {
      fetch(this.qrCode)
        .then((resp) => resp.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')

          a.style.display = 'none'
          a.href = url
          a.download = `${this.form.last_name} ${this.form.first_name} - qr код.png`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
        })
        .catch(() => alert('oh no!'))
    },
    generateQRCode() {
      // validate form
      // show errors
      // or generate qr code in right side
    }
  }
}
</script>
