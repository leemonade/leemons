module.exports = {
  subjects: leemons.query('plugins_assignables::subjects'),
  assignables: leemons.query('plugins_assignables::assignables'),
  roles: leemons.query('plugins_assignables::roles'),
  assignableInstances: leemons.query('plugins_assignables::assignableInstances'),
  assignations: leemons.query('plugins_assignables::assignations'),
  dates: leemons.query('plugins_assignables::dates'),
  classes: leemons.query('plugins_assignables::classes'),
  grades: leemons.query('plugins_assignables::grades'),
  teachers: leemons.query('plugins_assignables::teachers'),
};
