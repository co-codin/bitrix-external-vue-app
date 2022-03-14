export default [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/HomePage.vue'),
    meta: {
      layout: 'simple'
    }
  },{
    path: '/install-apps',
    name: 'install-apps',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/InstallApps.vue'),
    meta: {
      layout: 'simple'
    }
  },{
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/SettingsPage.vue'),
    meta: {
      layout: 'simple'
    }
  }, {
    path: '/tasks/create-supplier-tasks',
    name: 'tasks.create-supplier-tasks',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/tasks/CreateSupplierTasks.vue'),
    meta: {
      layout: 'simple'
    }
  }, {
    path: '/tasks/documents',
    name: 'tasks.documents',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/tasks/TaskDocuments.vue'),
    meta: {
      layout: 'simple'
    }
  }, {
    path: '/tasks/create-base-supplier-task',
    name: 'tasks.create-base-supplier-task',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/tasks/CreateBaseSupplierTask.vue'),
    meta: {
      layout: 'simple'
    }
  }, {
    path: '/tasks/change-task-status',
    name: 'tasks.change-task-status',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/tasks/ChangeTaskStatus.vue'),
    meta: {
      layout: 'simple'
    }
  }, {
    path: '/users/profile-qr-code',
    name: 'users.profile-qr-code',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/users/UserProfileQRCode.vue'),
    meta: {
      layout: 'simple'
    }
  }, {
    path: '/deals/filling-statistics',
    name: 'deals.filling-statistics',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/deals/FillingStatistics.vue'),
    meta: {
      layout: 'simple'
    }
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
    }]
