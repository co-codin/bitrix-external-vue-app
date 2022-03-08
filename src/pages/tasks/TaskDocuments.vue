<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="1000px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          small
          v-bind="attrs"
          class="mb-2"
          v-on="on"
        >
          Добавить документы
        </v-btn>
      </template>

      <v-card>
        <v-card-title>
          <span class="headline">
            Массовая загрузка файлов к задаче
          </span>
        </v-card-title>
        <v-card-text>
          <div class="mb-2">
            <v-card class="dropzone text-center pa-1">
              <vue-dropzone
                id="dropzone"
                ref="dropzone"
                class="px-3 py-8"
                :use-custom-slot="true"
                :options="dropzoneOptions"
                @vdropzone-file-added="handleFileUpload"
              >
                <div class="dropzone-custom-content">
                  <upload-icon width="50" height="50" />
                  <div class="mt-2">
                    Нажмите, чтобы выбрать файлы или просто перетащите их сюда
                  </div>
                </div>
              </vue-dropzone>
            </v-card>
          </div>

          <div class="mb-7">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              @submit.prevent="uploadFiles"
            >
              <v-expansion-panels v-if="form.files.length" class="mb-2">
                <v-expansion-panel v-for="(file, index) in form.files" :key="index">
                  <v-expansion-panel-header class="title">
                    {{ file.file.name }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content eager>
                    <v-row>
                      <v-col cols="12" sm="5" md="4" lg="2">
                        <file-preview-icon :extension="file.extension">
                          {{ file.name }}.{{ file.extension }}
                        </file-preview-icon>
                      </v-col>
                      <v-col cols="12" sm="7" md="8" lg="10">
                        <div>
                          <v-text-field
                            v-model="file.name"
                            label="Название"
                            dense
                            :rules="nameRules"
                            required
                          />
                          <v-select
                            v-model="file.type"
                            label="Выберите тип документа"
                            :items="documentTypeLabels"
                            dense
                            :rules="typeRules"
                            required
                          />
                          <v-text-field
                            v-model="file.comment"
                            label="Заметка"
                            dense
                          />
                        </div>
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"/>
                    <div class="text-center">
                      <v-btn small color="red" dark @click="removeFile(index)">Удалить</v-btn>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <div class="text-right mt-2">
                  <v-btn type="submit" color="primary" :loading="loadingFiles" :disabled="loadingFiles">
                    Загрузить выбранные файлы ({{ form.files.length }})
                  </v-btn>
                </div>

              </v-expansion-panels>
            </v-form>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="close">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-data-table
        v-if="files.length"
        item-key="id"
        :headers="headers"
        :items="files"
        :loading="isLoading"
        loading-text="Идет загрузка..."
        hide-default-footer
      >
        <template #item.id="{ item }">
          <div class="font-weight-bold text-no-wrap"># {{ item.id }}</div>
        </template>

        <template #item.name="{ item }">
          <div class="font-weight-bold text-no-wrap">
            <a href="#">{{ item.name }}</a>
          </div>
        </template>

        <template #item.action="{item}">
          <div class="table-actions">
            <v-btn icon @click.prevent="previewFile(item)">
              <eye-icon />
            </v-btn>
            <v-btn icon @click.prevent="downloadFile(item)">
              <download-icon />
            </v-btn>
            <v-btn icon @click.prevent="deleteFile(item)">
              <trash-icon />
            </v-btn>
          </div>
        </template>
      </v-data-table>

      <v-alert
        v-else
        text
        color="info"
      >
        <h3 class="headline">Пока ничего не загружено</h3>
        <div>
          Загрузите документы к задаче, нажав на кнопку "Добавить документы".
        </div>
      </v-alert>

    </v-card>
  </div>
</template>

<script>
import UploadIcon from '@/components/heroicons/UploadIcon'
import TrashIcon from '@/components/heroicons/TrashIcon'
import EyeIcon from '@/components/heroicons/EyeIcon'
import DownloadIcon from '@/components/heroicons/DownloadIcon'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import FilePreviewIcon from '../../components/FilePreviewIcon'

export default {
  components: {
    UploadIcon,
    TrashIcon,
    EyeIcon,
    DownloadIcon,
    vueDropzone: vue2Dropzone,
    FilePreviewIcon
  },
  data: () => ({
    valid: true,
    files: [],
    taskId: null,
    dropzoneOptions: {
      url: 'http://localhost',
      thumbnailWidth: 150,
      maxFilesize: 0.5
    },
    headers: [
      { text: 'ID', align: 'left', value: 'ATTACHMENT_ID', sortable: false },
      { text: 'Название', align: 'left', value: 'NAME', sortable: false },
      { text: '', sortable: false, align: 'right', value: 'action' }
    ],
    isLoading: false,
    dialog: false,
    form: {
      files: []
    },
    documentTypeLabels: [
      { text: 'Счет', value: 1 },
      { text: 'Договор', value: 2 },
      { text: 'УПД', value: 3 }
    ],
    loadingFiles: false,
    nameRules: [
      (v) => !!v || 'Название обязательно'
    ],
    typeRules: [
      (v) => !!v || 'Тип обязательно'
    ]
  }),
  mounted() {
    this.getTaskFiles()
  },
  methods: {
    getTaskFiles() {
      const { options } = BX24.placement.info()

      this.taskId = options?.ID ?? options?.taskId

      BX24.callMethod(
        'task.item.getdata',
        [this.taskId],
        (result) => {
          this.files = result.data().UF_TASK_WEBDAV_FILES
        }
      )
    },
    removeFile(index) {
      this.form.files.splice(index, 1)
    },
    handleFileUpload(file) {
      this.form.files.push({
        file: file,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: null,
        comment: '',
        extension: file.name.split('.').pop()
      })
      this.$refs.dropzone.removeFile(file)
    },
    downloadFile(item) {
      BX24.callMethod('disk.file.get', {
        id: item.FILE_ID
      }, (res) => {
        if (res.data()) {
          const link = document.createElement('a')

          link.href = res.data().DOWNLOAD_URL
          link.download = res.data().NAME
          link.click()
        }
        if (res.error()) {
          console.log(res.error())
        }
      })
    },
    previewFile(item) {
      BX24.callMethod('disk.file.get', {
        id: item.FILE_ID
      }, (res) => {
        if (res.data()) {
          window.open(res.data().DETAIL_URL, '_blank')
        }
      })
    },
    async deleteFile(item) {
      if (!await this.$confirm('Вы действительно хотите удалить файл?')) {
        return
      }

      BX24.callMethod('disk.file.delete', {
        id: item.FILE_ID
      }, () => {
        BX24.callMethod('task.item.deletefile', {
          TASK_ID: this.taskId,
          ATTACHMENT_ID: item.ATTACHMENT_ID
        }, () => {
          this.$snackbar('Файл успешно удален')
          this.getTaskFiles()
        })
      })
    },
    close() {
      this.dialog = false
      this.form.files = []
    },
    uploadFiles() {

      if (!this.$refs.form.validate()) {
        return
      } else {

        this.form.files.forEach((file, index) => {
          let fileContent

          setTimeout(() => {
            file.file.text().then((content) => {
              fileContent = content
              this.loadingFiles = true
              BX24.callMethod('disk.storage.uploadfile', {
                id: process.env.VUE_APP_STORAGE_ID,
                fileContent: fileContent,
                data: {
                  NAME: file.name + '.' + file.extension,
                  TYPE: file.type,
                  COMMENT: file.comment
                }
              },
              (res) => {
                if (res.data()) {
                  BX24.callMethod('tasks.task.files.attach', {
                    taskId: this.taskId,
                    fileId: res.data().ID
                  }, (res) => {
                    if (res.data()) {
                      this.getTaskFiles()
                      this.dialog = false
                      this.form.files.splice(index, 1)
                    }
                    if (res.error()) {
                      this.$snackbar(res.error()?.ex?.error_description)
                      this.dialog = true
                    }
                  })
                }
                if (res.error()) {
                  this.$snackbar(res.error()?.ex?.error_description)
                }
              })
            })
            this.loadingFiles = false
          }, 1000)
        })

      }

    }
  }
}
</script>

<style scoped>
  .error-block {
    border: 1px solid red !important
  }
  .dropzone > div {
    /*cursor: pointer;*/
    /*border-bottom: 1px solid transparent;*/
    /*transition: 0.5s;*/
    /*background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23B2B1B1FF' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");*/
  }
</style>
