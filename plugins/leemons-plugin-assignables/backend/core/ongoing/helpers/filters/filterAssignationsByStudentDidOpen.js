function filterAssignationsByStudentDidOpen({ assignations, dates, filters }) {
  const { studentDidOpen } = filters;

  const assignationDates = dates.assignations;

  if (typeof studentDidOpen !== 'boolean') {
    return assignations;
  }

  return assignations.filter((assignation) => {
    const openDate = assignationDates[assignation.id]?.open;

    return !!openDate === studentDidOpen;
  });
}

module.exports = { filterAssignationsByStudentDidOpen };
