const createMixin = require('../../helpers/createMixin');

const LocalizationHas = require('./has');
const LocalizationSet = require('./update');
const LocalizationGet = require('./read');
const LocalizationCount = require('./count');
const LocalizationAdd = require('./create');
const LocalizationDelete = require('./delete');

const MultilanguageBase = require('../../helpers/MultilanguageBase');

const Validator = require('../../validations/localization');

class Base extends MultilanguageBase {
  constructor(props) {
    const { model } = props;

    super(props);

    this.model = model;

    this.validator = new Validator(this.caller);
  }
}

// Uses mixins to create a unique class extending all the others
const LocalizationProvider = createMixin([
  Base,
  // Must be the first, because the following ones inherit from its methods
  LocalizationHas,
  // Adds the hasLocale and hasLocales, so the following ones needs to inherit from it
  LocalizationAdd,
  LocalizationGet,
  LocalizationCount,
  LocalizationSet,
  LocalizationDelete,
]);

module.exports = LocalizationProvider;
