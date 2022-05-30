import BX24Wrapper from '@/utils/bx24-wrapper'

export default {
  namespaced: true,
  state: {
    user: {},
    isAdmin: false,
    admins: {
      fillingStatistics: [ // filling statistics module
        29, // Соловьев
        654, // Пальчун
        537, // Моисеева
        366 // Балаян
      ],
      dealCount: [
        29, // Соловьев
        654, // Пальчун
        537, // Моисеева
        629 // Балаян
      ]
    }
  },
  getters: {
    user: (state) => state.user,
    isAdmin: (state) => (module = null) => state.isAdmin || (module && (state.admins[module]?.includes(+state.user.ID) || false))
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
