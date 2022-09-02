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

export default {
  components: {
    MaterialBlock
  },
  title() {
    return `${this.tag?.name || 'Страница тега'}`
  },
  data: () => ({
    tag: null,
    loading: true
  }),
  async created() {
    console.log(this.$route)
    try {
      this.tag = await Tag.with('materialBlocks.material').$find(this.$route.params.id)
      this.loading = false
    }
    catch (e) {
      this.loading = false
    }
  }
}
</script>
