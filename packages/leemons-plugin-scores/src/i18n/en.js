module.exports = {
  periods: {
    alerts: {
      removeSuccess: 'Period "{{name}}" removed successfully',
      removeError: 'Error removing period "{{name}}": {{error}}',
      addSuccess: 'Period "{{name}}" added successfully',
      addError: 'Error adding period "{{name}}": {{error}}',
    },
    periodForm: {
      startDate: 'Start date',
      endDate: 'End date',
      submit: 'Search',
      newPeriod: 'New period',
      addPeriod: 'Add period',
      shareWithTeachers: 'Share with teachers',
      saveButton: 'Save period',
      periodName: 'Period name',
      center: {
        label: 'Center',
        placeholder: 'Select a center',
        error: 'The center is required',
      },
      program: {
        label: 'Program',
        placeholder: 'Select a program',
        error: 'The program is required',
      },
      course: {
        label: 'Course',
        placeholder: 'Select a course',
        error: 'The course is required',
      },
      subject: {
        label: 'Subject',
        placeholder: 'Select a subject',
        error: 'The subject is required',
      },
      group: {
        label: 'Group',
        placeholder: 'Select a group',
        error: 'The group is required',
      },
    },
    adminDrawer: {
      title: 'Evaluation periods',
      description:
        'As administrator, you can create custom time periods for teachers to use as evaluation stages, for example, defining the evaluation periods by program and course.',
      new: 'New period',
    },
    teacherDrawer: {
      title: 'Notebook',
      description:
        'Welcome to your notebook. As a teacher you can do custom searches or use the pre-defined periods created by your center for each program and course.',
      new: 'Stablish period',
    },
    periodFormErrorMessages: {
      startDate: 'The start date is required',
      endDate: 'The end date is required',
      validateStartDate: 'The start date must be before the end date',
      validateEndDate: 'The end date must be after the start date',
      periodName: 'The period name is required',
    },
    periodListFilters: {
      center: 'Center',
      program: 'Program',
      course: 'Course',
      search: 'Search by period name',

      centerPlaceholder: 'Select a center',
      programPlaceholder: 'Select a program',
      coursePlaceholder: 'Select a course',
    },
    periodListColumns: {
      name: 'Name',
      center: 'Center',
      program: 'Program',
      course: 'Course',
      startDate: 'Start date',
      endDate: 'End date',
    },
  },
  notebook: {
    header: {
      export: 'Export grades to csv',
    },
    noClassSelected: {
      title: 'Copy scores',
      description:
        'Scores allow you to rating grading and non-grading task and attendance control. Select the program and class, then you can filter by time periods, you can save these periods so that teachers can use them as evaluation stages.',
    },
    noResults: {
      title: 'No results copy',
      description:
        'Scores allow you to rating grading and non-grading task and attendance control.',
    },
  },
};
