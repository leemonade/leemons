module.exports = function filterAssignationsByGradesNotViewed({ assignations, dates }) {
  return assignations.filter((assignation) => !dates.assignations[assignation.id]?.gradesViewed);
};
