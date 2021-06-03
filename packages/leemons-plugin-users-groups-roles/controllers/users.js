const Ajv = require('ajv');

const table = {
  user: leemons.query('plugins_users-groups-roles::users'),
};

async function create({ request, body }) {
  console.log(request.body);
  const ajv = new Ajv();
  const schema = {};
  if (ajv.validate(schema, request.body)) {
    console.log('Holaaaa');
  } else {
    console.log('error', ajv.errors);
  }
  body = { test: 'Holaaa' };
}

module.exports = {
  create,
};
