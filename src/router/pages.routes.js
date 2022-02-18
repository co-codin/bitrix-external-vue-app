export default [
  {
    path: '/install-apps',
    name: 'install-apps',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/InstallApps.vue'),
    meta: {
      layout: 'simple'
    }
  }, {
    path: '/tasks/create-supplier-tasks',
    name: 'tasks.create-supplier-tasks',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/tasks/CreateSupplierTasks.vue')
  },
  {
    path: '/error/not-found',
    name: 'error-not-found',
    component: () => import(/* webpackChunkName: "error-not-found" */ '@/pages/error/NotFoundPage.vue'),
    meta: {
      layout: 'error'
    }
  }, {
    path: '/error/unexpected',
    name: 'error-unexpected',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/error/UnexpectedPage.vue'),
    meta: {
      layout: 'error'
    }
  }]
