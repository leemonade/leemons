const { get } = require('./get');
const { save } = require('./save');
const { getCenter } = require('./getCenter');
const { saveCenter } = require('./saveCenter');
const { getGeneral } = require('./getGeneral');
const { saveGeneral } = require('./saveGeneral');
const { getProgram } = require('./getProgram');
const { saveProgram } = require('./saveProgram');
const { getFullByCenter } = require('./getFullByCenter');
const { saveFullByCenter } = require('./saveFullByCenter');

module.exports = {
  get,
  save,
  getCenter,
  saveCenter,
  getGeneral,
  saveGeneral,
  getProgram,
  saveProgram,
  getFullByCenter,
  saveFullByCenter,
};
