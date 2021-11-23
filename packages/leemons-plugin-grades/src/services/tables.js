const table = {
  grades: leemons.query('plugins_grades::grades'),
  gradeTags: leemons.query('plugins_grades::grade-tags'),
  gradeScales: leemons.query('plugins_grades::grade-scales'),
};

module.exports = { table };
