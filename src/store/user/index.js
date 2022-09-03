import BX24Wrapper from '@/utils/bx24-wrapper'

export default {
  namespaced: true,
  state: {
    user: {},
    r2d2Token: null,
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
        629 // Титова (Богданова)
      ]
    }
  },
  getters: {
    user: (state) => state.user,
    r2d2Token: (state) => state.r2d2Token,
    isAdmin: (state) => (module = null) => state.isAdmin || (module && (state.admins[module]?.includes(+state.user.ID) || false))
  },
  mutations: {
    SET_USER: (state, user) => state.user = { ...user },
    SET_IS_ADMIN: (state, isAdmin) => state.isAdmin = isAdmin,
    SET_R2D2_TOKEN: (state, token) => state.r2d2Token = token
  },
  actions: {
    async loadCurrentUserData({ commit }) {
      const user = await new BX24Wrapper().callMethod('user.current')

      commit('SET_USER', user)
    },
    async loadCurrentUserDataAction({ commit }) {
      const response = await BX.ajax.runAction('medeq:main.controller.actions.getUser')

      console.log(response)

      // commit('SET_USER', user)
    },
    async authInR2D2({ commit }) {
      if (process.env.NODE_ENV !== 'production') {
        commit('SET_R2D2_TOKEN', process.env.VUE_APP_R2D2_USER_TOKEN)

        return
      }

      try {
        const response = await BX.ajax.runAction('medeq:main.controller.Auth.getToken')

        console.log(response)
      }
      catch (e) {
        console.log(e)
      }
    },
    async loadCurrentUserAdminStatus({ commit }) {
      const isAdmin = await new BX24Wrapper().callMethod('user.admin')

      commit('SET_IS_ADMIN', isAdmin)
    }
  }
}
