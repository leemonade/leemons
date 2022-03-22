const _ = require('lodash');
const { table } = require('../tables');
const { validateUpdateSubject } = require('../../validations/forms');
const { setSubjectCredits } = require('./setSubjectCredits');
const { setSubjectInternalId } = require('./setSubjectInternalId');
const { changeBySubject } = require('../classes/knowledge/changeBySubject');

async function updateSubject(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateSubject(data, { transacting });
      const { id, credits, internalId, subjectType, knowledge, ..._data } = data;
      const subject = await table.subjects.update({ id }, _data, { transacting });
      const promises = [];

      if (!_.isUndefined(subjectType)) {
        promises.push(
          table.class.updateMany({ subject: subject.id }, { subjectType }, { transacting })
        );
      }

      if (!_.isUndefined(knowledge)) {
        promises.push(changeBySubject(subject.id, knowledge, { transacting }));
      }

      if (credits)
        promises.push(setSubjectCredits(subject.id, subject.program, credits, { transacting }));
      if (internalId)
        promises.push(
          setSubjectInternalId(subject.id, subject.program, internalId, {
            course: data.course,
            transacting,
          })
        );
      await Promise.all(promises);
      return subject;
    },
    table.subjects,
    _transacting
  );
}

module.exports = { updateSubject };
