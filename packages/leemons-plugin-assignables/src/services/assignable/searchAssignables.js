const _ = require('lodash');
const listAssignablesUserHasPermissionTo = require('./permissions/assignable/users/listAssignablesUserHasPermissionTo');
const versionControl = require('../versionControl');
const getAssignable = require('./getAssignable');

function getVersion(published, preferCurrent) {
  if (!published) {
    return 'draft';
  }
  if (preferCurrent) {
    return 'current';
  }
  return 'published';
}

module.exports = async function searchAssignables(
  role,
  { published, preferCurrent, ...query },
  sort,
  { userSession, transacting } = {}
) {
  /*
    1. Get all the assignables the userSession has access to
    2. Filter them by latests versions (latest, current, published, draft)
    3. Filter them by the query
    4. Sort them by the sort
  */
  // EN: Get the user assignables
  // ES: Obtiene los asignables del usuario
  let userAssignables = await listAssignablesUserHasPermissionTo(role, {
    userSession,
    transacting,
  });

  // EN: Get the uniques assignables uuids
  // ES: Obtiene los uuids de los asignables únicos
  userAssignables = await Promise.all(
    _.uniq(
      await Promise.all(
        userAssignables.map(async (assignable) => {
          const { uuid } = await versionControl.parseId(assignable, undefined, { transacting });
          return uuid;
        })
      )
    ).map(async (uuid) => {
      const { fullId } = await versionControl.parseId(uuid, getVersion(published, preferCurrent), {
        transacting,
      });

      return fullId;
    })
  );

  return Promise.all(
    userAssignables.map((assignable) =>
      getAssignable.call(this, assignable, { userSession, transacting })
    )
  );
};
