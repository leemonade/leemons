const { getSubjects } = require('./getSubjects');
const { removeSubjects } = require('./removeSubjects');
const { saveSubjects } = require('./saveSubjects');
const { searchByProgram } = require('./searchByProgram');
const { searchBySubject } = require('./searchBySubject');
const { updateSubjects } = require('./updateSubjects');

module.exports = {
  getSubjects,
  removeSubjects,
  saveSubjects,
  searchByProgram,
  searchBySubject,
  updateSubjects,
};
