<template>
  <div>
    <CreateTaskDocument :task-id="taskId" @uploaded="getTaskFiles" />
    <v-card>
      <v-data-table
        v-if="files.length"
        item-key="id"
        :headers="headers"
        :items="files"
        :loading="isLoading"
        :items-per-page="200"
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
import BX24Wrapper from '@/utils/bx24-wrapper'
import CreateTaskDocument from '@/pages/tasks/components/CreateTaskDocument'

export default {
  components: {
    TrashIcon,
    EyeIcon,
    DownloadIcon,
    CreateTaskDocument
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
    form: {
      files: []
    }
  }),
  async mounted() {
    this.isLoading = true
    await this.getTaskFiles()
    this.isLoading = false
  },
  methods: {
    async getTaskFiles() {
      const { options } = BX24.placement.info()

      this.taskId = options?.ID ?? options?.taskId

      try {
        const files = await (new BX24Wrapper()).callMethod(
          'task.item.getfiles',
          { TASKID: this.taskId }
        )

        const file = await (new BX24Wrapper()).callMethod(
          'disk.file.get',
          { id: 714799 }
        )

        console.log(file)

        this.files = files.sort((a, b) => b.ATTACHMENT_ID - a.ATTACHMENT_ID)
      } catch (e) {
        this.$snackbar('Произошла ошибка при загрузке файлов')
      }
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
        this.$snackbar('Произошла ошибка при качании файла')
      }

    },
    async previewFile(item) {
      try {
        const file = await (new BX24Wrapper()).callMethod('disk.file.get', {
          id: item.FILE_ID
        })

        window.open(file.DETAIL_URL, '_blank')
      } catch (e) {
        this.$snackbar('Произошла ошибка при просмотра файла')
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
          this.$snackbar('Произошла ошибка при отвязки файла')
        }
      } catch (e) {
        this.$snackbar('Произошла ошибка при удалении файла')
      }
    }
  }
}
</script>

<style scoped>
.error-block {
  border: 1px solid red !important
}
</style>
