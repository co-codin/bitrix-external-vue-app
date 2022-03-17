<template>
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
          <div
            class="image-uploader"
            :class="{ dragging: isDragging }"
            @dragenter="onDragEnter"
            @dragleave="onDragLeave"
            @dragover.prevent
            @drop="onDrop"
          >
            <div class="image-uploader-empty-bg"></div>
            <div class="image-uploader-empty-text">
              <p>
                <label for="file">Нажмите на ссылку</label>, чтобы выбрать файлы или просто перетащите их
                сюда
              </p>
              <input id="file" type="file" @change="handleFileUpload" />
            </div>
          </div>

          <!--          <v-file-input-->
          <!--            id="file"-->
          <!--            v-model="uploadedFile"-->
          <!--            @change="handleFileUpload"-->
          <!--          />-->
        </div>

        <div class="mb-7">
          <v-form
            @submit.prevent="handleSubmit"
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
</template>

<script>
import FilePreviewIcon from '@/components/FilePreviewIcon'
import * as Validator from 'validatorjs'
import BX24Wrapper from '@/utils/bx24-wrapper'

export default {
  components: {
    FilePreviewIcon
  },
  props: {
    taskId: {
      required: true,
      type: Number
    }
  },
  data: () => ({
    dialog: false,
    loadingFiles: false,
    isDragging: false,
    dragCount: 0,
    form: {
      files: []
    },
    formErrors: {},
    documentTypeLabels: [
      { text: 'Счет', value: 1 },
      { text: 'Договор', value: 2 },
      { text: 'УПД', value: 3 }
    ]
  }),
  methods: {
    async handleFileUpload(e) {
      const { files } = e.target

      this.form.files.push({
        file: document.getElementById('file'),
        name: files[0].name.replace(/\.[^/.]+$/, ''),
        type: null,
        comment: '',
        extension: files[0].name.split('.').pop()
      })
      e.target.value = null
    },
    removeFile(index) {
      this.form.files.splice(index, 1)
    },
    async handleSubmit() {
      this.loadingFiles = true
      await this.uploadFiles()
      this.loadingFiles = false
    },
    close() {
      this.dialog = false
      this.form.files = []
    },
    async uploadFiles() {
      Validator.register('distinct', (value, requirement, attribute) => {
        return this.form.files.filter((file) => {
          return file.name === value
        }).length <= 1
      })
      const validation = await new Validator(this.form, this.rules, {
        'required': ':attribute обязательно для заполнения.',
        'distinct': 'Название должно быть уникальным.'
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

      const batch = this.form.files.map((file) => {
        console.log(file)

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
          this.$emit('uploaded')
        } catch (e) {
          this.$snackbar('Произошла ошибка')
        }
      } catch (e) {
        this.$snackbar('Произошла ошибка')
      }

      this.dialog = false
    },
    onDragEnter(e) {
      e.preventDefault()
      this.dragCount++
      this.isDragging = true
    },
    onDragLeave(e) {
      e.preventDefault()
      this.dragCount--
      if (this.dragCount <= 0) {
        this.isDragging = false
      }
    },
    async onDrop(e) {
      e.preventDefault()
      e.stopPropagation()
      this.isDragging = false
      const { files } = e.dataTransfer

      for (let i = 0; i < files.length; i++) {
        this.form.files.push({
          file: document.getElementById('file'),
          name: files[i].name.replace(/\.[^/.]+$/, ''),
          type: null,
          comment: '',
          extension: files[i].name.split('.').pop()
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
p
  margin-bottom: 0
.drag-wrap
  display: flex
  flex-wrap: wrap
.image-uploader-wrap
  min-height: 160px
  margin-left: -10px
  margin-right: -10px
  margin-bottom: 10px
  >.col
    padding-left: 10px
    padding-right: 10px
    >div
      margin-bottom: 10px
  >div
    padding-left: 10px
    padding-right: 10px
.col-uploader.fullsize
  flex: 1 0 100%
  max-width: 100%
.image-uploader
  border: 1px dashed #c7ccd6
  padding: 0 20px
  height: 100%
  min-height: 160px
  width: 100%
  position: relative
  display: flex
  flex-direction: column
  text-align: center
  align-items: center
  justify-content: center
  &.dragging
    border: 3px dashed #3b5998
.image-uploader-empty-bg
  width: 50px
  height: 44px
  margin-bottom: 13px
  background-size: cover
  background-position: center
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI0MyIgdmlld0JveD0iMCAwIDUwIDQzIj4gIDxkZWZzPiAgICA8c3R5bGU+ICAgICAgLmNscy0xIHsgICAgICAgIGZpbGw6ICNjN2NjZDY7ICAgICAgICBmaWxsLXJ1bGU6IGV2ZW5vZGQ7ICAgICAgfSAgICA8L3N0eWxlPiAgPC9kZWZzPiAgPHBhdGggaWQ9IkZvcm1hXzFf0LrQvtC/0LjRj18yIiBkYXRhLW5hbWU9IkZvcm1hIDEg0LrQvtC/0LjRjyAyIiBjbGFzcz0iY2xzLTEiIGQ9Ik01ODguOTcyLDY0OC43ODljLTEuMy0xLjM2OC0yLjMtMS40NjgtNC4xMzctMS40NjhoLTYuMDg4bC0xLjYzLTQuMzA2QTQuOTU0LDQuOTU0LDAsMCwwLDU3NS4wOTQsNjQxYy0wLjgxMy4wNjQtMi43MzQsMC0zLjY1MywwSDU1Ni44MjlhNC45NDksNC45NDksMCwwLDAtMi4wMjEsMi4wMTlsLTEuNjMyLDQuMzA2aC02LjA4OGMtMS44MzgsMC0yLjgzNy4xLTQuMTM3LDEuNDY4YTYuOTM1LDYuOTM1LDAsMCwwLTEuOTUsNC45NTR2MjMuOTM5YzAsMS45MzQtLjA4MiwzLjY5MSwxLjIxNyw1LjA2czQuMjUxLDEuMjY1LDYuMDg5LDEuMjY1aDM1LjMxMmMxLjgzNywwLDQuNzg4LjEsNi4wODgtMS4yNjVzMS4yMTgtMy4xMjYsMS4yMTgtNS4wNmwwLTIzLjkzOUE2LjkzNSw2LjkzNSwwLDAsMCw1ODguOTcyLDY0OC43ODlabS0xNC43ODEsMjUuODc5YTExLjIwNywxMS4yMDcsMCwwLDEtMTYuNDU4LDAsMTIuNjgzLDEyLjY4MywwLDAsMSwwLTE3LjMyNSwxMS4yMDcsMTEuMjA3LDAsMCwxLDE2LjQ1OCwwQTEyLjY4MywxMi42ODMsMCwwLDEsNTc0LjE5MSw2NzQuNjY4Wm0tOC4yMjktMTYuNTQ2YTcuMDM1LDcuMDM1LDAsMCwwLTUuMjkxLDIuMzE0LDguMTU4LDguMTU4LDAsMCwwLDAsMTEuMTM5LDcuMjEsNy4yMSwwLDAsMCwxMC41ODIsMCw4LjE1OCw4LjE1OCwwLDAsMCwwLTExLjEzOUE3LjAzOCw3LjAzOCwwLDAsMCw1NjUuOTYyLDY1OC4xMjJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTQxIC02NDEpIi8+PC9zdmc+)
  &.file
    width: 55px
    height: 70px
    background-image: url(data:image/svg+xml;base64,PHN2ZyBpZD0iaWMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUyIiBoZWlnaHQ9IjY2IiB2aWV3Qm94PSIwIDAgNTIgNjYiPiAgPGRlZnM+ICAgIDxzdHlsZT4gICAgICAuY2xzLTEsIC5jbHMtNCB7ICAgICAgICBmaWxsOiAjMmRhYmJlOyAgICAgIH0gICAgICAuY2xzLTIgeyAgICAgICAgZmlsbDogI2UwZWFlYzsgICAgICB9ICAgICAgLmNscy0yLCAuY2xzLTMsIC5jbHMtNCB7ICAgICAgICBmaWxsLXJ1bGU6IGV2ZW5vZGQ7ICAgICAgfSAgICAgIC5jbHMtMyB7ICAgICAgICBmaWxsOiAjYjNkMWQ2OyAgICAgIH0gICAgPC9zdHlsZT4gIDwvZGVmcz4gIDxyZWN0IGlkPSLQn9GA0Y/QvNC+0YPQs9C+0LvRjNC90LjQul8xMzcwX9C60L7Qv9C40Y9fMyIgZGF0YS1uYW1lPSLQn9GA0Y/QvNC+0YPQs9C+0LvRjNC90LjQuiAxMzcwINC60L7Qv9C40Y8gMyIgY2xhc3M9ImNscy0xIiB3aWR0aD0iNDYiIGhlaWdodD0iNjAiLz4gIDxwYXRoIGlkPSLQn9GA0Y/QvNC+0YPQs9C+0LvRjNC90LjQul8xMzcwIiBkYXRhLW5hbWU9ItCf0YDRj9C80L7Rg9Cz0L7Qu9GM0L3QuNC6IDEzNzAiIGNsYXNzPSJjbHMtMiIgZD0iTTkzOSw3NzRoMzAuOTI3TDk4NSw3ODkuMDE5VjgzNEg5MzlWNzc0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTkzMyAtNzY4KSIvPiAgPHBhdGggaWQ9ItCf0YDRj9C80L7Rg9Cz0L7Qu9GM0L3QuNC6XzEzNzIiIGRhdGEtbmFtZT0i0J/RgNGP0LzQvtGD0LPQvtC70YzQvdC40LogMTM3MiIgY2xhc3M9ImNscy0zIiBkPSJNOTcwLDc3NGwxNSwxNUg5NzBWNzc0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTkzMyAtNzY4KSIvPiAgPHBhdGggaWQ9Il8xMTEiIGRhdGEtbmFtZT0iMTExIiBjbGFzcz0iY2xzLTQiIGQ9Ik05NzIsODEydi0zaC00di03aDExdjEwaC03Wm0tNi04aC0zdi03aDd2M2gtNHY0Wm0tOCw1aC01djdoLThWODAzaDEzdjZabTEyLDE3SDk1NVY4MTFoMTV2MTVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOTMzIC03NjgpIi8+PC9zdmc+)
.image-uploader-empty-text
  color: #6c6c6c
  font-size: 14px
  font-weight: 400
  width: 100%
  label
    color: #3b5998
    cursor: pointer
    display: inline-block
    border-bottom: 1px solid #3b5998
  input
    opacity: 0
    z-index: -2
    display: none
.image-preview-wrap
  display: flex
  flex-direction: column
  align-items: center
  position: relative
  height: 100%
  img
    vertical-align: top
    max-width: 100%
    max-height: 160px
  .delete
    position: absolute
    top: 5px
    right: 5px
    width: 12px
    height: 12px
    cursor: pointer
    background-size: contain
    background-repeat: no-repeat
    background-position: center
    background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM2NXB0IiB2aWV3Qm94PSIwIDAgMzY1LjcxNzMzIDM2NSIgd2lkdGg9IjM2NXB0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiNmNDQzMzYiPjxwYXRoIGQ9Im0zNTYuMzM5ODQ0IDI5Ni4zNDc2NTYtMjg2LjYxMzI4Mi0yODYuNjEzMjgxYy0xMi41LTEyLjUtMzIuNzY1NjI0LTEyLjUtNDUuMjQ2MDkzIDBsLTE1LjEwNTQ2OSAxNS4wODIwMzFjLTEyLjUgMTIuNTAzOTA2LTEyLjUgMzIuNzY5NTMyIDAgNDUuMjVsMjg2LjYxMzI4MSAyODYuNjEzMjgyYzEyLjUwMzkwNyAxMi41IDMyLjc2OTUzMSAxMi41IDQ1LjI1IDBsMTUuMDgyMDMxLTE1LjA4MjAzMmMxMi41MjM0MzgtMTIuNDgwNDY4IDEyLjUyMzQzOC0zMi43NS4wMTk1MzItNDUuMjV6bTAgMCIvPjxwYXRoIGQ9Im0yOTUuOTg4MjgxIDkuNzM0Mzc1LTI4Ni42MTMyODEgMjg2LjYxMzI4MWMtMTIuNSAxMi41LTEyLjUgMzIuNzY5NTMyIDAgNDUuMjVsMTUuMDgyMDMxIDE1LjA4MjAzMmMxMi41MDM5MDcgMTIuNSAzMi43Njk1MzEgMTIuNSA0NS4yNSAwbDI4Ni42MzI4MTMtMjg2LjU5Mzc1YzEyLjUwMzkwNi0xMi41IDEyLjUwMzkwNi0zMi43NjU2MjYgMC00NS4yNDYwOTRsLTE1LjA4MjAzMi0xNS4wODIwMzJjLTEyLjUtMTIuNTIzNDM3LTMyLjc2NTYyNC0xMi41MjM0MzctNDUuMjY5NTMxLS4wMjM0Mzd6bTAgMCIvPjwvZz48L3N2Zz4=)
.errors
  p
    font-size: 15px
    color: red
    margin-bottom: 5px
.file-name
  margin-top: 5px
  display: inline-block
  p
    text-align: center
    max-width: 100%
    width: 150px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    margin-bottom: 0

</style>
