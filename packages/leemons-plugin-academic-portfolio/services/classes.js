const {
  getByClassAndUserAgent: studentGetByClassAndUserAgent,
} = require('../src/services/classes/student/getByClassAndUserAgent');
const { getBasicClassesByProgram, addClass } = require('../src/services/classes');

module.exports = {
  getBasicClassesByProgram,
  student: {
    getByClassAndUserAgent: studentGetByClassAndUserAgent,
  },
  addClass,
};
