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
        <v-autocomplete solo placeholder="Поиск по материалам" hide-details prepend-inner-icon="search"/>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import MaterialTree from '@/components/wiki/MaterialTree'

export default {
  components: {
    MaterialTree
  },
  title() {
    return 'База знаний'
  },
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
