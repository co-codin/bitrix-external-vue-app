<template>
  <div>
    <v-dialog v-model="dialog" scrollable width="1000px">
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
                  <label class="mt-2">
                    Нажмите, чтобы выбрать файлы или просто перетащите их сюда
                  </label>
                </div>
              </vue-dropzone>
            </v-card>
          </div>

          <div class="mb-7">
            <v-expansion-panels v-if="form.files.length" class="mb-2">
              <v-form style="width: 100%;" @submit.prevent="uploadFiles">
                <v-expansion-panel v-for="(file, index) in form.files" :key="index" style="border: 1px solid red !important">
                  <v-expansion-panel-header class="title">
                    {{ file.file.name }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="12" sm="5" md="4" lg="2">
                        <file-preview-icon :extension="form.files[index].extension">
                          {{ form.files[index].name }}.{{ form.files[index].extension }}
                        </file-preview-icon>
                      </v-col>
                      <v-col cols="12" sm="7" md="8" lg="10">
                        <div>
                          <v-text-field
                            v-model="form.files[index].name"
                            label="Название"
                            dense
                            :rules="nameRules"
                          />
                          <v-select
                            v-model="form.files[index].type"
                            label="Тип"
                            :items="documentTypeLabels"
                            dense
                            :rules="typeRules"
                          />
                          <v-text-field
                            v-model="form.files[index].comment"
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
              </v-form>

            </v-expansion-panels>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog = false">Отмена</v-btn>
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
            <v-btn icon @click.prevent="fileAction(item, 'preview')">
              <eye-icon />
            </v-btn>
            <v-btn icon @click.prevent="fileAction(item)">
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
    files: [],
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
    total: 3,
    dialog: false,
    isDragging: false,
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
    window.addEventListener('load',  () => {
      this.getTaskFiles()
    })
  },
  methods: {
    getTaskFiles() {
      const { taskId } = window.BX24.placement?.info()?.options

      window.BX24.callMethod(
        'task.item.getdata',
        [taskId],
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
        type: 1,
        comment: '',
        extension: file.name.split('.').pop()
      })
      this.$refs.dropzone.removeFile(file)
    },
    fileAction(item, action = 'download') {
      window.BX24.callMethod('disk.file.get', {
        id: item.FILE_ID
      }, (res) => {
        if (res.data()) {
          console.log(res.data())
          if (action === 'download') {
            window.open(res.data().DOWNLOAD_URL, '_blank')
          } else {
            window.open(res.data().DETAIL_URL, '_blank')
          }
        }
      })
    },
    deleteFile(item) {
      window.BX24.callMethod('disk.file.delete', {
        id: item.FILE_ID
      }, () => {
        window.BX24.callMethod('task.item.deletefile', {
          TASK_ID: window.BX24.placement.info()?.options?.taskId,
          ATTACHMENT_ID: item.ATTACHMENT_ID
        }, () => {
          this.getTaskFiles()
        })
      })
    },
    uploadFiles() {
      this.loadingFiles = true

      this.form.files.forEach((file) => {
        let fileContent

        setTimeout(() => {
          file.file.text().then((content) => {
            fileContent = content
            window.BX24.callMethod('disk.storage.uploadfile', {
              id: process.env.VUE_APP_STORAGE_ID,
              fileContent: fileContent,
              data: {
                NAME: file.name,
                TYPE: file.type,
                COMMENT: file.comment
              }
            },
            (res) => {
              if (res.data()) {
                window.BX24.callMethod('tasks.task.files.attach', {
                  taskId: window.BX24.placement.info()?.options?.taskId,
                  fileId: res.data().ID
                }, () => {
                  this.getTaskFiles()
                })
              }
            })
          })}, 1000)
      })
      this.loadingFiles = false
      this.dialog = false
    }
  }
}
</script>

<style scoped>
  .dropzone > div {
    cursor: pointer;
    border-bottom: 1px solid transparent;
    transition: 0.5s;
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23B2B1B1FF' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  }
  .dropzone:hover > div {
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%233B3B3BFF' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  }
</style>
