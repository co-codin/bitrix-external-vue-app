import Vue from 'vue'
import BX24Wrapper from '@/utils/bx24-wrapper'

Vue.prototype.$bx24 = new BX24Wrapper()
