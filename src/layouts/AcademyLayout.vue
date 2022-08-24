<template>
  <div class="pa-2">
    <page-loader v-if="!loaded" />
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
      />
      <v-row dense class="mt-1">
        <v-col cols="2" md="3" lg="3" xl="2">
          <material-tree />
        </v-col>
        <v-col cols="9" lg="7" xl="6" class="mt-2">
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
    </template>
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
