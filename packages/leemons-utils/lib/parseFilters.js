const _ = require('lodash');

// List of all the possible filters
const VALID_REST_OPERATORS = [
  'eq',
  'ne',
  'in',
  'nin',
  'contains',
  'ncontains',
  'containss',
  'ncontainss',
  'startsWith',
  'nstartsWith',
  'endsWith',
  'nendsWith',
  'startssWith',
  'nstartssWith',
  'endssWith',
  'nendssWith',
  'lt',
  'lte',
  'gt',
  'gte',
  'null',
];

const BOOLEAN_OPERATORS = ['or'];
const QUERY_OPERATORS = ['_$where', '_$or'];

function parseSortFilter(sort) {
  if (typeof sort !== 'string') {
    throw new Error(`parseSortFilter expected a string, instead got ${typeof sort}`);
  }

  const sortInstructions = [];
  const keys = [];

  sort.split(',').forEach((instruction) => {
    const [field, order = 'asc'] = instruction.split(':').map((value) => value.trim());

    if (field.length === 0) {
      throw new Error('Field cannot be empty');
    }

    if (!['asc', 'desc'].includes(order.toLocaleLowerCase())) {
      throw new Error('order can only be one of asc|desc|ASC|DESC');
    }

    sortInstructions.push({ field, order: order.toLocaleLowerCase() });
    keys.push(field);
  });

  if ([...new Set(keys)].length < keys.length) {
    throw new Error('A provided ordering key is duplicated');
  }

  return {
    sort: sortInstructions,
  };
}

function parseOffsetFilter(offset) {
  const offsetValue = _.toNumber(offset);

  if (!_.isInteger(offsetValue) || offsetValue < 0) {
    throw new Error(`parseOffsetFilter expected a positive integer, instead got ${offsetValue}`);
  }

  return {
    offset: offsetValue,
  };
}

function parseLimitFilter(limit) {
  const limitValue = _.toNumber(limit);
  if (!_.isInteger(limitValue) || limitValue < 0) {
    throw new Error(`parseLimitFilter expected a positive integer, instead got ${limitValue}`);
  }

  return {
    limit: limitValue,
  };
}

function parseWhereClause(name, value, model) {
  const separatorIndex = name.lastIndexOf('_');

  // Check for boolean operators (starts with $OPERATOR)
  if (separatorIndex === -1) {
    if (name[0] === '$') {
      const operator = name.substring(1);
      if (BOOLEAN_OPERATORS.includes(operator)) {
        // eslint-disable-next-line no-use-before-define
        return { field: null, operator, value: [].concat(value).map(parseWhereParams) };
      }
    }
    let field = name;
    // eq operator
    if (field === 'id') {
      field = model.schema.primaryKey.name;
    }
    return { field, value };
  }

  // separate fieldName and operator
  let field = name.substring(0, separatorIndex);
  // If field is the id, replace it by primary key
  if (field === 'id') {
    field = model.schema.primaryKey.name;
  }

  // skip the $ symbol
  const operator = name.substring(separatorIndex + 2);

  // If the operator is not found, use the original name
  if (!VALID_REST_OPERATORS.includes(operator)) {
    return { field: name, value };
  }

  // return the field, operator and value
  return { field, operator, value };
}

function parseWhereParams(params, model) {
  const finalWhere = [];

  let where = params;
  if (!Array.isArray(where)) {
    where = [params];
  }

  where.forEach((whereEl) =>
    Object.entries(whereEl).forEach(([name, clauseValue]) => {
      const { field, operator = 'eq', value } = parseWhereClause(name, clauseValue, model);

      // Null is valid field name
      if (!field && field !== null) {
        throw new Error(`The specified filter "${name}" can't have an empty field`);
      }

      finalWhere.push({
        field,
        operator,
        value,
      });
    })
  );

  return finalWhere;
}

function parseFilters({ filters = {}, defaults = { deleted: false }, model } = {}) {
  if (typeof filters !== 'object' || filters === null) {
    throw new Error(
      `parseFilters expected an object, got ${filters === null ? 'null' : typeof filters}`
    );
  }

  if (!_.has(model, 'schema.primaryKey.name')) {
    throw new Error('A valid model must be provided');
  }

  const finalFilters = {};

  // eslint-disable-next-line no-param-reassign
  filters = _.defaultsDeep(filters, defaults);

  // If there are no filters, return the finalFilter
  if (Object.keys(filters).length === 0) {
    return finalFilters;
  }

  if (_.has(filters, '$sort')) {
    Object.assign(finalFilters, parseSortFilter(filters.$sort));
  }

  if (_.has(filters, '$start') && !_.has(filters, '$offset')) {
    _.set(filters, '$offset', filters.$start);
    // eslint-disable-next-line no-param-reassign
    delete filters.$start;
  }

  if (_.has(filters, '$offset')) {
    Object.assign(finalFilters, parseOffsetFilter(filters.$offset));
  }

  if (_.has(filters, '$limit')) {
    Object.assign(finalFilters, parseLimitFilter(filters.$limit));
  }

  const params = _.omit(filters, ['$sort', '$offset', '$limit', '$where']);
  const where = [];

  if (_.keys(params).length > 0) {
    where.push(...parseWhereParams(params, model));
  }

  if (_.has(filters, '$where')) {
    where.push(...parseWhereParams(filters.$where, model));
  }

  Object.assign(finalFilters, { where });

  return finalFilters;
}

module.exports = {
  parseFilters,
  VALID_REST_OPERATORS,
  QUERY_OPERATORS,
};
