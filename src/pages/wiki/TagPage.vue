<template>
  <div v-if="!loading && tag">
    <div class="material-page px-10 py-6">
      <h1 class="text-h3 ml-n5"># {{ tag.name }}</h1>
      <div>
        <div v-for="(block, index) in tag.material_blocks" :key="index">
          <material-block :block="block">
            <template #subtitle>
              <div>
                <v-btn class="px-1 ml-n1" text :to="{ name: 'wiki.materials.show', params: { id: block.material.id } }">
                  <v-icon class="mr-1">
                    mdi-file-document-outline
                  </v-icon>
                  {{ block.material.name }}
                </v-btn>
              </div>
            </template>
          </material-block>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tag from '../../models/Tag'
import MaterialBlock from '../../components/wiki/MaterialBlock'
import HasLoadingBar from '@/mixins/hasLoadingBar'
import HasTitle from '@/mixins/hasTitle'

export default {
  components: {
    MaterialBlock
  },
  mixins: [
    HasLoadingBar, HasTitle
  ],
  title() {
    return `${this.tag?.name || 'Страница тега'}`
  },
  data: () => ({
    tag: null
  }),
  async created() {
    await this.loadTag(this.$route.params.id)
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name === 'wiki.tags.show') {
      this.loadTag(to.params.id)
    }

    next()
  },
  methods: {
    async loadTag(id) {
      this.showLoading()
      this.tag = await Tag.with('materialBlocks.material').$find(id)
      this.hideLoading()
    }
  }
}
</script>
