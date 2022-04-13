module.exports = {
  subjects: leemons.query('plugins_assignables::subjects'),
  assignables: leemons.query('plugins_assignables::assignables'),
  roles: leemons.query('plugins_assignables::roles'),
};
