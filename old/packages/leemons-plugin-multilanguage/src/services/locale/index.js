const LocaleAdd = require('./create');
const LocaleGet = require('./read');
const LocaleSet = require('./update');
const LocaleDelete = require('./delete');
const LocaleHas = require('./has');
const createMixin = require('../../helpers/createMixin');
const MultilanguageBase = require('../../helpers/MultilanguageBase');

class Base extends MultilanguageBase {
  constructor(props) {
    const { model } = props;

    super(props);

    this.model = model;
  }
}

const LocaleProvider = createMixin([
  Base,
  // LocaleHas must be the first one, because some other classes use its methods
  LocaleHas,
  LocaleAdd,
  LocaleGet,
  LocaleSet,
  LocaleDelete,
]);

module.exports = LocaleProvider;
