<template>
  <div class="material-page px-10 py-6">
    <template v-if="loading">
      <v-skeleton-loader
        class="mb-2"
        type="heading, button, heading, sentences@4, heading, sentences@4, heading, sentences@4"
      />
    </template>
    <div v-else>
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
                <v-card-subtitle>{{ exam.description | truncate(150) }}</v-card-subtitle>
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
import HasLoadingBar from '@/mixins/hasLoadingBar'
import HasTitle from '@/mixins/hasTitle'
import TableOfContents from '@/components/wiki/TableOfContents'
import { toTree } from '@/utils/helpers'
import MaterialBlocks from '@/components/wiki/MaterialBlocks'
import Exam from '@/models/Exam'

export default {
  components: {
    TableOfContents,
    MaterialBlocks
  },
  mixins: [HasLoadingBar, HasTitle],
  data: () => ({
    showTableOfContents: false,
    material: null,
    blocks: [],
    exams: []
  }),
  title() {
    return this.material?.name || 'База знаний'
  },
  computed: {
    tableOfContents() {
      return []
    },
    blockTree() {
      return toTree(this.blocks, 'id', 'parent_id', 'position')
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

      if (!this.material.isAvailable()) {
        throw new Error('Material is not available')
      }

      this.blocks = await this.material.blocks()
        .custom(`materials/${this.material.id}/blocks`)
        .select({
          material_blocks: ['id', 'name', 'parent_id', 'body']
        })
        .with('files')
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
        const id = window.location.hash.replace('#', '')

        document.getElementById(id).scrollIntoView()
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
  .v-skeleton-loader__heading {
    margin: 25px 0;
  }
}
</style>
