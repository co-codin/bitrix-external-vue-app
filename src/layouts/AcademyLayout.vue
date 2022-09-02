<template>
  <v-container ref="layout" fluid class="py-2">
    <wiki-search/>
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
      v-show="scY > 500"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="toTop"
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
    scTimer: 0,
    scY: 0
  }),
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      if (this.scTimer) return
      this.scTimer = setTimeout(() => {
        this.scY = window.scrollY
        clearTimeout(this.scTimer)
        this.scTimer = 0
      }, 100)
    },
    toTop: function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
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
