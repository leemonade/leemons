module.exports = {
  schedule_picker: {
    labels: {
      input: 'Class schedule',
      checkboxLabel: 'Same time slot for each class',
      groupLabel: 'Class days',
      schedule: 'Schedule',
      divider: 'to',
      useCustomDates: 'Use custom dates',
      startDate: 'Date of first class',
      endDate: 'Date of last class',
      apply: 'Apply',
      clear: 'Clear',
    },
    errorMessages: {
      invalidSchedule: 'The class must have a duration',
      invalidDates: 'The finish time must be later than the start time',
    },
    placeholders: {
      input: 'Select schedule',
      startDate: 'Select date',
      endDate: 'Select date',
    },
  },
};
