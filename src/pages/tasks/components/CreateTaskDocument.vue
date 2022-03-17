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
    // taskId: {
    //   required: true,
    //   type: Number
    // }
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
    handleFileUpload(e) {
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
        // await this.addImage(files[i]);
      }
    }
  }
}
</script>

<style scoped>

.image-uploader {
  border: 1px dashed #c7ccd6;
  padding: 0 20px;
  height: 100%;
  min-height: 160px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;

}

.dragging {
  border: 3px dashed #3b5998;
}

</style>
