import Vue from 'vue'

Vue.filter('truncate', (value, length) => {
  if (!value) return ''

  if (value.length <= length) {
    return value
  }

  return `${value.toString().substring(0, length)}...`
})
