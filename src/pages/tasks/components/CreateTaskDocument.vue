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
          <v-file-input
            id="file"
            v-model="uploadedFile"
            @change="handleFileUpload"
          />
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
    uploadedFile: null,
    loadingFiles: false,
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
    }
  }
}
</script>
