import Vue from 'vue'
import BX24Wrapper from '@/utils/bx24-wrapper'

Vue.prototype.$bxwrapper = function () {
  return new BX24Wrapper()
}
