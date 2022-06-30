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
    disabled: booleanSchema,
    label: localeObjectSchema(),
    description: localeObjectSchema(),
  },
  required: ['menuKey', 'key', 'pluginName', 'label'],
  additionalProperties: false,
});

const updateMenuItemSchema = () => ({
  type: 'object',
  properties: addMenuItemSchema().properties,
  required: ['menuKey', 'key', 'pluginName'],
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
    disabled: booleanSchema,
    label: stringSchema,
    description: stringSchema,
  },
  required: ['menuKey', 'key', 'parentKey', 'pluginName', 'label', 'url'],
  additionalProperties: false,
});

const removeMenuItemFromUserSchema = () => ({
  type: 'object',
  properties: {
    menuKey: stringSchema,
    key: stringSchema,
  },
  required: ['menuKey', 'key'],
  additionalProperties: false,
});

const updateMenuItemFromUserSchema = () => ({
  type: 'object',
  properties: {
    menuKey: stringSchema,
    key: stringSchema,
    label: stringSchema,
  },
  required: ['menuKey', 'key', 'label'],
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

function validateUpdateMenuItem(data) {
  const validator = new LeemonsValidator(updateMenuItemSchema());

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

function validateRemoveMenuItemFromUser(data) {
  const validator = new LeemonsValidator(removeMenuItemFromUserSchema());

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

function validateUpdateMenuItemFromUser(data) {
  const validator = new LeemonsValidator(updateMenuItemFromUserSchema());

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
  validateRemoveMenuItemFromUser,
  validateUpdateMenuItemFromUser,
  validateReOrder,
  validateUpdateMenuItem,
};
