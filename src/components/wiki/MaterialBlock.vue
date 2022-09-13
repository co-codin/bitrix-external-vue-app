<template>
  <div :id="`block-${block.id}`" class="wiki-section">
    <slot name="title" :block="block" :copy-link="copyLink">
      <h2 class="wiki-section__title" :class="hClass">
        <a :href="`#block-${block.id}`" @click.prevent="copyLink(block.id)">
          {{ block.name }}
        </a>
      </h2>
    </slot>
    <slot name="subtitle" :block="block"></slot>
    <div ref="body">
      <slot>
        <div class="wiki-section__content topic" v-html="block.body"></div>
      </slot>
    </div>
    <v-list
      v-if="hasFiles"
      max-width="400"
      width="50%"
      dense
      class="pa-0 mt-1"
    >
      <download-button
        v-for="file in block.files"
        :key="file.id"
        v-slot="{ download }"
        :url="`material-blocks/${block.id}/files/${file.id}`"
        :file-name="file.name"
      >
        <v-list-item dense @click="download">
          <v-list-item-avatar>
            <v-icon class="blue white--text">mdi-file</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ file.json_data.comment }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon>
              <v-icon color="grey lighten-1">mdi-download</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </download-button>
    </v-list>
  </div>
</template>

<script>
import MaterialBlockPopup from '@/components/wiki/content/MaterialBlockPopup'
import DownloadButton from '@/components/DownloadButton'
import { renderAlertBlock } from '@/utils/helpers'
import Vuetify from 'vuetify/lib'
import Vue from 'vue'

export default {
  name: 'MaterialBlock',
  components: {
    DownloadButton
  },
  props: {
    block: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      default: 1
    }
  },
  computed: {
    hClass() {
      const h = this.depth + 3

      return `text-h${h}`
    },
    hasFiles() {
      return this.block.files && this.block.files.length
    }
  },
  mounted() {
    this.replaceAlertBlocks()
    this.enableMaterialBlockLinks()
  },
  destroyed() {
    this.disableMaterialBlockLinks()
  },
  methods: {
    copyLink(id) {
      this.$clipboard(`${window.location.origin}${window.location.pathname}#block-${id}`, 'Ссылка скопирована')
    },
    replaceAlertBlocks() {
      this.$refs.body.querySelectorAll('p[data-alert="1"]').forEach((element) => {
        element.outerHTML = renderAlertBlock(element.dataset.alertType, element.innerText)
      })
    },
    enableMaterialBlockLinks() {
      this.$refs.body.querySelectorAll('a[data-block-link="1"]').forEach((element) => {
        if (element.dataset.loadInPopup !== '1') {
          return
        }

        element.addEventListener('click', this.openPopup)
      })
    },
    disableMaterialBlockLinks() {
      this.$refs.body.querySelectorAll('a[data-block-link="1"]').forEach((element) => {
        if (element.dataset.loadInPopup !== '1') {
          return
        }

        element.removeEventListener('click', this.openPopup)
      })
    },
    createComponent(component, propsData) {
      const componentCreator = Vue.extend({
        vuetify: new Vuetify,
        router: this.$router,
        ...component
      })

      return new componentCreator({ propsData }).$mount().$el
    },
    openPopup(event) {
      event.preventDefault()
      const container = document.querySelector('[data-app=true]') || document.body

      container.appendChild(this.createComponent(MaterialBlockPopup, { blockId: +event.target.dataset.blockId }))
    }
  }
}
</script>

<style lang="scss">
.wiki-section {
  color: rgba(0, 0, 0, .87);
  margin: 30px 0;

  &__title {
    margin-bottom: 20px;

    a {
      text-decoration: none;
      border: none;
      position: relative;
      color: inherit;

      &:before {
        content: "#";
        font-weight: 400;
        opacity: .8;
        position: absolute;
        font-size: 28px;
        margin-left: -30px;
        color: var(--v-primary-base);
      }

      &:hover {
        color: inherit;
      }
    }
  }

  & + .wiki-section {
  }
}

.material-block-popup {
  .v-skeleton-loader__heading {
    margin: 25px 0;
  }
}
</style>
