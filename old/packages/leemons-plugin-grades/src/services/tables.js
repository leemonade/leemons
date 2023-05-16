const table = {
  rules: leemons.query('plugins_grades::rules'),
  grades: leemons.query('plugins_grades::grades'),
  gradeTags: leemons.query('plugins_grades::grade-tags'),
  conditions: leemons.query('plugins_grades::conditions'),
  gradeScales: leemons.query('plugins_grades::grade-scales'),
  conditionGroups: leemons.query('plugins_grades::condition-groups'),
  settings: leemons.query('plugins_grades::settings'),
};

module.exports = { table };
