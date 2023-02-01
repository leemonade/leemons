const {
  addProgram,
  listPrograms,
  programsByIds,
  getUserPrograms,
  getUsersInProgram,
  isUserInsideProgram,
  getProgramEvaluationSystem,
  programsByCenters,
} = require('../src/services/programs');

module.exports = {
  addProgram,
  listPrograms,
  programsByIds,
  getUserPrograms,
  programsByCenters,
  getUsersInProgram,
  isUserInsideProgram,
  getProgramEvaluationSystem,
};
