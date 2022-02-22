module.exports = {
  tasks: leemons.query('plugins_tasks::tasks'),
  tasksVersioning: leemons.query('plugins_tasks::tasksVersioning'),
  tasksVersions: leemons.query('plugins_tasks::tasksVersions'),
  tags: leemons.query('plugins_tasks::tags'),
  attachments: leemons.query('plugins_tasks::attachments'),
  instances: leemons.query('plugins_tasks::instances'),
  teacherInstances: leemons.query('plugins_tasks::teacherInstances'),
  userInstances: leemons.query('plugins_tasks::userInstances'),
  userDeliverables: leemons.query('plugins_tasks::userDeliverables'),
  settings: leemons.query('plugins_tasks::settings'),
  profiles: leemons.query('plugins_tasks::profiles'),
};
