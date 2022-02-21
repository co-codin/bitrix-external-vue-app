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
              <div class="px-3 py-8">
                <upload-icon width="50" height="50" />
                <div class="mt-2">Нажмите, чтобы выбрать файлы или просто перетащите их сюда</div>
              </div>
            </v-card>
          </div>

          <div class="mb-7">
            <v-expansion-panels class="mb-2">
              <v-expansion-panel style="border: 1px solid red !important">
                <v-expansion-panel-header class="title">
                  (без названия)
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <v-col cols="12" sm="5" md="4" lg="2">
                      <v-img
                        max-width="100%"
                        src="https://picsum.photos/id/11/500/300"
                      />
                    </v-col>
                    <v-col cols="12" sm="7" md="8" lg="10">
                      <div>
                        <v-text-field
                          label="Название"
                          dense
                          :error="true"
                          error-messages="Необходимо заполнить поле"
                        />
                        <v-select
                          label="Тип"
                          :items="documentTypeLabels"
                          dense
                        />
                        <v-text-field
                          label="Заметка"
                          dense
                        />
                      </div>
                    </v-col>
                  </v-row>
                  <v-divider class="my-2"/>
                  <div class="text-center">
                    <v-btn small color="red" dark>Удалить</v-btn>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <div class="text-right">
              <v-btn color="primary" :loading="loadingFiles" :disabled="loadingFiles" @click="loadingFiles = true">
                Загрузить выбранные файлы (2)
              </v-btn>
            </div>
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

        <template #item.action>
          <div class="table-actions">
            <v-btn icon>
              <eye-icon />
            </v-btn>
            <v-btn icon>
              <download-icon />
            </v-btn>
            <v-btn icon>
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

export default {
  components: {
    UploadIcon,
    TrashIcon,
    EyeIcon,
    DownloadIcon
  },
  data: () => ({
    task: null,
    files: [
      { id: 1, name: 'Счет № 2919394', type: 1 },
      { id: 2, name: 'УПД № 21313 от Medcompany', type: 3 },
      { id: 3, name: 'Договор поставка № 10203013/1', type: 2 }
    ],
    headers: [
      { text: 'ID', align: 'left', value: 'id', sortable: false },
      { text: 'Название', align: 'left', value: 'name', sortable: false },
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
    loadingFiles: false
  }),
  mounted() {
    window.addEventListener('load', () => {
      const info = window.BX24.placement.info()
      const taskID = info.options.taskId

      console.log(taskID)

      window.BX24.callMethod(
        'task.item.getdata',
        [taskID],
        (result) => {
          console.info(result.data())
          console.log(result)
        }
      )
    })
  },
  methods: {
    // uploadFile() {
    //   window.BX24.callMethod('disk.storage.uploadfile', {
    //     id: 688,
    //     fileContent: this.$refs.uploader,
    //     data: {
    //       NAME: '2102102.jpg'
    //     }
    //   })
    // }
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
