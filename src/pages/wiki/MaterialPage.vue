<template>
  <div>
    <template v-if="loading">
      <v-row
        class="fill-height mt-3 mb-10"
        align-content="center"
        justify="center"
      >
        <v-col
          class="text-subtitle-1 text-center"
          cols="12"
        >
          Идет загрузка материала...
        </v-col>
        <v-col cols="6">
          <v-progress-linear
            color="primary"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </template>
    <div v-else class="material-page">
      <h1 class="text-h3">{{ material.name }}</h1>
      <div class="table-of-contents mt-3">
        <div v-if="showTableOfContents">
          <transition v-if="showTableOfContents" type="slide-x-transition">
            <table-of-contents :items="blockTreeWithExams" class="mb-3"/>
          </transition>
        </div>
        <div>
          <v-btn color="blue lighten-5" shaped :rounded="false" @click="showTableOfContents = !showTableOfContents">
            {{ showTableOfContents ? 'Свернуть' : 'Оглавление' }}
            <v-icon class="ml-1">
              {{ showTableOfContents ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </v-btn>
        </div>
      </div>

      <material-blocks :blocks="blockTree"/>

      <template v-if="exams.length">
        <v-divider class="my-4"/>
        <div id="block-exams" class="mb-3">
          <h3 class="text-h4 mt-0">
            Экзамены
          </h3>
          <v-row dense class="mt-2">
            <v-col v-for="(exam, index) in exams" :key="index" cols="4">
              <v-card color="#1F7087" dark>
                <v-card-title class="title">{{ exam.name }}</v-card-title>
                <v-card-subtitle>{{ exam.description }}</v-card-subtitle>
                <v-card-actions>
                  <v-btn :to="{ name: 'wiki.exams.show', params: { id: exam.id } }">Пройти экзамен</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Material from '@/models/Material'
import hasLoading from '@/mixins/has-loading'
import TableOfContents from '@/components/wiki/TableOfContents'
import { toTree } from '@/utils/helpers'
import MaterialBlocks from '@/components/wiki/MaterialBlocks'
import Exam from '@/models/Exam'

export default {
  components: {
    TableOfContents,
    MaterialBlocks
  },
  mixins: [hasLoading],
  data: () => ({
    showTableOfContents: false,
    material: null,
    blocks: [],
    exams: []
  }),
  computed: {
    tableOfContents() {
      return []
    },
    blockTree() {
      return toTree(this.blocks)
    },
    blockTreeWithExams() {
      if (!this.exams.length) {
        return this.blockTree
      }

      return this.blockTree.concat([
        { name: 'Экзамены', id: 'exams' }
      ])
    }
  },
  async created() {
    await this.loadMaterial(this.$route.params.id)
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name === 'wiki.materials.show') {
      this.loadMaterial(to.params.id)
    }

    next()
  },
  methods: {
    async loadMaterial(id) {
      this.showLoading()

      this.material = await Material.$find(id)

      this.blocks = await this.material.blocks()
        .select({
          material_blocks: ['id', 'name', 'parent_id', 'body']
        })
        .orderBy('position')
        .$get()

      this.exams = await Exam
        .where('material_id', this.material.id)
        .$all()

      this.hideLoading()

      this.scrollToTheBlock()
    },
    scrollToTheBlock() {
      if (!window.location.hash) {
        return
      }

      this.$nextTick(() => {
        this.$vuetify.goTo(window.location.hash, {
          duration: 0
        })
      })
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
</style>
