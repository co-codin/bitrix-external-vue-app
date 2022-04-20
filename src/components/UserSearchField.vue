<template>
  <div>
    <v-row dense class="mt-3">
      <v-col cols="8">
        <v-text-field
          v-model="search"
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
              v-model="selected"
              :search="search"
              open-all
              :items="tree"
              multiple-active
              selectable
              :filter="filterItems"
              on-icon="mdi-bookmark"
              off-icon="mdi-bookmark-outline"
              indeterminate-icon="mdi-bookmark-minus"
              expand-icon="mdi-chevron-down"
              open-on-click
              selected-color="indigo"
              item-key="id"
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
        <v-card v-if="selected.length > 0">
          <v-card-text>
            <v-list subheader dense>
              <v-subheader>Выбранные сотрудники</v-subheader>
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
                </v-list-item-content>
                <v-list-item-icon>
                  <v-btn icon @click="removeUser(i)">
                    <v-icon dense color="red darken-4">delete</v-icon>
                  </v-btn>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div class="text-center mt-3">
      <v-btn
        v-if="hasChanges"
        class="mx-1"
        color="green"
        dark
        @click="save()"
      >Применить</v-btn>
      <v-btn outlined class="mx-1" color="red" @click="close()">Отмена</v-btn>
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
    },
    defaultOpenedTree: {
      type: Array,
      default: () => (['department-1'])
    }
  },
  data() {
    return {
      selected: Array.isArray(this.value)
        ? [...this.value]
        : this.value,
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
    selectedUsers() {
      if (!this.selected) {
        return []
      }

      return this.users.filter((user) => this.selected === user.ID || this.selected.includes(user.ID)).map((user) => ({
        id: user.ID,
        name: `${user.NAME} ${user.LAST_NAME}`,
        avatar: user?.PERSONAL_PHOTO || this.getDefaultAvatar(user?.PERSONAL_GENDER),
        gender: user?.PERSONAL_GENDER
      }))
    },
    hasChanges() {
      return this.value?.length !== this.selected?.length || (!this.multiple ? this.value !== this.selected : !! this.value.find((value, index) => value !== this.selected[index]))
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
    removeUser(i) {
      this.selected.splice(i, 1)
    },
    buildDepartmentsTree(parentId = null) {
      return this.getDepartmentsByParentId(parentId).map((department) => {
        const departmentUsers = this.getDepartmentUsers(department.ID)
        const childDepartments = this.buildDepartmentsTree(department.ID)

        // if (this.searchQuery && (!department.NAME.toLowerCase().includes(this.searchQueryLowerCase) && !childDepartments.length && !departmentUsers.length)) {
        //   return null
        // }

        return {
          id: `department-${department.ID}`,
          name: department.NAME,
          children: departmentUsers.concat(childDepartments)
        }
      })
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

        // if (this.searchQuery && !name.toLowerCase().includes(this.searchQueryLowerCase)) {
        //   return null
        // }

        return {
          id: user.ID,
          name,
          avatar: user?.PERSONAL_PHOTO || this.getDefaultAvatar(user?.PERSONAL_GENDER),
          gender: user?.PERSONAL_GENDER
        }
      }).filter(Boolean)
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      this.$emit('input', this.selected)
    },
    filterItems(item) {
      return item.name.toLowerCase().includes(this.search.toLowerCase())
    }
  }
}
</script>
