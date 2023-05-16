const _ = require('lodash');
const {table} = require('../../tables');

async function getByClass(_class, {transacting} = {}) {
  return table.classStudent.find(
    {class_$in: _.isArray(_class) ? _class : [_class]},
    {transacting}
  );
}

module.exports = {getByClass};
