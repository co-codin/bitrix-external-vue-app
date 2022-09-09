import r2d2Auth from '../middleware/r2d2-auth'

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
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/DashboardPage'),
    meta: {
      middleware: r2d2Auth
    }
  },

  // Wiki
  {
    path: '/wiki',
    name: 'wiki.index',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/wiki/WikiIndex'),
    meta: {
      layout: 'academy',
      middleware: r2d2Auth
    }
  }, {
    path: '/wiki/materials/:id',
    name: 'wiki.materials.show',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/wiki/MaterialPage'),
    meta: {
      layout: 'academy',
      middleware: r2d2Auth
    }
  }, {
    path: '/wiki/exams/:id',
    name: 'wiki.exams.show',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/wiki/ExamPage'),
    meta: {
      middleware: r2d2Auth
    }
  },  {
    path: '/wiki/exams/:id/results',
    name: 'wiki.exams.results',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/wiki/ExamResultsPage'),
    meta: {
      middleware: r2d2Auth
    }
  }, {
    path: '/wiki/tags/:id',
    name: 'wiki.tags.show',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/wiki/TagPage'),
    meta: {
      layout: 'academy',
      middleware: r2d2Auth
    }
  }, {
    path: '/wiki/exam-sent',
    name: 'wiki.exam-sent',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/wiki/ExamSentPage')
  },

  // External app routes
  {
    path: '/external',
    name: 'external-app.home',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/external/AppHomePage.vue'),
    meta: {
      layout: 'externalApp'
    }
  }, {
    path: '/install-apps',
    name: 'install-apps',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/external/InstallApps.vue'),
    meta: {
      layout: 'externalApp'
    }
  }, {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/external/SettingsPage.vue'),
    meta: {
      layout: 'externalApp'
    }
  }, {
    path: '/tasks/create-supplier-tasks',
    name: 'tasks.create-supplier-tasks',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/external/tasks/CreateSupplierTasks.vue'),
    meta: {
      layout: 'externalApp'
    }
  }, {
    path: '/tasks/documents',
    name: 'tasks.documents',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/external/tasks/TaskDocuments.vue'),
    meta: {
      layout: 'externalApp'
    }
  }, {
    path: '/tasks/create-base-supplier-task',
    name: 'tasks.create-base-supplier-task',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/external/tasks/CreateBaseSupplierTask.vue'),
    meta: {
      layout: 'externalApp'
    }
  }, {
    path: '/tasks/change-task-status',
    name: 'tasks.change-task-status',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/external/tasks/ChangeTaskStatus.vue'),
    meta: {
      layout: 'externalApp'
    }
  }, {
    path: '/users/profile-qr-code',
    name: 'users.profile-qr-code',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/external/users/UserProfileQRCode.vue'),
    meta: {
      layout: 'externalApp'
    }
  }, {
    path: '/deals/reports',
    name: 'deals.reports',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/external/deals/reports/DealReports.vue'),
    meta: {
      layout: 'externalApp'
    }
  }, {
    path: '/deals/reports/deal-count',
    name: 'deals.reports.deal-count',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/external/deals/reports/DealCount.vue'),
    meta: {
      layout: 'externalApp'
    }
  }, {
    path: '/deals/reports/filling-statistics/by-manager',
    name: 'deals.reports.filling-statistics-by-manager',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/external/deals/reports/FillingStatisticsBySpecificManager.vue'),
    meta: {
      layout: 'externalApp'
    }
  }, {
    path: '/deals/reports/filling-statistics/by-managers',
    name: 'deals.reports.filling-statistics-by-managers',
    component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/external/deals/reports/FillingStatisticsByManagers.vue'),
    meta: {
      layout: 'externalApp'
    }
  }
]
