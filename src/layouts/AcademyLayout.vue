<template>
  <div class="pa-2">
    <v-text-field
      solo
      rounded
      placeholder="Поиск по базе знаний..."
      prepend-inner-icon="search"
      hide-details
      class="mb-1"
    />
    <v-row dense class="mt-1">
      <v-col cols="3">
        <v-treeview
          dense
          :items="items"
          activatable
          :active="tree"
          item-key="id"
          open-on-click
          :open="open"
          class="mt-1"
        >
          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="!item.file">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>
              {{ files[item.file] }}
            </v-icon>
          </template>
        </v-treeview>
      </v-col>
      <v-col cols="9" class="mt-2">
        <slot></slot>
      </v-col>
    </v-row>
    <v-btn
      v-show="fab"
      v-scroll="onScroll"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="$vuetify.goTo(0)"
    >
      <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>
  </div>
</template>

<script>

export default {
  components: {},
  data: () => ({
    fab: false,
    breadcrumbs: [{ text: 'База знаний' }],
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
    scrollOptions: {
      duration: 450,
      offset: 15,
      easing: 'easeInOutCubic'
    },
    showTableOfContents: false,
    tree: ['material-1'],
    open: ['category-2', 'category-1'],
    items: [
      {
        id: 'category-1',
        name: 'Регламенты',
        children: [
          {
            id: 'category-2',
            name: 'Процесс продажи',
            children: [
              {
                id: 'material-1',
                name: 'Регламент отдела продаж',
                file: 'txt',
                to: { name: 'wiki.material', params: { id: 1 } }
              },
              {
                id: 'material-2',
                name: 'Регламент пост-продажного процесса',
                file: 'txt'
              }
            ]
          }
        ]
      },
      {
        id: 'category-3',
        name: 'Приказы',
        children: [
          {
            id: 'material-3',
            name: 'Переписка только по E-mail',
            file: 'txt'
          },
          {
            id: 'material-4',
            name: 'Установка ПО "Стахановец"',
            file: 'txt'
          },
          {
            id: 'material-5',
            name: 'Ежедневный отчет о проделанной работе',
            file: 'txt'
          }
        ]
      }
    ]
  }),
  methods: {
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0

      this.fab = top > 40
    }
  }
}
</script>

<style lang="scss">
.material-page {
  h1 {
    color: rgba(0, 0, 0, .87) !important;
  }
}

.wiki-section {
  color: rgba(0, 0, 0, .87);
  margin: 30px 0;

  &__title {
    margin-bottom: 30px;

    a {
      text-decoration: none;
      border: none;

      &:hover {
        color: #572fcf;
      }
    }
  }

  &__content {

  }
}

.table-of-contents {
  a {
    text-decoration: none;
    border-bottom: 1px solid #0096c7;
  }

  ol {
    counter-reset: item;
    padding-left: 20px;
    margin-top: 10px;
  }

  li {
    display: block;
    font-size: 16px;
    margin-bottom: 10px;
  }

  li:before {
    content: counters(item, ".") ". ";
    counter-increment: item
  }
}

.v-treeview-node__level {
  width: 10px;
}

.v-treeview-node__label {
  margin-top: 4px;
}
</style>
