import Vue from 'vue'
import Router from 'vue-router'

import PagesRoutes from './pages.routes'

Vue.use(Router)

export const routes = [
  ...PagesRoutes,
  {
    path: '/blank',
    name: 'blank',
    component: () => import(/* webpackChunkName: "blank" */ '@/pages/BlankPage.vue')
  },
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
  base: '/vue-app',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes
})

/**
 * Before each route update
 */
router.beforeEach((to, from, next) => {
  return next()
})

/**
 * After each route update
 */
router.afterEach((to, from) => {
})

export default router
