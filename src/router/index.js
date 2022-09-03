import Vue from 'vue'
import Router from 'vue-router'

import PagesRoutes from './pages.routes'

import store from '../store'

Vue.use(Router)

export const routes = [
  ...PagesRoutes,
  {
    path: '*',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '@/pages/error/NotFoundPage.vue'),
    meta: {
      layout: 'error'
    }
  }]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes
})

/**
 * Before each route update
 */
router.beforeEach(async (to, from, next) => {

  if (!to.meta?.middleware) {
    return next()
  }

  const { middleware } = to.meta

  const context = {
    to,
    from,
    next,
    store
  }

  return await middleware({
    ...context
  })
})

/**
 * After each route update
 */
router.afterEach((to, from) => {
})

export default router
