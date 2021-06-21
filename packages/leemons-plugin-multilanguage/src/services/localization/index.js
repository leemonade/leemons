const LocalizationHas = require('./has');
const LocalizationSet = require('./update');
const LocalizationGet = require('./read');
const LocalizationAdd = require('./create');
const LocalizationDelete = require('./delete');

const createMixin = require('../../helpers/createMixin');
const MultilanguageBase = require('../../helpers/MultilanguageBase');

// Uses mixins to create a unique class extending all the others
const LocalizationProvider = createMixin([
  MultilanguageBase,
  LocalizationHas,
  LocalizationAdd,
  LocalizationGet,
  LocalizationSet,
  LocalizationDelete,
]);

module.exports = LocalizationProvider;
