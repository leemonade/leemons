const table = leemons.query('plugins_classroom::levels');

module.exports = function setPermissions(id, data, { transacting } = {}) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
      },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            profile: {
              type: 'string',
              format: 'uuid',
            },
            actions: {
              type: 'array',
              items: {
                // The allowed actions a profile can have
                enum: ['view', 'edit', 'assign'],
              },
            },
          },
        },
      },
    },
  });

  if (validator.validate({ id, data })) {
    return global.utils.withTransaction(
      (t) =>
        Promise.all(
          data.map(({ profile, actions }) =>
            // Add selected permissions to profiles, (it also delete the non selected ones)
            leemons.getPlugin('users').services.profiles.addCustomPermissions(
              profile,
              {
                permissionName: 'plugins.classroom.levelSchema',
                target: id,
                actionNames: actions,
              },
              { transacting: t }
            )
          )
        ),
      table,
      transacting
    );
  }
  throw validator.error;
};
