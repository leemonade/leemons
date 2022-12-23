const { map } = require('lodash');
const { table } = require('../tables');
const { validateAddSubjectType } = require('../../validations/forms');
const { updateClassMany } = require('../classes/updateClassMany');
const { saveManagers } = require('../managers/saveManagers');

async function addSubjectType(_data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddSubjectType(_data, { transacting });
      const { subjects, managers, ...data } = _data;
      const subjectType = await table.subjectTypes.create(data, { transacting });
      await saveManagers(managers, 'subject-type', subjectType.id, { transacting });
      if (subjects && subjects.length) {
        const classes = await table.class.find(
          {
            subject_$in: subjects,
            program: data.program,
          },
          { transacting }
        );
        await updateClassMany(
          {
            ids: map(classes, 'id'),
            subjectType: subjectType.id,
          },
          { transacting }
        );
      }
      return subjectType;
    },
    table.subjectTypes,
    _transacting
  );
}

module.exports = { addSubjectType };
