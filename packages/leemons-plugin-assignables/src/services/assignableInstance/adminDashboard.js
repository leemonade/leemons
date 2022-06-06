const _ = require('lodash');
const table = require('../tables');

async function adminDashboard(config, { transacting } = {}) {
  const [_instances, assignables, roles] = await Promise.all([
    table.assignableInstances.find({}, { columns: ['id', 'assignable'], transacting }),
    table.assignables.find({}, { columns: ['id', 'role'], transacting }),
    table.roles.find({}, { columns: ['id', 'name'], transacting }),
  ]);

  const instances = [];

  const assignablesByRole = _.groupBy(assignables, 'role');
  const instancesByAssignable = _.groupBy(_instances, 'assignable');

  _.forEach(roles, (role) => {
    const inst = {
      roleName: `plugins.assignables.roles.${role.name}`,
      instances: [],
    };

    _.forEach(assignablesByRole[role.name], (assignable) => {
      inst.instances = inst.instances.concat(_.map(instancesByAssignable[assignable.id], 'id'));
    });

    inst.instances = _.uniq(inst.instances).length;
    instances.push(inst);
  });

  return { instances };
}

module.exports = adminDashboard;
