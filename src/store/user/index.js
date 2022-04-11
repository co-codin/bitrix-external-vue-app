import BX24Wrapper from '@/utils/bx24-wrapper'

export default {
  namespaced: true,
  state: {
    user: {},
    isAdmin: false
  },
  getters: {
    user: (state) => state.user,
    isAdmin: (state) => state.isAdmin
  },
  mutations: {
    SET_USER: (state, user) => state.user = { ...user },
    SET_IS_ADMIN: (state, isAdmin) => state.isAdmin = isAdmin
  },
  actions: {
    async loadCurrentUserData({ commit }) {
      const user = await new BX24Wrapper().callMethod('user.current')

      commit('SET_USER', user)
    },
    async loadCurrentUserAdminStatus({ commit }) {
      const isAdmin = await new BX24Wrapper().callMethod('user.admin')

      commit('SET_IS_ADMIN', isAdmin)
    }
  }
}
