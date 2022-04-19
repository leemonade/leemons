module.exports = {
  subjects: leemons.query('plugins_assignables::subjects'),
  assignables: leemons.query('plugins_assignables::assignables'),
  roles: leemons.query('plugins_assignables::roles'),
  assignableInstances: leemons.query('plugins_assignables::assignableInstances'),
  dates: leemons.query('plugins_assignables::dates'),
  classes: leemons.query('plugins_assignables::classes'),
};
