<template>
  <v-card>
    <v-card-title class="pt-5">
      <div style="position: absolute; left: 0; top: 10px; color: #fff; padding: 0 8px; height: 24px; line-height: 24px; font-size: 1rem;" class="pink darken-1">
        платежи
      </div>
      <div>Исходящие платежи ({{ payments.length }})</div>
    </v-card-title>
    <v-list two-line subheader dense>
      <v-slide-y-transition group tag="div.v-list-item">
        <v-list-item
          v-for="(item, i) in payments"
          :key="i"
          dense
          @click="openProject(i)"
        >
          <v-list-item-avatar>
            <v-icon
              :class="[item.iconClass]"
              v-text="item.icon"
            ></v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
            <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-slide-y-transition>
    </v-list>
    <v-dialog
      v-if="project !== null"
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title
          primary-title
        >
          Проект #131324/1
        </v-card-title>

        <v-card-text>
          <div><b>ИНН:</b> 214224334</div>
          <div><b>Куратор:</b> Артем Карамышев</div>
          <div><b>Оборудование</b></div>
          <div>- Samsung SonoAce R7 - 2 шт.</div>
          <div>- Samsung UGEO R500 - 2 шт.</div>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            text
            @click="approveProject(project)"
          >
            Одобрить
          </v-btn>
          <v-btn
            color="red"
            text
            @click="rejectProject(project)"
          >
            Отклонить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      dialog: false,
      project: null,
      payments: [
        { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: '200 000 руб', subtitle: '10.12.2022 в 10:10' },
        { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: '1 200 000 руб', subtitle: '10.12.2022 в 13:10' },
        { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: '3 200 000 руб', subtitle: '10.12.2022 в 20:10' },
        { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: '1 400 руб', subtitle: '10.12.2022 в 08:10' }
      ]
    }
  },
  methods: {
    openProject(i) {
      this.project = i
      this.dialog = true
    },
    approveProject(i) {
      this.$snackbar('Проект одобрен')
      this.dialog = false
      this.projects.splice(i, 1)
      this.project = null
    },
    rejectProject(i) {
      this.$snackbar('Проект отклонен')
      this.dialog = false
      this.projects.splice(i, 1)
      this.project = null
    }
  }
}
</script>
