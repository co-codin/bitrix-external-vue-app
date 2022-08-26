<template>
  <v-container ref="layout" fluid class="py-2">
    <div @click="openCommandPalette">
      <v-text-field
        solo
        placeholder="Поиск по базе знаний..."
        prepend-inner-icon="search"
        hide-details
        :rounded="false"
        flat
        class="mb-1"
        disabled
        readonly
      />
    </div>
    <v-row class="academy-content mt-1" dense>
      <v-col
        class="academy-content__sidebar"
        cols="3"
      >
        <material-tree/>
      </v-col>
      <v-col cols="9" class="academy-content__main">
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
    <v-dialog v-model="showCommandPalette" max-width="1000px" content-class="search-dialog">
      <v-card>
        <v-autocomplete
          autofocus
          :loading="isLoading"
          solo
          item-text="name"
          item-value="id"
          placeholder="Поиск по материалам"
          hide-details
          prepend-inner-icon="search"
          :items="items"
          :search-input.sync="search"
          cache-items
          v-bind="$props"
          @change="search = ''"
        >
          <template #item="{ item }">
            <v-list-item link :to="{ name: 'wiki.materials.show', params: { id: item.material_id || item.id }, hash: item.material && `#block-${item.id}` }" @click="hideCommandPalette">
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.material ? item.material.name : item.name }}
                </v-list-item-title>
                <template v-if="item.material && item.type === 'block'">
                  <v-list-item-subtitle>
                    {{ item.name }}
                  </v-list-item-subtitle>
                </template>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import MaterialTree from '@/components/wiki/MaterialTree'
import debounce from 'lodash/debounce'

export default {
  components: {
    MaterialTree
  },
  title() {
    return 'База знаний'
  },
  data: () => ({
    fab: false,
    showCommandPalette: false,
    isLoading: false,
    search: null,
    items: []

  }),
  watch: {
    search(value) {
      this.searchItems(value)
    }
  },
  methods: {
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0

      this.fab = top > 40
    },
    openCommandPalette() {
      this.showCommandPalette = true
    },
    hideCommandPalette() {
      this.showCommandPalette = false
    },
    searchItems: debounce(async function (query) {
      this.isLoading = true

      const { data } = await this.$r2d2.get('/wiki/search', {
        params: {
          term: query
        }
      })

      this.items = data.results

      this.isLoading = false
    }, 300)
  }
}
</script>

<style lang="scss">
.academy-content {
  &__sidebar {
  }

  &__main > div {
    background: white;
    height: 100%;
  }
}

.search-dialog {
  position: absolute;
  top: 10%;
  padding-left: 12px;
  padding-right: 12px;
}
</style>
