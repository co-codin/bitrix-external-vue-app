<template>
  <div class="pa-2">
    <slot v-if="loaded"></slot>
  </div>
</template>

<script>
export default {
  data: () => ({
    loaded: false
  }),
  async mounted() {
    const script = await document.createElement('script')

    await script.setAttribute('src', 'https://api.bitrix24.com/api/v1/')
    await document.head.appendChild(script)

    script.addEventListener('load', () => {
      BX24.init(() => this.loaded = true)
    })
  }
}
</script>
