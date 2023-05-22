const {
  addProgram,
  listPrograms,
  programsByIds,
  getUserPrograms,
  getProgramCenters,
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
  getProgramCenters,
  programsByCenters,
  getUsersInProgram,
  isUserInsideProgram,
  getProgramEvaluationSystem,
};
