<template>
  <div>
    <div @click="showCommandPalette = true">
      <v-text-field
        solo
        placeholder="Поиск по базе знаний..."
        prepend-inner-icon="search"
        hide-details
        :rounded="false"
        flat
        class="mb-1"
        readonly
      />
    </div>
    <v-dialog v-model="showCommandPalette" max-width="1000px" content-class="search-dialog">
      <v-card>
        <v-autocomplete
          autofocus
          :loading="loading"
          solo
          item-text="name"
          item-value="id"
          placeholder="Поиск по материалам"
          hide-details
          :no-filter="true"
          prepend-inner-icon="search"
          :items="items"
          :search-input.sync="search"
          v-bind="$props"
          @change="search = ''"
        >
          <template #item="{ item }">
            <v-list-item link :to="{ name: 'wiki.materials.show', params: { id: item.material_id || item.id }, hash: item.material && `#block-${item.id}` }" @click="showCommandPalette = false">
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
          <template #no-data>
            <v-list-item v-if="!search || search.length < 2">
              <div class="text-caption">Введите не менее 2х символов</div>
            </v-list-item>
            <v-list-item v-else-if="loading">
              <div class="text-caption">Ищем...</div>
            </v-list-item>
            <v-list-item v-else>
              <div class="text-caption">Ничего не найдено</div>
            </v-list-item>
          </template>
          <template #message>
            asas
          </template>
        </v-autocomplete>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import HasLoadingBar from '@/mixins/hasLoadingBar'
import debounce from 'lodash/debounce'

export default {
  mixins: [
    HasLoadingBar
  ],
  data: () => ({
    items: [],
    search: null,
    showCommandPalette: false,
    loading: false
  }),
  computed: {
    noDataPanelAvailable() {
      return this.search && this.search.length >= 2 && !this.loading
    }
  },
  watch: {
    search(value) {
      this.searchItems(value)
    }
  },
  created() {
    window.addEventListener('keydown', this.handleKeyboard)
  },
  destroyed() {
    window.removeEventListener('keydown', this.handleKeyboard)
  },
  methods: {
    handleKeyboard(event) {
      if (event.code === 'KeyK' && (event.metaKey || event.ctrlKey)) {
        this.showCommandPalette = true
      }
    },
    searchItems: debounce(async function (query) {
      if (!query || query.length < 2) {
        return
      }

      this.showLoading()

      const { data } = await this.$r2d2.get('/wiki/search', {
        params: {
          term: query
        }
      })

      this.items = data.results

      this.hideLoading()
    }, 300)
  }
}
</script>
