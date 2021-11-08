const { programsByCenters } = require('./programsByCenters');
const { programsByIds } = require('./programsByIds');
const { listPrograms } = require('./listPrograms');
const { addProgram } = require('./addProgram');

module.exports = {
  addProgram,
  listPrograms,
  programsByIds,
  programsByCenters,
};
