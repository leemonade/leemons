const { addProgram } = require('../src/services/programs');
const { getUserPrograms, isUserInsideProgram } = require('../src/services/programs');

module.exports = {
  addProgram,
  getUserPrograms,
  isUserInsideProgram,
};
