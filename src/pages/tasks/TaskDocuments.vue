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
            <v-file-input
              id="file"
              v-model="uploadedFile"
              @change="handleFileUpload"
            />
          </div>

          <div class="mb-7">
            <v-form
              @submit.prevent="uploadFiles"
            >
              <v-expansion-panels v-if="form.files.length" class="mb-2">
                <v-expansion-panel v-for="(file, index) in form.files" :key="index" :class="{'error-block': formErrors.hasOwnProperty(`files.${index}.name`) || formErrors.hasOwnProperty(`files.${index}.type`)}">
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
                            dens
                            :error="formErrors.hasOwnProperty(`files.${index}.comment`)"
                            :error-messages="formErrors[`files.${index}.comment`]"
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
    uploadedFile: null,
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
      'files.*.name': 'required|distinct',
      'files.*.type': 'required'
    },
    formErrors: {}
  }),
  async mounted() {
    await this.getTaskFiles()
  },
  methods: {
    async getTaskFiles() {
      const { options } = BX24.placement.info()

      this.taskId = options?.ID ?? options?.taskId

      try {
        const task = await (new BX24Wrapper()).callMethod(
          'task.item.getdata',
          [this.taskId]
        )

        this.files = task.UF_TASK_WEBDAV_FILES
      } catch (e) {
        console.log(e)
      }
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
      this.uploadedFile = []
    },
    async downloadFile(item) {
      try {
        const file = await (new BX24Wrapper()).callMethod('disk.file.get', {
          id: item.FILE_ID
        })

        const link = document.createElement('a')

        link.href = file.DOWNLOAD_URL
        link.download = file.NAME
        link.click()
        link.remove()
      } catch (e) {
        console.log(e)
      }

    },
    async previewFile(item) {
      try {
        const file = await (new BX24Wrapper()).callMethod('disk.file.get', {
          id: item.FILE_ID
        })

        window.open(file.DETAIL_URL, '_blank')
      } catch (e) {
        console.log(e)
      }
    },
    async deleteFile(item) {
      if (!await this.$confirm('Вы действительно хотите удалить файл?')) {
        return
      }

      try {
        await (new BX24Wrapper()).callMethod('disk.file.delete', {
          id: item.FILE_ID
        })

        try {
          await (new BX24Wrapper()).callMethod('task.item.deletefile', {
            TASK_ID: this.taskId,
            ATTACHMENT_ID: item.ATTACHMENT_ID
          })

          this.$snackbar('Файл успешно удален')
          await this.getTaskFiles()
        } catch (e) {
          console.log(e)
        }
      } catch (e) {
        console.log(e)
      }
    },
    close() {
      this.dialog = false
      this.form.files = []
    },
    async uploadFiles() {
      Validator.register('distinct', (value, requirement, attribute) => {
        return !this.form.files.filter((file) => {
          return file.name === value
        }).length > 1
      })
      const validation = await new Validator(this.form, this.rules, {
        'required': ':attribute обязательно для заполнения.'
      })

      for (let i = 0; i < this.form.files.length; i++) {
        validation.setAttributeNames({
          [`files.${i}.name`]: 'Название',
          [`files.${i}.type`]: 'Тип'
        })
      }

      if (validation.fails()) {
        this.formErrors = validation.errors.errors

        return
      }

      this.loadingFiles = true

      const batch = this.form.files.map((file) => {
        return [
          'disk.storage.uploadfile',
          {
            id: process.env.VUE_APP_STORAGE_ID,
            fileContent: file.file,
            data: {
              NAME: file.name + '.' + file.extension,
              TYPE: file.type,
              COMMENT: file.comment
            }
          }
        ]
      })

      try {
        let batchResponse = await (new BX24Wrapper()).callBatch(batch, false)

        batchResponse = batchResponse.map((batch) => {
          return [
            'tasks.task.files.attach',
            {
              taskId: this.taskId,
              fileId: batch.ID
            }
          ]
        })
        try {
          await (new BX24Wrapper()).callBatch(batchResponse, false)
        } catch (e) {
          console.log(e)
        }
      } catch (e) {
        this.loadingFiles = false
        this.$snackbar(e.message)
      }

      this.loadingFiles = false
      this.dialog = false
    }
  }
}
</script>

<style scoped>
.error-block {
  border: 1px solid red !important
}
</style>
