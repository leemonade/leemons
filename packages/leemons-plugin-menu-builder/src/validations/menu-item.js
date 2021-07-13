const { LeemonsValidator } = global.utils;
const { stringSchema, numberSchema, booleanSchema, localeObjectSchema } = require('./types');

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
    activeIconName: stringSchema,
    iconSvg: stringSchema,
    activeIconSvg: stringSchema,
    iconAlt: stringSchema,
    url: stringSchema,
    window: stringSchema,
    label: localeObjectSchema(),
    description: localeObjectSchema(),
  },
  required: ['menuKey', 'key', 'pluginName', 'label'],
  additionalProperties: false,
});

const addMenuItemFromUserSchema = () => ({
  type: 'object',
  properties: {
    menuKey: stringSchema,
    key: stringSchema,
    parentKey: stringSchema,
    pluginName: stringSchema,
    order: numberSchema,
    fixed: booleanSchema,
    iconName: stringSchema,
    activeIconName: stringSchema,
    iconSvg: stringSchema,
    activeIconSvg: stringSchema,
    iconAlt: stringSchema,
    url: stringSchema,
    window: stringSchema,
    label: stringSchema,
    description: stringSchema,
  },
  required: ['menuKey', 'key', 'parentKey', 'pluginName', 'label', 'url'],
  additionalProperties: false,
});

const reOrderSchema = () => ({
  type: 'object',
  properties: {
    menuKey: stringSchema,
    parentKey: stringSchema,
    orderedIds: {
      type: 'array',
      items: stringSchema,
    },
  },
  required: ['menuKey', 'orderedIds', 'parentKey'],
  additionalProperties: false,
});

function validateAddMenuItem(data) {
  const validator = new LeemonsValidator(addMenuItemSchema());

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

function validateAddMenuItemFromUser(data) {
  const validator = new LeemonsValidator(addMenuItemFromUserSchema());

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

function validateReOrder(data) {
  const validator = new LeemonsValidator(reOrderSchema());

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddMenuItem,
  validateAddMenuItemFromUser,
  validateReOrder,
};
