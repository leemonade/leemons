const _ = require('lodash');
const { getActionsToCallFromRelationship } = require('./getActionsToCallFromRelationship');

async function emitToRelationship({ ctx, relationship, event, params }) {
  const actions = getActionsToCallFromRelationship(relationship);
  return Promise.all(
    _.map(actions, (action) =>
      ctx.call(
        action,
        { caller: relationship.fromPluginName, event, params },
        { meta: { relationshipID: relationship._id } }
      )
    )
  );
}

module.exports = { emitToRelationship };
