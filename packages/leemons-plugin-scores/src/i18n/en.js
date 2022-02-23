module.exports = {
  setup_page: {
    page_title: 'Scores Setup',
    page_description:
      'Config your evaluation periods: trimester, semester, anual… and the diferente user roles to scoring tasks and subjects, review and export reports. First of all, select the program you want to setup.',
    select_center: 'Select center',
    setup: {
      periods: {
        step_label: 'Periods',
        labels: {
          title: 'Periods and evaluation stages',
          description: 'Select which of your academic periods will be gradables.',
          periodProgramLabel: 'The full program',
          periodCourseLabel: 'Each program course ({i} courses)',
          periodSubstageLabel: 'All substages ({i} {x})',
          periodsRequired: 'At least one period must be selected',
          finalPeriodTitle: 'At what period is the final grade submitted?',
          finalPeriodProgramLabel: 'At the end of the full program',
          finalPeriodCourseLabel: 'At the end of each course',
          finalPeriodSubstage: 'At the end of each substage',
          finalPeriodsRequired: 'Field required',
          next: 'Next',
        },
      },
    },
  },
};
