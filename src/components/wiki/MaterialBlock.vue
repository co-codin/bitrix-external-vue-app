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
  </div>
</template>

<script>
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import AlertBlock from '@/components/wiki/content/AlertBlock'
import MaterialBlockLink from '@/components/wiki/content/MaterialBlockLink'
import MaterialBlockPopup from '@/components/wiki/content/MaterialBlockPopup'

export default {
  name: 'MaterialBlock',
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
    }
  },
  mounted() {
    this.replaceAlertBlocks()
    // this.replaceMaterialBlockLinks()
    this.enableMaterialBlockLinks()
  },
  methods: {
    copyLink(id) {
      this.$clipboard(`${window.location.origin}${window.location.pathname}#block-${id}`, 'Ссылка скопирована')
    },
    replaceAlertBlocks() {
      this.$refs.body.querySelectorAll('p[data-alert="1"]').forEach((element) => {
        const type = element.dataset.alertType
        const message = element.innerText

        element.replaceWith(this.createComponent(AlertBlock, { type, message }))
      })
    },
    replaceMaterialBlockLinks() {
      this.$refs.body.querySelectorAll('a[data-block-link="1"]').forEach((element) => {
        if (element.dataset.loadInPopup !== '1') {
          return
        }

        const { blockId } = element.dataset
        const text = element.innerText

        element.replaceWith(this.createComponent(MaterialBlockLink, { blockId: +blockId, text }))
      })
    },
    enableMaterialBlockLinks() {
      this.$refs.body.querySelectorAll('a[data-block-link="1"]').forEach((element) => {
        if (element.dataset.loadInPopup !== '1') {
          return
        }

        const { blockId } = element.dataset

        element.addEventListener('click', this.openPopup)
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
