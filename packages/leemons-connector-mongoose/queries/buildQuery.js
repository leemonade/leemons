const mongoose = require('mongoose');

function parseQuery(filter) {
  const { field, operator, value } = filter;
  const query = new mongoose.Query();

  console.log(field, operator, value);
  switch (operator) {
    case 'where':
      query.and(value.map(parseQuery));
      break;
    case 'or':
      query.or(
        value.map((element) => parseQuery({ field: null, operator: 'where', value: element }))
      );
      break;
    case 'eq':
      query.where(field).equals(value);
      break;
    case 'gt':
      query.where(field).gt(value);
      break;
    case 'gte':
      query.where(field).gte(value);
      break;
    case 'lt':
      query.where(field).lt(value);
      break;
    case 'lte':
      query.where(field).lte(value);
      break;
    case 'in':
      query.where(field).in(value);
      break;
    default:
      break;
  }

  return query.getQuery();
}

function buildQuery(model, filters = {}) {
  // console.log(JSON.stringify(filters, null, 2));

  const { where } = filters;

  console.log(
    JSON.stringify(
      where.map((filter) => parseQuery(filter)),
      null,
      2
    )
  );
}

module.exports = buildQuery;
