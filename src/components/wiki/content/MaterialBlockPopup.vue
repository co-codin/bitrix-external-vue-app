<template>
  <v-dialog
    v-if="show"
    v-model="show"
    max-width="1400"
    :content-class="`material-block-popup ${popupBlockIsImage ? 'material-block-popup--image' : ''}`"
  >
    <v-card v-if="loading">
      <v-card-text>
        <v-skeleton-loader
          type="heading, button, heading, sentences@6"
        />
      </v-card-text>
    </v-card>
    <v-alert v-else-if="error">
      <v-alert>
        {{ error }}
      </v-alert>
    </v-alert>
    <v-card v-else-if="block">
      <material-block :block="block">
        <template #title>
          <v-card-title v-if="!popupBlockIsImage">
            {{ block.name }}
            <v-spacer />
          </v-card-title>
          <v-btn
            absolute
            right
            top
            color="error"
            small
            style="right:10px; top: 10px;"
            @click="show = false; block = null"
          >
            закрыть
          </v-btn>
        </template>
        <template v-if="block.material && block.material.status === 'ACTIVE'" #subtitle>
          <v-card-subtitle class="py-0 pb-2">
            <v-btn :to="{name: 'wiki.materials.show', params: { id: block.material.id } }" target="_blank" @click="show = false">
              <v-icon class="mr-1">
                mdi-file-document-outline
              </v-icon>
              Открыть материал
            </v-btn>
          </v-card-subtitle>
        </template>
        <v-card-text class="pt-0">
          <div class="topic" v-html="block.body"></div>
        </v-card-text>
      </material-block>
    </v-card>
  </v-dialog>
</template>

<script>
import MaterialBlockModel from '@/models/MaterialBlock'

export default {
  components: {
    MaterialBlock: () => import('@/components/wiki/MaterialBlock')
  },
  props: {
    blockId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    loading: false,
    show: true,
    error: null,
    block: null
  }),
  computed: {
    popupBlockIsImage() {
      if (!this.block || !this.block.body) {
        return false
      }

      return !! (this.block.body.match(/<p><img(.*)\/><\/p>$/))
    }
  },
  created() {
    this.loadPopup()
  },
  methods: {
    async loadPopup() {
      this.error = null
      this.loading = true
      this.show = true

      try {
        this.block = await MaterialBlockModel
          .custom('material-blocks')
          .select({
            material_blocks: ['id', 'name', 'body', 'material_id'],
            material: ['id', 'name']
          })
          .with('material')
          .$find(this.blockId)

        this.loading = false
      }
      catch (e) {
        this.loading = false
        this.error = 'Произошла ошибка при загрузке раздела'
      }
    }
  }
}
</script>

<style lang="scss">
.material-block-popup {
  .wiki-section {
    margin: 0;
  }
  &--image {
    width: auto !important;
    min-width: 300px;
    .v-card__text {
      padding: 0;
    }
    .topic {
      p {
        margin-top: 0;
      }
      img {
        max-width: 100%;
        width: auto;
      }
    }
  }
}
</style>
