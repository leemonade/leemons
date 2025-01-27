const { LeemonsError } = require('@leemons/error');
const { LeemonsValidator } = require('@leemons/validator');
const { isEqual, endsWith } = require('lodash');

const {
  stringSchema,
  booleanSchemaNullable,
  stringSchemaNullable,
  dateSchema,
  dateSchemaNullable,
} = require('./types');

const saveConfigSchema = {
  type: 'object',
  properties: {
    program: stringSchema,
    regionalConfig: stringSchemaNullable,
    allCoursesHaveSameConfig: booleanSchemaNullable,
    allCoursesHaveSameDates: booleanSchemaNullable,
    courseDates: {
      type: 'object',
      additionalProperties: true,
    },
    substagesDates: {
      type: 'object',
      additionalProperties: true,
    },
    courseEvents: {
      type: 'object',
      additionalProperties: true,
    },
    allCoursesHaveSameDays: booleanSchemaNullable,
    breaks: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: true,
      },
      nullable: true,
    },
  },
  required: ['program', 'courseDates'],
  additionalProperties: true,
};

function validateSaveConfig(data) {
  const validator = new LeemonsValidator(saveConfigSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const events = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: stringSchema,
      startDate: dateSchema,
      endDate: dateSchema,
    },
    required: ['name', 'startDate', 'endDate'],
  },
};

const saveRegionalConfigSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    center: stringSchema,
    regionalEventsRel: stringSchemaNullable,
    regionalEvents: events,
    localEvents: events,
    daysOffEvents: events,
  },
  required: ['name', 'center'],
  additionalProperties: false,
};

function validateSaveRegionalConfig(data) {
  const validator = new LeemonsValidator(saveRegionalConfigSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

// CUSTOM PERIODS ··················································

function validateItemType(item, type) {
  const modelSegment = item.split(':')[5];

  const normalizedType = type.toLowerCase();
  const normalizedSegment = modelSegment.toLowerCase();

  return (
    isEqual(normalizedSegment, normalizedType) || endsWith(normalizedSegment, `${normalizedType}s`)
  );
}

const setItemSchema = {
  type: 'object',
  properties: {
    item: stringSchema,
    startDate: dateSchemaNullable,
    endDate: dateSchemaNullable,
    type: stringSchema,
  },
  required: ['item', 'startDate', 'endDate', 'type'],
  additionalProperties: false,
};

function validateSetItem({ data, ctx }) {
  const validator = new LeemonsValidator(setItemSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  if (!validateItemType(data.item, data.type)) {
    throw new LeemonsError(ctx, {
      message: 'Type must match the corresponding segment of the LRN ID item.',
    });
  }
}

const assignCustomPeriodToItemsSchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          item: stringSchema,
          type: stringSchema,
        },
        required: ['item', 'type'],
      },
    },
    dates: {
      type: 'object',
      properties: {
        startDate: dateSchema,
        endDate: dateSchema,
      },
      required: ['startDate', 'endDate'],
    },
  },
  required: ['items', 'dates'],
  additionalProperties: true,
};

function validateAssignCustomPeriodToItems({ data, ctx }) {
  const validator = new LeemonsValidator(assignCustomPeriodToItemsSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const allValid = data.items.every(({ item, type }) => {
    return validateItemType(item, type);
  });

  if (!allValid) {
    throw new LeemonsError(ctx, {
      message: 'Type must match the corresponding segment of the LRN ID item for all items',
    });
  }
}

const createCustomPeriodSchema = {
  type: 'object',
  properties: {
    item: stringSchema,
    startDate: dateSchema,
    endDate: dateSchema,
    type: stringSchema,
  },
  required: ['item', 'startDate', 'endDate', 'type'],
  additionalProperties: false,
};

function validateCreateCustomPeriod(data) {
  const validator = new LeemonsValidator(createCustomPeriodSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const updateCustomPeriodSchema = {
  type: 'object',
  properties: {
    item: stringSchema,
    startDate: dateSchema,
    endDate: dateSchema,
  },
  required: ['item'],
  additionalProperties: true,
};

function validateUpdateCustomPeriod(data) {
  const validator = new LeemonsValidator(updateCustomPeriodSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateSaveConfig,
  validateSaveRegionalConfig,
  validateCreateCustomPeriod,
  validateUpdateCustomPeriod,
  validateAssignCustomPeriodToItems,
  validateSetItem,
};
