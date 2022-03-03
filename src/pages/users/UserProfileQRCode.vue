<template>
  <div>
    <page-loader v-if="loading" />
    <v-alert v-else-if="error" type="error" text>
      Произошла ошибка при загрузке Битрикс 24
    </v-alert>
    <template v-else>
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-card>
            <v-card-text class="pt-3">
              <v-form
                v-if="form"
                ref="form"
                v-model="valid"
              >
                <v-text-field
                  v-model="form.last_name"
                  label="Фамилия"
                  dense
                  :rules="lastnameRules"
                  required
                />
                <v-text-field
                  v-model="form.first_name"
                  label="Имя"
                  dense
                  :rules="firstnameRules"
                  required
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
                  :rules="phoneRules"
                  required
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
        </v-col>
        <v-col cols="12" sm="6" class="pl-sm-2">
          <v-divider class="d-sm-none d-block mt-3 mb-3" />
          <v-card
            v-if="valid"
            max-width="300"
          >
            <vue-qr
              :text="qrCode"
              class="white--text align-end"
              height="200px"
              :callback="handleQr"
              :size="600"
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
import VueQr from 'vue-qr'
import { debounce } from 'lodash'

export default {
  components: {
    PageLoader,
    CopyIcon,
    DownloadIcon,
    VueQr
  },
  data: () => ({
    user: null,
    error: null,
    loading: true,
    valid: false,
    form: {
      last_name: '',
      first_name: '',
      middle_name: '',
      position: '',
      company: 'MEDEQ',
      phone: '',
      email: '',
      website: 'https://medeq.ru'
    },
    lastnameRules: [
      (v) => !!v || 'Фамилия обязательно'
    ],
    firstnameRules: [
      (v) => !!v || 'Имя обязательно'
    ],
    phoneRules: [
      (v) => !!v || 'Телефон обязательно',
      (v) => /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/.test(v) || 'Телефон неправильно'
    ],
    dataUrl: null
  }),
  computed: {
    qrCode() {
      return 'BEGIN:VCARD\n' +
        `N:${this.form.last_name};${this.form.first_name};\n` +
        `TEL;TYPE=work,VOICE:${this.form.phone}\n` +
        `EMAIL:${this.form.phone}\n` +
        `ORG:${this.form.company}\n` +
        `TITLE:${this.form.position}\n` +
        `URL:${this.form.website}\n` +
        'VERSION:3.0\n' +
        'END:VCARD'
    }

  },

  async mounted() {
    this.loadUser()
    // this.loading = false
    this.$nextTick(() => {
      this.$refs.form?.validate()
    })
  },
  methods: {
    loadUser() {
      const { options } = BX24.placement.info()

      const userId = options?.USER_ID

      BX24.callMethod('user.get', {
        ID: userId
      }, (res) => {
        this.form.last_name = res.data().LAST_NAME
        this.form.first_name = res.data().NAME
        this.form.middle_name = res.data().SECOND_NAME
        this.form.position = res.data().WORK_POSITION
        this.form.phone = res.data().PERSONAL_MOBILE ?? '8 (800) 555-73-87'
        this.form.email = res.data().EMAIL
        this.$refs.form.validate()
      })
      console.log(this.form)

      this.loading = false
    },
    handleQr(dataUrl, id) {
      this.dataUrl = dataUrl
    },
    async copyImageToClipboard() {
      const response = await fetch(this.dataUrl)
      const blob = await response.blob()
      const data = [new ClipboardItem({ [blob.type]: blob })]

      await navigator.clipboard.write(data)
    },
    async downloadImage() {
      const link = await document.createElement('a')

      link.href = this.dataUrl

      link.download = `${this.form.last_name} ${this.form.first_name} - qr код.png`

      await document.body.appendChild(link)

      link.click()
    }
  }
}
</script>
