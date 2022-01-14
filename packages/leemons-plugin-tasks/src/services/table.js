module.exports = {
  tasks: leemons.query('plugins_tasks::tasks'),
  tags: leemons.query('plugins_tasks::tags'),
  attachments: leemons.query('plugins_tasks::attachments'),
};
