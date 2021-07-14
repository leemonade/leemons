const { LeemonsValidator } = global.utils;
const {
  stringSchema,
  numberSchema,
  booleanSchema,
  textSchema,
  localeObjectSchema,
} = require('./types');

const addMenuItemSchema = () => ({
  type: 'object',
  properties: {
    menuKey: stringSchema,
    key: stringSchema,
    parentKey: stringSchema,
    pluginName: stringSchema,
    order: numberSchema,
    fixed: booleanSchema,
    iconName: stringSchema,
    iconSvg: textSchema,
    url: stringSchema,
    window: stringSchema,
    label: localeObjectSchema(),
    description: localeObjectSchema(),
  },
  required: ['menuKey', 'key', 'pluginName', 'label'],
});

function validateAddMenuItem(data) {
  const validator = new LeemonsValidator(addMenuItemSchema());

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddMenuItem,
};
