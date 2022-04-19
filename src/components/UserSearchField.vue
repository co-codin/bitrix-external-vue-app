<template>
  <div>
    <v-row dense class="mt-3">
      <v-col cols="8">
        <v-text-field
          v-model="searchQuery"
          solo
          hide-details
          prepend-inner-icon="search"
          placeholder="Поиск по пользователям / отделам"
          class="mb-1"
        />
        <v-card>
          <v-card-text>
            <v-treeview
              :value="value"
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
              @input="!multiple && updateValue()"
            >
              <template v-slot:prepend="{ item, open }">
                <v-badge
                  v-if="!item.children && item.head"
                  bordered
                  overlap
                  color="white"
                >
                  <template v-slot:badge>
                    <v-icon dense color="amber darken-3">mdi-crown</v-icon>
                  </template>
                  <v-avatar size="18">
                    <v-img :src="item.avatar" />
                  </v-avatar>
                </v-badge>
                <v-avatar v-else-if="!item.children && item.avatar" size="25">
                  <v-img :src="item.avatar" />
                </v-avatar>
                <v-icon v-else>
                  {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card v-if="value.length > 0">
          <v-card-text>
            <v-list subheader dense>
              <v-subheader>Выбранные сотрудники</v-subheader>
              <v-list-item
                v-for="(selection, i) in value"
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
    <div>
      <v-btn v-if="changed" color="green" dark @click="updateValue">Применить</v-btn>
      <span class="px-3"></span>
      <v-btn outlined color="red" @click="cancel">Отмена</v-btn>
    </div>
  </div>
</template>

<script>
import users from './users'
import departments from './departments'

export default {
  props: {
    value: {
      type: Array || Number,
      default: () => ([])
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
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
    searchQuery: null,
    changed: false
  }),
  computed: {
    tree() {
      return this.buildDepartmentsTree()
    }
  },
  watch: {
    value: {
      handler() {
        this.changed = true
      },
      deep: true
    }
  },
  async mounted() {
    // this.users = await this.$bx24.callBatchListMethod('user.get', { filter: { ACTIVE: true } })
    // this.departments = await this.$bx24.callBatchListMethod('department.get')

    this.users = users.filter((user) => user.ACTIVE === true)
    this.departments = departments
  },
  methods: {
    removeUser(i) {
      const newValue = [...this.value]

      newValue.splice(i, 1)

      this.updateValue(newValue)
    },
    buildDepartmentsTree(parentId = null) {
      return this.getDepartmentsByParentId(parentId).map((department) => {
        const departmentUsers = this.getDepartmentUsers(department.ID)
        const childDepartments = this.buildDepartmentsTree(department.ID)

        return {
          name: department.NAME,
          children: departmentUsers.concat(childDepartments)
        }
      })
    },
    getDepartmentsByParentId(parentId = null) {
      return this.departments.filter((department) => (!parentId && !department?.PARENT) || department?.PARENT === parentId)
    },
    getDepartmentUsers(departmentId) {
      return this.users.filter((user) => (user.UF_DEPARTMENT ?? []).includes(+departmentId)).map((user) => {
        const defaultAvatar = user?.PERSONAL_GENDER === 'F'
          ? '/images/avatars/avatar2.svg' // default avatar for female
          : '/images/avatars/avatar1.svg' // default avatar for male

        return {
          id: user.ID,
          name: `${user.NAME} ${user.LAST_NAME}`,
          avatar: user?.PERSONAL_PHOTO || defaultAvatar,
          gender: user?.PERSONAL_GENDER
        }
      })
    },
    updateValue(event) {
      this.$emit('input', event)
    },
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
