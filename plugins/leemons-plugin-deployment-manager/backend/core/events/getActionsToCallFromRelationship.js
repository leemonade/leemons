const _ = require('lodash');

function getActionsToCallFromRelationship(relationship) {
  return _.filter(
    relationship.actions,
    (action) => action.indexOf('leemonsDeploymentManagerEvent') >= 0
  );
}

module.exports = { getActionsToCallFromRelationship };
