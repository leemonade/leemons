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
      customPeriod: 'Custom periods',
      evaluations: 'Evaluations',
      center: {
        label: 'Center',
        placeholder: 'Select a center',
        error: 'A center is required',
      },
      program: {
        label: 'Program',
        placeholder: 'Select a program',
        error: 'A program is required',
      },
      course: {
        label: 'Course',
        placeholder: 'Select a course',
        error: 'A course is required',
      },
      subject: {
        label: 'Subject',
        placeholder: 'Select a subject',
        error: 'A subject is required',
      },
      group: {
        label: 'Group',
        placeholder: 'Select a group',
        error: 'A group is required',
      },
    },
    adminDrawer: {
      title: 'Evaluation Periods',
      description:
        'As administrator, it is possible to create custom time periods for teachers to use as evaluation stages, for example, defining the evaluation periods by program and course.',
      new: 'New period',
    },
    teacherDrawer: {
      title: 'Evaluation Notebook',
      description:
        'Welcome to your evaluation notebook. As a teacher you can do custom searches or use the pre-defined periods created by your center for each program and course.',
      new: 'Establish period',
    },
    periodFormErrorMessages: {
      startDate: 'The start date is required',
      endDate: 'The end date is required',
      validateStartDate: 'The start date must be before the end date',
      validateEndDate: 'The end date must be after the start date',
      periodName: 'A period name is required',
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
      export: 'Export grades to',
    },
    noClassSelected: {
      title: 'Evaluation Notebook',
      description:
        'The Evaluation Notebook is a place where you can evaluate the activities that are not graded and the activities that are graded. Select the program, course, class and then filter by time periods. You can also export these reports to excel or csv.',
    },
    noResults: {
      title: 'No results',
      description: 'We have not found results for your search.',
    },
    tabs: {
      activities: {
        title: 'Evaluated activities',
        unableToOpen: 'Error opening activity, the activity could not be found',
        filters: {
          filterBy: {
            activity: 'Activity',
            student: 'Student',
            placeholder: 'Search by',
          },
          search: 'Search by {{filterBy.toLowerCase}}',
          nonCalificables: 'See non-qualifiable',
        },
        scoresTable: {
          table: {
            students: 'Students',
            noActivity: 'Not submitted',
            avgScore: 'Average score',
            gradingTasks: 'Qualifiable activities',
            attendance: 'attendance',
          },
          updatedSuccess: "Updated {{student}}'s score in {{activity}} to {{score}}",
          updatedError: "Error updating {{student}}'s score in {{activity}} to {{score}}",
        },
      },
    },
  },
  excel: {
    period: {
      period: 'Period',
      startDate: 'Start date',
      endDate: 'End date',
      program: 'Program',
      subject: 'Subject',
    },
    table: {
      type: 'Type',
      evaluation: 'Evaluation',
      activity: 'Activity',
      deadline: 'Deadline/Close date',
      calificable: 'Qualifiable',
      noCalificable: 'non-qualifiable',
      avg: 'Average',
      notSubmitted: 'Not submitted',
      group: 'Group',
      surname: 'Surname',
      name: 'Name',
      weight: 'Percentage',
    },
  },
};
