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
                ref="form"
                v-model="valid"
                lazy-validation
                @submit.prevent="generateQRCode"
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
                <div class="text-right mt-2">
                  <v-btn type="submit" color="primary">
                    Сгенерировать QR код
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" class="pl-sm-2">
          <v-divider class="d-sm-none d-block mt-3 mb-3" />
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
    valid: false,
    form: {
      last_name: 'Петров',
      first_name: 'Иван',
      middle_name: null,
      position: null,
      company: 'MEDEQ',
      phone: null,
      email: null,
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
    ]
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
      BX24.callMethod('user.current', {}, (res) => {
        this.form.last_name = res.data().LAST_NAME
        this.form.first_name = res.data().NAME
        this.form.middle_name = res.data().SECOND_NAME
        this.form.position = res.data().WORK_POSITION
        this.form.phone = res.data().PERSONAL_MOBILE ?? '8 (800) 555-73-87'
        this.form.email = res.data().EMAIL
      })

      console.log(this.form)

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
      this.$refs.form.validate()

      if (this.valid) {
        console.log(this.form)
      }
      // validate form
      // show errors
      // or generate qr code in right side
    }
  }
}
</script>
