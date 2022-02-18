<template>
  <div class="pa-2">
    <slot></slot>
  </div>
</template>

<script>
export default {
  mounted() {
    const script = document.createElement('script')

    script.setAttribute('src', 'https://api.bitrix24.com/api/v1/')
    document.head.appendChild(script)

    // script.addEventListener('load', () => {
    //   window.BX24?.init()
    // })
  }
}
</script>
