<template>
  <div class="wiki-section mt-4">
    <h2 class="wiki-section__title" :class="hClass">
      <a href="#terms">
        <slot name="name" :title="block.name">
          {{ block.name }}
        </slot>
      </a>
    </h2>
    <div class="wiki-section__content topic" v-html="block.body"></div>
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
      required: true
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
  }
}
</script>

<style lang="scss">
.wiki-section {
  color: rgba(0, 0, 0, .87);
  margin: 30px 0;

  &__title {
    margin-bottom: 30px;

    a {
      text-decoration: none;
      border: none;

      &:hover {
        color: #572fcf;
      }
    }
  }
}
</style>
