const { userInstances } = require('../../table');
const isUserAlreadyAssigned = require('./exists');

module.exports = async function assignStudent(
  instance,
  user,
  { type = 'direct', transacting } = {}
) {
  let users = Array.isArray(user) ? user : [user];
  const alreadyAssignedUsers = [];

  users = (
    await Promise.all(
      users.map(async (u) => {
        if (await isUserAlreadyAssigned(u, instance, { transacting })) {
          alreadyAssignedUsers.push(u);
          return null;
        }
        return u;
      })
    )
  ).filter((u) => u);

  try {
    await userInstances.createMany(
      users.map((u) => ({
        instance,
        user: u,
        type,
      })),
      { transacting }
    );

    return {
      assigned: users,
      assignedCount: users.length,
      alreadyAssignedUsers,
      alreadyAssignedUsersCount: alreadyAssignedUsers.length,
    };
  } catch (e) {
    throw new Error('Error assigning users to instance');
  }
};
