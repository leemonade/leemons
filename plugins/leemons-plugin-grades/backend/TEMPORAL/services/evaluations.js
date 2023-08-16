const service = require('../src/services/grades');

module.exports = {
  add: service.addGrade,
  byIds: service.gradeByIds,
};
