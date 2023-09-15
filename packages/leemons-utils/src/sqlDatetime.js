function dateToSql(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function sqlDatetime(value) {
  if (value instanceof Date) {
    return dateToSql(value);
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return dateToSql(new Date(value));
  }

  throw new Error(`Invalid value for sqlDatetime: ${value}`);
}

module.exports = { sqlDatetime };
