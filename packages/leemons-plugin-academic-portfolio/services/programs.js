const { addProgram } = require('../src/services/programs');
const {
  programsByIds,
  getUserPrograms,
  isUserInsideProgram,
  getProgramEvaluationSystem,
} = require('../src/services/programs');

module.exports = {
  addProgram,
  programsByIds,
  getUserPrograms,
  isUserInsideProgram,
  getProgramEvaluationSystem,
};
