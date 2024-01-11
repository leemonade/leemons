const _ = require('lodash');

/**
 * Admin Dashboard
 * @async
 * @function adminDashboard
 * @param {Object} params - The main parameter object.
 * @param {Object} params.config - The configuration object.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<{roleName: string, instances: number}[]>}  The instances object. Each instance contains the role name and the number of instances.
 */
// eslint-disable-next-line no-unused-vars
async function adminDashboard({ config, ctx }) {
  const [_instances, assignables, roles] = await Promise.all([
    ctx.tx.db.Instances.find({}).select(['id', 'assignable']).lean(),
    ctx.tx.db.Assignables.find({}).select(['id', 'role']).lean(),
    ctx.tx.db.Roles.find({}).select(['id', 'name', 'icon']).lean(),
  ]);

  const instances = [];

  const assignablesByRole = _.groupBy(assignables, 'role');
  const instancesByAssignable = _.groupBy(_instances, 'assignable');

  _.forEach(roles, (role) => {
    const inst = {
      roleName: `assignables.roles.${role.name}`,
      roleIcon: role.icon,
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

module.exports = { adminDashboard };
