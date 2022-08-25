<template>
  <div ref="layout" class="pa-2">
    <page-loader v-if="!loaded"/>
    <v-alert v-else-if="error" type="error" text>
      Произошла ошибка при загрузке Битрикс 24
    </v-alert>
    <template v-else>
      <v-text-field
        solo
        rounded
        placeholder="Поиск по базе знаний..."
        prepend-inner-icon="search"
        hide-details
        class="mb-1"
        readonly
        @click="openCommandPalette"
      />
      <v-row class="academy-content mt-1" dense>
        <v-col
          class="academy-content__sidebar"
          cols="2"
          md="3"
          lg="3"
          xl="2"
        >
          <material-tree/>
        </v-col>
        <v-col cols="9" lg="7" xl="6" class="academy-content__main">
          <div class="mt-4 px-9">
            <slot></slot>
          </div>
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
    </template>
    <v-dialog v-model="showCommandPalette" max-width="1000px" >
      <v-card>
        <v-autocomplete solo placeholder="Поиск по материалам" hide-details prepend-inner-icon="search" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import LayoutMixin from '@/mixins/layout'
import MaterialTree from '@/components/wiki/MaterialTree'

export default {
  components: {
    MaterialTree
  },
  mixins: [
    LayoutMixin
  ],
  data: () => ({
    fab: false,
    showCommandPalette: false
  }),
  methods: {
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0

      this.fab = top > 40
    },
    openCommandPalette() {
      this.showCommandPalette = true
    }
  }
}
</script>

<style lang="scss">
.academy-content {
  background: white;
  &__sidebar {
    background: #f2f5f8;
  }
  &__main > div {
  }
}
</style>
