module.exports = {
  tasks: leemons.query('plugins_tasks::tasks'),
  tasksVersioning: leemons.query('plugins_tasks::tasksVersioning'),
  tags: leemons.query('plugins_tasks::tags'),
  attachments: leemons.query('plugins_tasks::attachments'),
};
