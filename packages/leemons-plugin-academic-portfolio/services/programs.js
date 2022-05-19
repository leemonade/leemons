const { addProgram } = require('../src/services/programs');
const {
  getUserPrograms,
  isUserInsideProgram,
  getProgramEvaluationSystem,
} = require('../src/services/programs');

module.exports = {
  addProgram,
  getUserPrograms,
  isUserInsideProgram,
  getProgramEvaluationSystem,
};
