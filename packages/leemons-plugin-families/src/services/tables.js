const table = {
  families: leemons.query('plugins_families::families'),
  familyMembers: leemons.query('plugins_families::family-members'),
  profilesConfig: leemons.query('plugins_families::profiles-config'),
};

module.exports = { table };
