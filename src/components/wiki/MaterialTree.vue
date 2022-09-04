<template>
  <div v-if="!loading">
    <v-treeview
      dense
      open-all
      :items="tree"
      activatable
      item-key="id"
      open-on-click
      :active="active"
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
    open: [],
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
      const categories = []

      this.materialCategories.forEach((materialCategory) => {
        categories.push({
          ...materialCategory,
          parent_id: materialCategory.parent_id ? `category-${materialCategory.parent_id}` : null,
          id: `category-${materialCategory.id}`,
          isMaterial: false
        })
        materialCategory.ancestors.forEach((materialCategory) => {
          categories.push({
            ...materialCategory,
            parent_id: materialCategory.parent_id ? `category-${materialCategory.parent_id}` : null,
            id: `category-${materialCategory.id}`,
            isMaterial: false
          })
        })
      })

      return categories
    },
    tree() {
      const data = [...this.transformedMaterialCategories.concat(this.transformedMaterials)]

      return toTree(data)
    },
    isMaterialPage() {
      return this.$route.name === 'wiki.materials.show'
    },
    active() {
      if (!this.isMaterialPage) {
        return []
      }

      return [+this.$route.params.id]
    }
  },
  async created() {
    this.materialCategories = await MaterialCategory
      .with('ancestors')
      .custom('material-categories/all')
      .select({
        material_categories: ['id', 'name', 'parent_id', '_lft', '_rgt'],
        ancestors: ['id', 'name', '_lft', '_rgt', 'parent_id']
      })
      .enabled()
      .hasMaterials()
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
        // await this.$router.push({ name: 'wiki.index' })

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
