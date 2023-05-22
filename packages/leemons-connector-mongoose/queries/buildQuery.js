const _ = require('lodash');
const mongoose = require('mongoose');

function parseQuery(filter, { query: parentQuery = null, negated = false } = {}) {
  const { operator, value } = filter;
  let { field } = filter;

  if (field === 'id') {
    field = '_id';
  }

  const query = new mongoose.Query();
  const useParent = parentQuery || query;

  switch (operator) {
    case 'where':
      value.map((prop) => parseQuery(prop, { query, negated }));
      if (parentQuery) {
        parentQuery.and(query.getQuery());
      }
      break;
    case 'not':
      parseQuery(
        { field: null, operator: 'where', value },
        { query: useParent, negated: !negated }
      );
      break;
    case 'or':
      // eslint-disable-next-line no-case-declarations
      const q = value
        .map((element) => {
          const subQuery = new mongoose.Query();
          element.map((orFilter) => parseQuery(orFilter, { query: subQuery }));
          return subQuery.getQuery();
        })
        .filter((_q) => _q);

      if (negated) {
        parentQuery.and({ $nor: q });
        break;
      }
      parentQuery.and({ $or: q });
      break;
    case 'eq':
      if (negated) {
        parseQuery({ ...filter, operator: 'ne' }, { query: useParent, negated: false });
        break;
      }
      useParent.and({ [field]: value });
      break;
    case 'ne':
      if (negated) {
        parseQuery({ ...filter, operator: 'eq' }, { query: useParent, negated: false });
        break;
      }
      useParent.and({ [field]: { $ne: value } });
      break;
    case 'lt':
      if (negated) {
        parseQuery({ ...filter, operator: 'gte' }, { query: useParent, negated: false });
        break;
      }
      useParent.where(field).lt(value);
      break;
    case 'lte':
      if (negated) {
        parseQuery({ ...filter, operator: 'gt' }, { query: useParent, negated: false });
        break;
      }
      useParent.where(field).lte(value);
      break;
    case 'gt':
      if (negated) {
        parseQuery({ ...filter, operator: 'lte' }, { query: useParent, negated: false });
        break;
      }
      useParent.where(field).gt(value);
      break;
    case 'gte':
      if (negated) {
        parseQuery({ ...filter, operator: 'lt' }, { query: useParent, negated: false });
        break;
      }
      useParent.where(field).gte(value);
      break;
    case 'in':
      if (negated) {
        parseQuery({ ...filter, operator: 'nin' }, { query: useParent, negated: false });
        break;
      }
      useParent.where(field).in(value);
      break;
    case 'nin':
      if (negated) {
        parseQuery({ ...filter, operator: 'in' }, { query: useParent, negated: false });
        break;
      }
      useParent.where(field).nin(value);
      break;
    case 'contains':
      if (negated) {
        parseQuery({ ...filter, operator: 'ncontains' }, { query: useParent, negated: false });
        break;
      }
      useParent.and({
        [field]: {
          $regex: new RegExp(value, 'i'),
        },
      });
      break;
    case 'ncontains':
      if (negated) {
        parseQuery({ ...filter, operator: 'contains' }, { query: useParent, negated: false });
        break;
      }
      useParent.and({
        [field]: {
          $not: {
            $regex: new RegExp(value, 'i'),
          },
        },
      });
      break;
    case 'containss':
      if (negated) {
        parseQuery({ ...filter, operator: 'ncontainss' }, { query: useParent, negated: false });
        break;
      }
      // Case sensitive
      useParent.and({
        [field]: {
          $regex: new RegExp(value),
        },
      });
      break;
    case 'ncontainss':
      if (negated) {
        parseQuery({ ...filter, operator: 'containss' }, { query: useParent, negated: false });
        break;
      }
      // Case sensitive
      useParent.and({
        [field]: {
          $not: {
            $regex: new RegExp(value),
          },
        },
      });
      break;
    case 'startsWith':
      if (negated) {
        parseQuery({ ...filter, operator: 'nstartsWith' }, { query: useParent, negated: false });
        break;
      }
      useParent.and({
        [field]: {
          $regex: new RegExp(`^${value}`, 'i'),
        },
      });
      break;
    case 'nstartsWith':
      if (negated) {
        parseQuery({ ...filter, operator: 'startsWith' }, { query: useParent, negated: false });
        break;
      }
      useParent.and({
        [field]: {
          $not: {
            $regex: new RegExp(`^${value}`, 'i'),
          },
        },
      });
      break;
    case 'endsWith':
      if (negated) {
        parseQuery({ ...filter, operator: 'nendsWith' }, { query: useParent, negated: false });
        break;
      }
      useParent.and({
        [field]: {
          $regex: new RegExp(`${value}$`, 'i'),
        },
      });
      break;
    case 'nendsWith':
      if (negated) {
        parseQuery({ ...filter, operator: 'endsWith' }, { query: useParent, negated: false });
        break;
      }
      useParent.and({
        [field]: {
          $not: {
            $regex: new RegExp(`${value}$`, 'i'),
          },
        },
      });
      break;
    case 'startssWith':
      if (negated) {
        parseQuery({ ...filter, operator: 'nstartssWith' }, { query: useParent, negated: false });
        break;
      }
      // Case sensitive
      useParent.and({
        [field]: {
          $regex: new RegExp(`^${value}`),
        },
      });
      break;
    case 'nstartssWith':
      if (negated) {
        parseQuery({ ...filter, operator: 'startssWith' }, { query: useParent, negated: false });
        break;
      }
      // Case sensitive
      useParent.and({
        [field]: {
          $not: {
            $regex: new RegExp(`^${value}`),
          },
        },
      });
      break;
    case 'endssWith':
      if (negated) {
        parseQuery({ ...filter, operator: 'nendssWith' }, { query: useParent, negated: false });
        break;
      }
      // Case sensitive
      useParent.and({
        [field]: {
          $regex: new RegExp(`${value}$`),
        },
      });
      break;
    case 'nendssWith':
      if (negated) {
        parseQuery({ ...filter, operator: 'endssWith' }, { query: useParent, negated: false });
        break;
      }
      // Case sensitive
      useParent.and({
        [field]: {
          $not: {
            $regex: new RegExp(`${value}$`),
          },
        },
      });
      break;
    case 'null':
      // eslint-disable-next-line no-case-declarations
      const finalValue = negated ? value : !value;
      parseQuery({ field, operator: finalValue ? 'ne' : 'eq', value: null }, { query: useParent });
      break;
    default:
      return null;
  }

  return query.getQuery();
}

function buildQuery(model, filters = {}) {
  const { where } = filters;

  let query = {};
  if (where) {
    query = parseQuery({ field: null, operator: 'where', value: where });
  }

  const extras = [];
  if (_.has(filters, 'sort')) {
    const order = {};
    filters.sort.forEach((sort) => {
      order[sort.field] = sort.order;
    });
    extras.push({ key: 'sort', value: order });
  }

  if (_.has(filters, 'offset')) {
    extras.push({ key: 'skip', value: filters.offset });
  }

  if (_.has(filters, 'limit')) {
    extras.push({ key: 'limit', value: filters.limit });
  }

  query.$extras = (Query) => extras.reduce((acc, { key, value }) => acc[key](value), Query);

  return query;
}

module.exports = buildQuery;
