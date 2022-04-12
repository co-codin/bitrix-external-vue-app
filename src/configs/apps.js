export default [
  {
    name: 'Вкладка "Документы" в задачах',
    buttonLabel: 'Документы',
    description: 'Загрузка документов к задачам',
    placement: 'TASK_VIEW_TAB',
    handler: '/tasks/documents'
  },
  {
    name: 'Создание подзадач закупщиком',
    buttonLabel: 'Постпродажный процесс',
    description: 'Создание подзадач закупщиком к базовой задаче',
    placement: 'TASK_LIST_CONTEXT_MENU',
    handler: '/tasks/create-supplier-tasks'
  },
  {
    name: 'Запуск постпродажного процесса',
    buttonLabel: 'Запустить постпродажный процесс',
    description: 'Создание базовой задачи на закупщика',
    placement: 'CRM_DEAL_LIST_MENU',
    handler: '/tasks/create-base-supplier-task'
  },
  {
    name: 'Изменение статуса задачи',
    buttonLabel: 'Изменить статус',
    description: 'Изменение статуса задачи',
    placement: 'TASK_LIST_CONTEXT_MENU',
    handler: '/tasks/change-task-status'
  },
  {
    name: 'Получение QR кода пользователя',
    buttonLabel: 'Получить QR код',
    description: 'Получение QR кода пользователя',
    placement: 'USER_PROFILE_TOOLBAR',
    handler: '/users/profile-qr-code'
  },
  {
    name: 'Статистика заполнения сделок',
    buttonLabel: 'Заполнение сделок',
    description: 'Статистика заполнения сделок',
    placement: 'CRM_DEAL_LIST_TOOLBAR',
    handler: '/deals/filling-statistics'
  },
  {
    name: 'Отчеты по сделкам',
    buttonLabel: 'Отчеты по сделкам',
    description: 'Отчеты по сделкам',
    placement: 'CRM_DEAL_LIST_TOOLBAR',
    handler: '/deals/reports'
  }
]
