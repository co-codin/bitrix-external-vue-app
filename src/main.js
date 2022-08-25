import Vue from 'vue'
import App from './App.vue'
import TitleMixin from '@/mixins/title'

// VUEX - https://vuex.vuejs.org/
import store from './store'

// VUE-ROUTER - https://router.vuejs.org/
import router from './router'

// PLUGINS
import vuetify from './plugins/vuetify'
import i18n from './plugins/vue-i18n'
import './plugins/vue-google-maps'
import './plugins/vue-shortkey'
import './plugins/vue-head'
import './plugins/vue-gtag'
import './plugins/apexcharts'
import './plugins/echarts'
import './plugins/animate'
import './plugins/clipboard'
import './plugins/moment'
import './plugins/confirm'
import './plugins/snackbar'
import './plugins/dayjs'
import './plugins/declension'
import './plugins/services/bx24'

// Global components
import SvgIcon from '@/components/global/SvgIcon'

// FILTERS
import './filters/capitalize'
import './filters/lowercase'
import './filters/uppercase'
import './filters/formatCurrency'
import './filters/formatDate'

// STYLES
// Main Theme SCSS
import './assets/scss/theme.scss'

// Animation library - https://animate.style/
import 'animate.css/animate.min.css'

// Configs
import config from './configs'

import r2d2Api from '@/services/r2d2-api'

import { Model } from 'vue-api-query'

Model.$http = r2d2Api

Vue.prototype.$r2d2 = r2d2Api

// Set this to the false to prevent the production tip on Vue startup.
Vue.config.productionTip = false

Vue.component('svg-icon', SvgIcon)

Vue.prototype.$config = config

Vue.mixin(TitleMixin)

/*
|---------------------------------------------------------------------
| Main Vue Instance
|---------------------------------------------------------------------
|
| Render the vue application on the <div id="app"></div> in index.html
|
| https://vuejs.org/v2/guide/instance.html
|
*/
export default new Vue({
  i18n,
  vuetify,
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
