<template>
  <div>
    <div v-for="(block, index) in transformedBlocks" :key="index">
      <material-block :block="block" :depth="depth">
<!--        <template #name="{ title }">-->
<!--          {{ block.number }}. {{ title }}-->
<!--        </template>-->
      </material-block>
      <material-blocks
        v-if="block.children && block.children.length"
        :depth="depth + 1"
        :number="block.number"
        :blocks="block.children"
      />
    </div>
  </div>
</template>

<script>
import MaterialBlock from '@/components/wiki/MaterialBlock'

export default {
  name: 'MaterialBlocks',
  components: {
    MaterialBlock
  },
  props: {
    depth: {
      type: Number,
      default: 1
    },
    number: {
      type: String,
      default: ''
    },
    blocks: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    transformedBlocks() {
      return this.blocks.map((block, index) => ({
        ...block,
        number: (this.number ? `${this.number}.` : '') + (index + 1)
      }))
    }
  }
}
</script>
