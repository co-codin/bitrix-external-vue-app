<template>
  <div v-if="!loading">
    <v-treeview
      dense
      :items="tree"
      activatable
      item-key="id"
      open-on-click
      :open="open"
      class="mt-1"
      @update:active="openMaterial"
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="!item.isMaterial">
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-else>
          mdi-file-document-outline
        </v-icon>
      </template>
    </v-treeview>
  </div>
</template>

<script>
import MaterialCategory from '@/models/MaterialCategory'
import { toTree } from '@/utils/helpers'
import Material from '@/models/Material'

export default {
  data: () => ({
    loading: true,
    open: ['category-2', 'category-1'],
    materialCategories: [],
    materials: []
  }),
  computed: {
    transformedMaterials() {
      return this.materials.map((material) => ({
        ...material,
        parent_id: `category-${material.material_category_id}`,
        isMaterial: true
      }))
    },
    transformedMaterialCategories() {
      return this.materialCategories.map((materialCategory) => ({
        ...materialCategory,
        parent_id: materialCategory.parent_id ? `category-${materialCategory.parent_id}` : null,
        id: `category-${materialCategory.id}`,
        isMaterial: false
      }))
    },
    tree() {
      const data = [...this.transformedMaterialCategories.concat(this.transformedMaterials)]

      return toTree(data)
    }
  },
  async created() {
    this.materialCategories = await MaterialCategory
      .custom('material-categories/all')
      .select({
        material_categories: ['id', 'name', 'parent_id']
      })
      .enabled()
      .orderBy('name')
      .$all()

    this.materials = await Material
      .custom('materials/all')
      .select({
        materials: ['id', 'name', 'material_category_id']
      })
      .enabled()
      .orderBy('name')
      .$all()

    this.loading = false
  },
  methods: {
    async openMaterial(e) {
      const materialId = e?.[0]

      if (!materialId) {
        await this.$router.push({ name: 'wiki.index' })

        return
      }

      if (this.$route.name === 'wiki.materials.show' && +this.$route.params.id === materialId) {
        return
      }

      await this.$router.push({ name: 'wiki.materials.show', params: { id: materialId } })
    }
  }
}
</script>

<style>
.v-treeview-node__level {
  width: 10px;
}

.v-treeview-node__label {
  margin-top: 4px;
}
</style>
