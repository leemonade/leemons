module.exports = async ({ profile, query } = {}) => {
  const users = (
    await leemons.getPlugin('users').services.users.searchUserAgents({
      profile,
      user: {
        name: query,
        surname: query,
        email: query,
      },
    })
  ).map(({ user }) => user);

  const usersIds = [...new Set(users.map(({ id }) => id))];

  return usersIds.map((id) => users.find((user) => user.id === id));
};
