const mongoose = require('mongoose');
const _ = require('lodash');

function parseQuery(filter, { query: parentQuery = null } = {}) {
  const { field, operator, value } = filter;
  const query = new mongoose.Query();
  const useParent = parentQuery || query;

  // console.log(field, operator, value);
  switch (operator) {
    case 'where':
      console.log(_.groupBy(value, 'field'));
      value.map((prop) => parseQuery(prop, { query: useParent }));
      break;
    // case 'or':
    //   query.or(
    //     value
    //       .map((element) => parseQuery({ field: null, operator: 'where', value: element }))
    //       .filter((q) => q)
    //   );
    //   break;
    // case 'not':
    //   query.where(parseQuery({ field: null, operator: 'where', value }));
    //   break;
    case 'eq':
      useParent.where(field).equals(value);
      break;
    case 'ne':
      useParent.where(field).ne(value);
      break;
    case 'lt':
      useParent.where(field).lt(value);
      break;
    case 'lte':
      useParent.where(field).lte(value);
      break;
    case 'gt':
      useParent.where(field).gt(value);
      break;
    case 'gte':
      useParent.where(field).gte(value);
      break;
    case 'in':
      useParent.where(field).in(value);
      break;
    case 'nin':
      useParent.where(field).nin(value);
      break;
    case 'contains':
      useParent.where(field).regex(new RegExp(`.*${value}.*`, 'i'));
      break;
    // case 'ncontains':
    //   useParent.where(field).not().regex(new RegExp(`.*${value}.*`, 'i'));
    //   break;
    case 'containss':
      // Case sensitive
      useParent.where(field).regex(new RegExp(`.*${value}.*`));
      break;
    // case 'ncontainss':
    //   // Case sensitive
    //   useParent.where(field).not().regex(new RegExp(`.*${value}.*`));
    //   break;
    case 'startsWith':
      useParent.where(field).regex(new RegExp(`^${value}.*`, 'i'));
      break;
    // case 'nstartsWith':
    //   useParent.where(field).not().regex(new RegExp(`^${value}.*`, 'i'));
    //   break;
    case 'endsWith':
      useParent.where(field).regex(new RegExp(`.*${value}$`, 'i'));
      break;
    // case 'nendsWith':
    //   useParent.where(field).not().regex(new RegExp(`.*${value}$`, 'i'));
    //   break;

    case 'startssWith':
      useParent.where(field).regex(new RegExp(`^${value}.*`));
      break;
    // case 'nstartssWith':
    //   useParent.where(field).not().regex(new RegExp(`^${value}.*`));
    //   break;
    case 'endssWith':
      useParent.where(field).regex(new RegExp(`.*${value}$`));
      break;
    // case 'nendssWith':
    //   useParent.where(field).not().regex(new RegExp(`.*${value}$`));
    //   break;

    case 'null':
      useParent.where(field)[value ? 'equals' : 'ne'](null);
      break;
    default:
      return null;
    // throw new Error(
    //   `Unhandled whereClause: ${field} ${operator} ${
    //     typeof value === 'object' ? JSON.stringify(value, null, 2) : value
    //   }`
    // );
  }

  return query.getQuery();
}

function buildQuery(model, filters = {}) {
  // console.log(JSON.stringify(filters, null, 2));

  const { where } = filters;

  // console.log(JSON.stringify(where, null, 2));
  console.log(
    // JSON.stringify(
    where.map((filter) => parseQuery(filter))
    //   null,
    //   2
    // )
  );
}

module.exports = buildQuery;
