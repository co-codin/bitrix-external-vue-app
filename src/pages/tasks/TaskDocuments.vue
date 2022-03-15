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
            <v-file-input id="file" clearable @change="handleFileUpload" />
          </div>

          <div class="mb-7">
            <v-form
              @submit.prevent="uploadFiles"
            >
              <v-expansion-panels v-if="form.files.length" class="mb-2">
                <v-expansion-panel v-for="(file, index) in form.files" :key="index">
                  <v-expansion-panel-header class="title">
                    {{ file.name }}
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
                            :error="formErrors.hasOwnProperty(`files.${index}.name`)"
                            :error-messages="formErrors[`files.${index}.name`]"
                          />
                          <v-select
                            v-model="file.type"
                            label="Выберите тип документа"
                            :items="documentTypeLabels"
                            dense
                            :error="formErrors.hasOwnProperty(`files.${index}.type`)"
                            :error-messages="formErrors[`files.${index}.type`]"
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
import TrashIcon from '@/components/heroicons/TrashIcon'
import EyeIcon from '@/components/heroicons/EyeIcon'
import DownloadIcon from '@/components/heroicons/DownloadIcon'
import FilePreviewIcon from '../../components/FilePreviewIcon'
import * as Validator from 'validatorjs'
import BX24Wrapper from '@/utils/bx24-wrapper'

export default {
  components: {
    TrashIcon,
    EyeIcon,
    DownloadIcon,
    FilePreviewIcon
  },
  data: () => ({
    files: [],
    taskId: null,
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
    rules: {
      'files.*.name': 'required',
      'files.*.type': 'required'
    },
    formErrors: {}
  }),
  mounted() {
    this.getTaskFiles()
  },
  methods: {
    async getTaskFiles() {
      const { options } = BX24.placement.info()

      this.taskId = options?.ID ?? options?.taskId

      const bx24 = new BX24Wrapper()

      await bx24.callMethod(
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
        file: document.getElementById('file'),
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: null,
        comment: '',
        extension: file.name.split('.').pop()
      })
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
    async uploadFiles() {
      this.loadingFiles = true

      const validation = new Validator(this.form, this.rules)

      if (validation.fails()) {
        this.formErrors = validation.errors.errors

        return
      }
      this.form.files.forEach((file, index) => {
        try {
          BX24.callMethod('disk.storage.uploadfile', {
            id: process.env.VUE_APP_STORAGE_ID,
            fileContent: file.file,
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

          })
        } catch (e) {
          this.loadingFiles = true
          console.log(e)
          // this.$snackbar(res.error()?.ex?.error_description)
        }

      })
      this.loadingFiles = false
    }
  }
}
</script>

<style scoped>
.error-block {
  border: 1px solid red !important
}
</style>
