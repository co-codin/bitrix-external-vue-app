<template>
  <div class="pa-2">
    <slot></slot>
  </div>
</template>

<script>
export default {
  async mounted() {
    const script = await document.createElement('script')

    await script.setAttribute('src', 'https://api.bitrix24.com/api/v1/')
    await document.head.appendChild(script)

    // script.addEventListener('load', () => {
    //   window.BX24?.init()
    // })
  }
}
</script>
