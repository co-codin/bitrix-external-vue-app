import Vue from 'vue'
import Vuex from 'vuex'

// Global vuex
import AppModule from './app'
import UserModule from './user'

Vue.use(Vuex)

/**
 * Main Vuex Store
 */
const store = new Vuex.Store({
  modules: {
    app: AppModule,
    user: UserModule
  }
})

export default store
