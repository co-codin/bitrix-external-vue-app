<template>
  <div :id="`block-${block.id}`" class="wiki-section mt-5">
    <slot name="title" :block="block" :copy-link="copyLink">
      <h2 class="wiki-section__title" :class="hClass">
        <a :href="`#block-${block.id}`" @click.prevent="copyLink(block.id)">
          {{ block.name }}
        </a>
      </h2>
    </slot>
    <slot name="subtitle" :block="block"></slot>
    <slot>
      <div class="wiki-section__content topic" v-html="block.body"></div>
    </slot>
  </div>
</template>

<script>
export default {
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
  data() {
    return {
    }
  },
  computed: {
    hClass() {
      const h = this.depth + 3

      return `text-h${h}`
    }
  },
  methods: {
    copyLink(id) {
      this.$clipboard(`${window.location.origin}${window.location.pathname}#block-${id}`, 'Ссылка скопирована')
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
</style>
