export default [
  // Error pages
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
  },

  // Main pages
  {
    path: '/',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/DashboardPage')
  },

  // Wiki
  {
    path: '/wiki/exam',
    name: 'wiki.exam',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/wiki/ExamPage')
  }, {
    path: '/wiki',
    name: 'wiki.index',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/wiki/WikiIndex'),
    meta: {
      layout: 'academy'
    }
  }, {
    path: '/wiki/materials/:id',
    name: 'wiki.materials.show',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/wiki/MaterialPage'),
    meta: {
      layout: 'academy'
    }
  }, {
    path: '/wiki/exams/:id',
    name: 'wiki.exams.show',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/wiki/ExamPage'),
    meta: {
      layout: 'simple'
    }
  },

  // External app routes
  {
    path: '/external',
    name: 'external-app.home',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/ExternalHomePage.vue')
  }, {
    path: '/install-apps',
    name: 'install-apps',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/InstallApps.vue')
  }, {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/SettingsPage.vue')
  }, {
    path: '/tasks/create-supplier-tasks',
    name: 'tasks.create-supplier-tasks',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/tasks/CreateSupplierTasks.vue')
  }, {
    path: '/tasks/documents',
    name: 'tasks.documents',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/tasks/TaskDocuments.vue')
  }, {
    path: '/tasks/create-base-supplier-task',
    name: 'tasks.create-base-supplier-task',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/tasks/CreateBaseSupplierTask.vue')
  }, {
    path: '/tasks/change-task-status',
    name: 'tasks.change-task-status',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/tasks/ChangeTaskStatus.vue')
  }, {
    path: '/users/profile-qr-code',
    name: 'users.profile-qr-code',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/users/UserProfileQRCode.vue')
  }, {
    path: '/deals/reports',
    name: 'deals.reports',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/deals/reports/DealReports.vue')
  }, {
    path: '/deals/reports/deal-count',
    name: 'deals.reports.deal-count',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/deals/reports/DealCount.vue')
  }, {
    path: '/deals/reports/filling-statistics/by-manager',
    name: 'deals.reports.filling-statistics-by-manager',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/deals/reports/FillingStatisticsBySpecificManager.vue')
  }, {
    path: '/deals/reports/filling-statistics/by-managers',
    name: 'deals.reports.filling-statistics-by-managers',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/deals/reports/FillingStatisticsByManagers.vue')
  }
]
