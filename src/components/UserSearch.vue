<template>
  <v-row dense>
    <v-col cols="8">
      <v-text-field
        v-model="search"
        autofocus
        solo
        hide-details
        prepend-inner-icon="search"
        placeholder="Поиск по пользователям / отделам"
        class="mb-1"
        clearable
      />
      <v-card :loading="!loaded">
        <v-card-text>
          <v-treeview
            v-if="loaded"
            :value="value"
            :search="search"
            open-all
            :items="tree"
            multiple-active
            dense
            selectable
            :filter="filterItems"
            on-icon="mdi-bookmark"
            off-icon="mdi-bookmark-outline"
            indeterminate-icon="mdi-bookmark-minus"
            expand-icon="mdi-chevron-down"
            open-on-click
            selected-color="indigo"
            item-key="id"
            @input="updateValue($event)"
          >
            <template v-slot:prepend="{ item, open }">
              <v-avatar v-if="!item.children" size="25">
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
      <v-card v-if="value && value.length > 0">
        <v-card-text>
          <v-list subheader dense>
            <v-subheader>
              Выбранные сотрудники
              <v-spacer />
              <v-btn small text @click="$emit('input', [])">
                <span class="red--text text--darken-4 mr-1">удалить всех</span>
                <v-icon dense color="red darken-4">delete</v-icon>
              </v-btn>
            </v-subheader>
            <v-list-item
              v-for="(user, i) in selectedUsers"
              :key="i"
              dense
            >
              <v-list-item-avatar>
                <v-img :src="user.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="user.name"></v-list-item-title>
                <v-list-item-subtitle class="text-caption" v-text="user.departments"></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <v-btn icon @click="removeUser(user.id)">
                  <v-icon dense color="red darken-4">delete</v-icon>
                </v-btn>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
      <v-alert
        v-else
        type="info"
        close-icon="mdi-delete"
        color="cyan"
        border="left"
        elevation="2"
        colored-border
      >
        <h3>Выберите пользователей</h3>
        <div>
          в этом блоке появится список выбранных пользователей
        </div>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import users from './users'
import departments from './departments'
import { keyBy } from '@/utils/helpers'

export default {
  props: {
    value: {
      type: Array || Number,
      default: () => ([])
    },
    multiple: {
      type: Boolean,
      default: false
    },
    defaultOpenedTree: {
      type: Array,
      default: () => (['department-1'])
    }
  },
  data() {
    return {
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
      users: [],
      departments: [],
      search: null,
      loaded: false
    }
  },
  computed: {
    tree() {
      return this.buildDepartmentsTree()
    },
    departmentsById() {
      return keyBy(this.departments, 'ID')
    },
    selectedUsers() {
      if (!this.value) {
        return []
      }

      return this.users.filter((user) => this.value === user.ID || this.value.includes(user.ID)).map((user) => ({
        id: user.ID,
        name: `${user.NAME} ${user.LAST_NAME}`,
        departments: user.UF_DEPARTMENT.map((departmentId) => this.departmentsById[departmentId].NAME).join(', '),
        avatar: user?.PERSONAL_PHOTO || this.getDefaultAvatar(user?.PERSONAL_GENDER),
        gender: user?.PERSONAL_GENDER
      }))
    }
  },
  async mounted() {
    if (process.env.NODE_ENV === 'production') {
      this.users = await this.$bx24.callBatchListMethod('user.get', { filter: { ACTIVE: true } })
      this.departments = await this.$bx24.callBatchListMethod('department.get')
    }
    else {
      this.users = users.filter((user) => user.ACTIVE === true)
      this.departments = departments
    }

    this.loaded = true
  },
  methods: {
    removeUser(id) {
      const newValue = [...this.value]
      const index = newValue.findIndex((item) => item === id)

      newValue.splice(index, 1)

      this.$emit('input', newValue)
    },
    buildDepartmentsTree(parentId = null) {
      return this.getDepartmentsByParentId(parentId).map((department) => {
        const departmentUsers = this.getDepartmentUsers(department.ID)
        const childDepartments = this.buildDepartmentsTree(department.ID)

        if (!departmentUsers.length && !childDepartments.length) {
          return null
        }

        return {
          id: `department-${department.ID}`,
          name: department.NAME,
          children: departmentUsers.concat(childDepartments)
        }
      }).filter(Boolean)
    },
    getDepartmentsByParentId(parentId = null) {
      return this.departments.filter((department) => (!parentId && !department?.PARENT) || department?.PARENT === parentId)
    },
    getDefaultAvatar(gender = 'M') {
      return gender === 'F'
        ? '/images/avatars/avatar2.svg' // default avatar for female
        : '/images/avatars/avatar1.svg' // default avatar for male
    },
    getDepartmentUsers(departmentId) {
      return this.users.filter((user) => (user.UF_DEPARTMENT ?? []).includes(+departmentId)).map((user) => {
        const name = `${user.NAME} ${user.LAST_NAME}`

        return {
          id: user.ID,
          name,
          avatar: user?.PERSONAL_PHOTO || this.getDefaultAvatar(user?.PERSONAL_GENDER),
          gender: user?.PERSONAL_GENDER
        }
      }).filter(Boolean)
    },
    filterItems(item) {
      return item.name.toLowerCase().includes(this.search.toLowerCase())
    },
    updateValue(value) {
      this.$emit('input', value)
    }
  }
}
</script>
