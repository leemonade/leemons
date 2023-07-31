const { map } = require('lodash');
const { table } = require('../tables');
const { validateAddGroup } = require('../../validations/forms');
const { getNextGroupIndex } = require('./getNextGroupIndex');
const { addNextGroupIndex } = require('./addNextGroupIndex');
const { addClass } = require('../classes/addClass');
const { saveManagers } = require('../managers/saveManagers');

async function addGroup(_data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddGroup(_data, { transacting });
      const { subjects, aditionalData, managers, ...data } = _data;
      const index = await getNextGroupIndex(data.program, { transacting });
      await addNextGroupIndex(data.program, { index, transacting });
      const group = await table.groups.create({ ...data, index, type: 'group' }, { transacting });
      await saveManagers(managers, 'group', group.id, { transacting });
      if (subjects) {
        await Promise.all(
          map(subjects, (subject) =>
            addClass(
              {
                ...aditionalData,
                subject,
                group: group.id,
                program: data.program,
              },
              { transacting }
            )
          )
        );
      }
      return group;
    },
    table.groups,
    _transacting
  );
}

module.exports = { addGroup };
