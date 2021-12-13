const _ = require('lodash');

const fieldLowerFn = (qb) => {
  // Postgres requires string to be passed
  if (qb.client.config.client === 'pg') {
    return 'LOWER(CAST(?? AS VARCHAR))';
  }
  return 'LOWER(??)';
};

function buildWhereClause({ qb, field, operator, value }) {
  // If where is an array, use it as and wheres
  if (Array.isArray(value) && !['or', 'in', 'nin'].includes(operator)) {
    const statement = operator === 'not' ? 'whereNot' : 'where';
    return qb[statement]((subQb) => {
      value.forEach((val) => {
        subQb.where((q) => buildWhereClause({ qb: q, ...val }));
      });
    });
  }

  /**
   * If you want to add a new operator, must be modified on leemons-utils/parse-filters
   * for the parser to detect them
   */
  switch (operator) {
    case 'or':
      // Add a where
      return qb.where((orQb) => {
        // foreach element in the array
        value.forEach((orClause) => {
          // use orWhere
          orQb.orWhere((subQb) => {
            // if is an array, concat as and where
            if (Array.isArray(orClause)) {
              orClause.forEach((eachOrClause) =>
                subQb.where((andQb) => buildWhereClause({ qb: andQb, ...eachOrClause }))
              );
              // else use where builder
            } else {
              buildWhereClause({ qb: subQb, ...orClause });
            }
          });
        });
      });

    case 'eq':
      // where field equals value
      return qb.where(field, value);

    case 'ne':
      // where field not equals value);
      return qb.where(field, '!=', value);

    case 'lt':
      // where field is lower than value
      return qb.where(field, '<', value);

    case 'lte':
      // where field is lower than or equal to value
      return qb.where(field, '<=', value);

    case 'gt':
      // where field is greater than value
      return qb.where(field, '>', value);

    case 'gte':
      // where field is greater than or equal to value
      return qb.where(field, '>=', value);

    case 'in':
      // where field is in the array's value
      return qb.whereIn(field, Array.isArray(value) ? value : [value]);

    case 'nin':
      // where field is not in the array's value
      return qb.whereNotIn(field, Array.isArray(value) ? value : [value]);

    case 'contains':
      // where field in lowercase is like %value% in lower case
      return qb.whereRaw(`${fieldLowerFn(qb)} LIKE LOWER(?)`, [field, `%${value}%`]);

    case 'ncontains':
      // where field in lowercase is not like %value% in lower case
      return qb.whereRaw(`${fieldLowerFn(qb)} NOT LIKE LOWER(?)`, [field, `%${value}%`]);

    // contains strict
    case 'containss':
      // where field is like %value%
      return qb.where(field, 'like', `%${value}%`);

    // not contains strict
    case 'ncontainss':
      // where field is not like %value%
      return qb.whereNot(field, 'like', `%${value}%`);

    case 'startsWith':
      // where field is like value% in lowercase
      return qb.whereRaw(`${fieldLowerFn(qb)} LIKE LOWER(?)`, [field, `${value}%`]);

    // not starts with
    case 'nstartsWith':
      // where field is not like value% in lowercase
      return qb.whereRaw(`${fieldLowerFn(qb)} NOT LIKE LOWER(?)`, [field, `${value}%`]);

    case 'endsWith':
      // where field is like %value in lowercase
      return qb.whereRaw(`${fieldLowerFn(qb)} LIKE LOWER(?)`, [field, `%${value}`]);

    // not starts with
    case 'nendsWith':
      // where field is like %value in lowercase
      return qb.whereRaw(`${fieldLowerFn(qb)} NOT LIKE LOWER(?)`, [field, `%${value}`]);

    // Starts strictly with
    case 'startssWith':
      // where field is like value%
      return qb.where(field, 'like', `${value}%`);

    // Not starts strictly with
    case 'nstartssWith':
      // where field is not like value%
      return qb.whereNot(field, 'like', `${value}%`);

    // Ends strictly with
    case 'endssWith':
      // where field is like %value
      return qb.where(field, 'like', `%${value}`);

    // Not end strictly with
    case 'nendssWith':
      // where field is like %value
      return qb.whereNot(field, 'like', `%${value}`);

    case 'null':
      // if value is true: where is null
      // if value is false: where is not null
      return value ? qb.whereNull(field) : qb.whereNotNull(field);
    default:
      throw new Error(
        `Unhandled whereClause: ${field} ${operator} ${
          typeof value === 'object' ? JSON.stringify(value, null, 2) : value
        }`
      );
  }
}

function buildQuery(model, filters = {}) {
  return (qb) => {
    // If there is a where clause, select only distinct entries
    if (_.has(filters, 'where') && Array.isArray(filters.where) && filters.where.length > 0) {
      filters.where.forEach(({ field, operator, value }) => {
        buildWhereClause({ qb, field, operator, value });
      });
      qb.distinct();
    }

    if (_.has(filters, 'sort')) {
      const order = filters.sort.map((sort) => ({ column: sort.field, order: sort.order }));
      qb.distinct().orderBy(order);
    }

    if (_.has(filters, 'offset')) {
      qb.offset(filters.offset);
    }

    if (_.has(filters, 'limit')) {
      qb.limit(filters.limit);
    }
  };
}

module.exports = buildQuery;
