const {
  getByClassAndUserAgent: studentGetByClassAndUserAgent,
} = require('../src/services/classes/student/getByClassAndUserAgent');
const { classByIds } = require('../src/services/classes/classByIds');
const { getByClass } = require('../src/services/classes/student/getByClass');
const { getBasicClassesByProgram, addClass } = require('../src/services/classes');

module.exports = {
  getBasicClassesByProgram,
  student: {
    getByClassAndUserAgent: studentGetByClassAndUserAgent,
    getByClass,
  },
  classByIds,
  addClass,
};
