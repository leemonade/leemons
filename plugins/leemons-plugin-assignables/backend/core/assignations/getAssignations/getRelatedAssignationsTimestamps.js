const { getRelatedAssignations } = require('./getRelatedAssignations');
const { findAssignationDates } = require('./findAssignationDates');
const _ = require('lodash');

async function getRelatedAssignationsTimestamps({ assignationsData, ctx }) {
  const relatedAssignationsByAssignation = await getRelatedAssignations({ assignationsData, ctx });

  const relatedAssignationsIds = _.map(
    Object.values(relatedAssignationsByAssignation).flat(),
    'id'
  );

  const datesPerAssignation = await findAssignationDates({
    assignationsIds: relatedAssignationsIds,
    ctx,
  });

  Object.entries(relatedAssignationsByAssignation).forEach(([key, relatedAssignations]) => {
    relatedAssignations.forEach((assignation, i) => {
      relatedAssignationsByAssignation[key][i] = {
        ...relatedAssignationsByAssignation[key][i],
        timestamps: datesPerAssignation[assignation.id] || {},
      };
    });
  });

  return relatedAssignationsByAssignation;
}

module.exports = { getRelatedAssignationsTimestamps };
