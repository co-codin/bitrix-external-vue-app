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
    name: 'Создание базовой задачи на закупщика',
    buttonLabel: 'Создать задачу на закупщика',
    description: 'Создание базовой задачи',
    placement: 'TASK_LIST_CONTEXT_MENU',
    handler: '/tasks/create-base-supplier-task'
  },
  {
    name: 'Изменение статуса задачи',
    buttonLabel: 'Изменить статус',
    description: 'Изменение статуса задачи',
    placement: 'TASK_LIST_CONTEXT_MENU',
    handler: '/tasks/change-task-status'
  }
]
