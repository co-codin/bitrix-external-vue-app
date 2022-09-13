import Vue from 'vue'

Vue.filter('truncate', (value, length) => {
  if (!value) return ''

  return value.toString().substr(0, length)
})
