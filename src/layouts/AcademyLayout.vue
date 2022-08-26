<template>
  <v-container ref="layout" fluid class="py-2">
    <wiki-search />
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
  </v-container>
</template>

<script>
import MaterialTree from '@/components/wiki/MaterialTree'
import WikiSearch from '@/components/wiki/WikiSearch'

export default {
  components: {
    MaterialTree,
    WikiSearch
  },
  title() {
    return 'База знаний'
  },
  data: () => ({
    fab: false
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
.academy-content {
  &__sidebar {
  }

  &__main > div {
    background: white;
    height: 100%;
  }
}
</style>
