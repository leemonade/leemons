const _ = require('lodash');
const { validateUpdateClassMany } = require('../../validations/forms');
const { updateClass } = require('./updateClass');

async function updateClassMany({ data, ctx }) {
  await validateUpdateClassMany(data);
  const { ids, ...rest } = data;
  return Promise.all(_.map(ids, (id) => updateClass({ data: { id, ...rest }, ctx })));
}

module.exports = { updateClassMany };
