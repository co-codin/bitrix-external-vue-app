<template>
  <div class="pa-2">
    <slot></slot>
  </div>
</template>

<script>
export default {
  mounted() {
    const recaptchaScript = document.createElement('script')

    recaptchaScript.setAttribute('src', 'https://api.bitrix24.com/api/v1/')
    document.head.appendChild(recaptchaScript)

    window.BX24.init(() => {
      const initDate = window.BX24.getAuth()

      console.log('initDate: ', initDate)
    })
  }
}
</script>
