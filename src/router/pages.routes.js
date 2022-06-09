export default [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/HomePage.vue'),
    meta: {
      layout: 'simple'
    }
  }, {
    path: '/install-apps',
    name: 'install-apps',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/InstallApps.vue'),
    meta: {
      layout: 'simple'
    }
  }, {
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
    path: '/wiki/materials',
    name: 'wiki.materials',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/wiki/MaterialListPage'),
    meta: {
      layout: 'simple'
    }
  }, {
    path: '/wiki/exam',
    name: 'wiki.exam',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/wiki/ExamPage'),
    meta: {
      layout: 'simple'
    }
  }, {
    path: '/wiki',
    name: 'wiki.dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/wiki/WikiDashboardPage'),
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
    path: '/deals/reports',
    name: 'deals.reports',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/deals/reports/DealReports.vue'),
    meta: {
      layout: 'simple'
    }
  }, {
    path: '/deals/reports/deal-count',
    name: 'deals.reports.deal-count',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/deals/reports/DealCount.vue'),
    meta: {
      layout: 'simple'
    }
  }, {
    path: '/deals/reports/filling-statistics/by-manager',
    name: 'deals.reports.filling-statistics-by-manager',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/deals/reports/FillingStatisticsBySpecificManager.vue'),
    meta: {
      layout: 'simple'
    }
  }, {
    path: '/deals/reports/filling-statistics/by-managers',
    name: 'deals.reports.filling-statistics-by-managers',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/deals/reports/FillingStatisticsByManagers.vue'),
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
    }
  }]
