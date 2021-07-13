const _ = require('lodash');
const { table } = require('../tables');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function find(...params) {
  const results = await table.itemPermissions.find(...params);
  const group = _.groupBy(
    results,
    (value) => `${value.permissionName}.${value.target}.${value.type}.${value.item}`
  );
  const responses = [];
  _.forIn(group, (values) => {
    responses.push({
      permissionName: values[0].permissionName,
      actionNames: _.map(values, 'actionName'),
      target: values[0].target,
      type: values[0].type,
      item: values[0].item,
    });
  });

  return responses;
}

module.exports = find;
