const _ = require('lodash');
const { getActionsToCallFromRelationship } = require('./getActionsToCallFromRelationship');

async function emitToRelationship({ ctx, relationship, event, params }) {
  const actions = getActionsToCallFromRelationship(relationship);
  return Promise.all(
    _.map(actions, (action) => {
      if (process.env.DEBUG === 'true') console.log(`-- Event send to: ${action}`);
      return ctx.tx.call(
        action,
        { caller: relationship.fromPluginName, event, params },
        { meta: { relationshipID: relationship.id } }
      );
    })
  );
}

module.exports = { emitToRelationship };
