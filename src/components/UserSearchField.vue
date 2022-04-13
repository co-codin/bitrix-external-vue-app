<template>
  <v-row dense class="mt-3">
    <v-col cols="8">
      <v-card>
        <v-card-text>
          <v-treeview
            v-model="selected"
            :items="tree"
            multiple-active
            selectable
            on-icon="mdi-bookmark"
            off-icon="mdi-bookmark-outline"
            indeterminate-icon="mdi-bookmark-minus"
            expand-icon="mdi-chevron-down"
            open-on-click
            selected-color="indigo"
            item-key="name"
            return-object
          >
          </v-treeview>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card v-if="selected.length > 0">
        <v-card-text>
          <v-list subheader dense>
            <v-subheader>Выбранные сотрудники</v-subheader>
            <v-list-item
              v-for="(selection, i) in selected"
              :key="i"
              dense
            >
              <v-list-item-avatar>
                <v-img :src="selection.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="selection.name"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon @click="removeUser(i)">
                <v-icon dense color="red darken-4">delete</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import users from './users'
import departments from './departments'

export default {
  data: () => ({
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-code-json',
      md: 'mdi-language-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel'
    },
    departments: [],
    selected: []
  }),
  computed: {
    tree() {
      return this.buildDepartmentsTree()
    }
  },
  async mounted() {
    this.users = await this.$bx24.callBatchListMethod('user.get')
    this.departments = await this.$bx24.callBatchListMethod('department.get')

    // this.users = users.filter((user) => user.ACTIVE === true)
    // this.departments = departments
  },
  methods: {
    removeUser(i) {
      this.selected.splice(i, 1)
    },
    buildDepartmentsTree(parentId = null) {
      return this.getDepartmentsByParentId(parentId).map((department) => {
        const children = this.getDepartmentUsers(department.ID).concat(this.buildDepartmentsTree(department.ID))

        return {
          name: department.NAME,
          children: children && children.length ? children : null
        }
      })
    },
    getDepartmentsByParentId(parentId = null) {
      return this.departments.filter((department) => (!parentId && !department?.PARENT) || department?.PARENT === parentId)
    },
    getDepartmentUsers(departmentId) {
      return this.users.filter((user) => (user.UF_DEPARTMENT ?? []).includes(+departmentId)).map((user) => ({
        id: user.ID,
        name: `${user.NAME} ${user.LAST_NAME}`,
        avatar: 'https://lux-admin.indielayer.com/images/avatars/avatar2.svg'
      }))
    }
  }
}
</script>
