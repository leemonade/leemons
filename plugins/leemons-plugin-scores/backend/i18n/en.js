module.exports = {
  scoresPage: {
    header: {
      admin: {
        title: 'Evaluation Periods',
        description:
          'As administrator, it is possible to create custom time periods for teachers to use as evaluation stages, for example, defining the evaluation periods by program and course.',
      },
      teacher: {
        title: 'Evaluation Notebook',
        description:
          'Welcome to your evaluation notebook. As a teacher you can do custom searches or use the pre-defined periods created by your center for each program and course.',
      },
    },
    filters: {
      title: 'Search period',
      class: {
        label: 'Class',
        placeholder: 'Class...',
      },
      period: {
        label: 'Evaluation period',
        placeholder: 'Evaluation period...',
        custom: 'Custom period',
        final: 'Final evaluation',
        fullCourse: 'Full course',
      },
      startDate: {
        label: 'Start date',
        placeholder: 'Start date...',
      },
      endDate: {
        label: 'End date',
        placeholder: 'End date...',
      },
    },
  },
  reviewPage: {
    header: {
      admin: {
        title: 'Final grades',
        description:
          'As administrator, it is possible to create custom time periods for teachers to use as evaluation stages, for example, defining the evaluation periods by program and course.',
      },
      teacher: {
        title: 'Final grades',
        description:
          'Welcome to your evaluation notebook. As a teacher you can do custom searches or use the pre-defined periods created by your center for each program and course.',
      },
    },
    filters: {
      title: 'Search period',
      program: {
        label: 'Program',
        placeholder: 'Select program...',
      },
      course: {
        label: 'Course',
        placeholder: 'Select course...',
      },
      group: {
        label: 'Group',
        placeholder: 'Select group...',
        all: 'All groups',
      },
      period: {
        label: 'Period',
        placeholder: 'Select period...',
        all: 'All periods',
      },
    },
  },
  studentScoresPage: {
    header: {
      student: {
        title: 'My scores',
        description:
          'Welcome to your evaluation notebook. As a student you can do custom searches or use the pre-defined periods created by your center for each program and course.',
      },
    },
    filters: {
      course: {
        label: 'Course',
        placeholder: 'Course...',
      },
      period: {
        label: 'Select period',
        placeholder: 'Evaluation period...',
        custom: 'Custom period',
        final: 'Final evaluation',
      },
      startDate: {
        label: 'Start date',
        placeholder: 'Select start date...',
      },
      endDate: {
        label: 'End date',
        placeholder: 'Select end date...',
      },
    },
  },
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
      class: {
        label: 'Class',
        placeholder: 'Select a class',
        error: 'A class is required',
      },
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
  periodTypes: {
    custom: 'Custom periods',
    academicCalendar: 'Academic calendar periods',
  },
  notebook: {
    header: {
      export: 'Download',
    },
    noClassSelected: {
      title: 'Select class and period',
      description:
        'Select the class or group and then filter by evaluation periods. You can also export these reports to excel or csv.',
    },
    noCourseSelected: {
      title: 'Select course and period',
      description:
        'Select the course and then filter by evaluation periods. You can also export these reports to excel or csv.',
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
          evaluationReport: {
            label: 'Submit evaluation report',
            disabledTooltip: {
              invalidPeriod: 'Evaluation reports are only enabled for academic calendar periods',
              submittedPeriod: 'The period was already submitted',
            },
            modal: {
              title: 'Send report',
              msg1: "Once the report has been submitted to your organization's administrator/reviewer, the grades for the qualifying activities cannot be changed, so we advise you to review the scores carefully before submitting the report.",
              msg2: 'Remember that the custom grades per evaluation replace the calculated grades and that these can only be modified by a reviewer/administrator once the report has been submitted.',
              confirm: 'Send report',
              cancel: 'Cancel',
            },
          },
          finalReport: {
            label: 'Submit final report',
          },
        },
        scoresTable: {
          table: {
            students: 'Students',
            noActivity: 'Not submitted',
            avgScore: 'Average score',
            calculated: 'Calculated',
            custom: 'Custom',
            attendance: 'attendance',
          },
          updatedSuccess: "Updated {{student}}'s score in {{activity}} to {{score}}",
          updatedError: "Error updating {{student}}'s score in {{activity}} to {{score}}",
        },
        periodSubmission: {
          noData: 'There is no data to be reported yet',
          noPeriod: 'The period must be an academic calendar period',
          success: 'The period {{period}} was successfully submitted',
          error: "The period {{period}} can't be submitted: {{error}}",
        },
      },
    },
    students: {
      averageScore: 'Average score',
      subject: {
        label: 'Select subject',
        placeholder: 'Subject',
      },
      type: {
        label: 'Select type',
        placeholder: 'Type',
        clear: 'Clear',
      },
      seeNonCalificable: 'See non-calificable activities',
      notDelivered: 'Not delivered',
    },
  },
  finalNotebook: {
    filters: {
      filterBy: {
        student: 'Student',
        subject: 'Subject',
        group: 'Group',
      },
      searchBy: 'Search by {{noun}}',
      hideFutureEvaluations: 'Hide future evaluations',
    },
    reviewerTable: {
      students: 'Students',
      noActivity: 'Not submitted',
      avgScore: 'Weighted score',
      gradingTasks: 'Calculated',
      customScore: 'Custom',
    },
    update: {
      success: 'Grade updated for {{student}} in {{subject}} to a {{score}}',
      fail: 'Failed to update grade for {{student}} in {{subject}} to a {{score}}',
      course: 'Course',
    },
  },
  excel: {
    period: {
      period: 'Period',
      startDate: 'Start date',
      endDate: 'End date',
      program: 'Program',
      subject: 'Subject',
      course: 'Course',
      group: 'Group',
    },
    table: {
      type: 'Type',
      evaluation: 'Evaluation',
      activity: 'Activity',
      deadline: 'Deadline/Close date',
      calificable: 'Qualifiable',
      noCalificable: 'non-qualifiable',
      avg: 'Calculates',
      custom: 'Custom',
      notSubmitted: 'Not submitted',
      group: 'Group',
      surname: 'Surname',
      name: 'Name',
      weight: 'Percentage',
    },
    alerts: {
      error: 'Error downloading report',
    },
  },
  weighting: {
    title: 'Weighting rules',
    subjectsAndGroups: 'Subjects and groups',

    table: {
      headers: {
        subject: 'Subject',
        group: 'Group',
        course: 'Course',
        rules: 'Rules',
        actions: 'Actions',
      },
    },
  },
  weightingTypes: {
    averages: 'Average',
    roles: 'Type',
    modules: 'Modules',
  },
  weightingDrawer: {
    rules: 'Rules',
    type: 'Type',
    weighting: 'Weighting',
    table: {
      applySameValue: 'Apply same value',
      modules: 'Modules',
      roles: 'Types',
      weight: 'Percentage',
      total: 'Total',
    },
    explanation: 'Explanation',
    cancel: 'Cancel',
    save: 'Save',
  },
  weightingAlerts: {
    updateSuccess: 'Weight updated successfully',
    updateError: 'Error updating weight',
    exceedPercentageUpper:
      'The total weight cannot be higher than 100%, check the percentage values.',
    exceedPercentageLower:
      'The total weight cannot be less than 100%, check the percentage values.',
    modulesTypeWarning: {
      title: 'Important:',
      message:
        'the weighting by modules will not include activities assigned individually in the calculation  (tasks, tests...)',
    },
    noModulesWarning: {
      title: 'No modules assigned yet',
      message:
        'You can create a weighting rule by applying the same percentage automatically for all the modules you assign. Adjust the rule manually when you want.',
    },
    newModulesWarning:
      'New modules have been added to this class. To include them in the weighting, adjust the percentages.',
  },
  evaluationNotebook: {
    title: 'Evaluation Notebook',
    filters: {
      searchTypes: {
        student: 'Student',
        activity: 'Activity',
      },
      search: 'Search {type}...',
      showNonEvaluable: 'See non-evaluable',
      goToWeighting: 'Weights',
      add: 'Add',
      manualActivity: 'Graded activity',
      manualActivityCreated: 'Graded activity created successfully',
      manualActivityError: 'Error creating graded activity',
    },
    scoresTable: {
      students: 'Students',
      noActivity: 'NS',
      submitted: 'Submitted',
      avgScore: 'Average score',
      calculated: 'Calculated',
      custom: 'Teacher',
    },

    newModule:
      'New modules have been added to this class that are not weighted. To calculate them correctly, access your weighting rules.',
    updatedSuccess: "Updated {{student}}'s score in {{activity}} to {{score}}",
    updatedError: "Error updating {{student}}'s score in {{activity}} to {{score}}",
    closedEvaluationSuccess: '{period} closed successfully',
    closedEvaluationError: 'Error closing {period}',
    unableToOpen: 'Error opening activity, the activity could not be found',
    noEvaluationPage: 'This activity does not have a page to evaluate',

    emptyState: {
      noFilters: {
        title: 'Select class and period',
        description:
          'Select the class and then filter by evaluation periods. You can also export these reports to excel or csv.',
      },
      noResults: {
        title: 'No results',
        description: 'We have not found results for your search.',
      },
    },
    footer: {
      closeEvaluation: 'Close evaluation',
    },
  },
  myScores: {
    title: 'My evaluations',
    filters: {
      course: 'Course',
    },
    localFilters: {
      subject: 'Subject',
      search: 'Search by activity...',
      seeNonEvaluable: 'See non-evaluable',
    },
    finalGrades: 'Final scores',
    noEvaluable: 'No evaluable',
    downloadReport: 'Download report',
    emptyStates: {
      noFilters: {
        title: 'Select course and period',
        description: 'Select the course and then filter by evaluation periods.',
      },
      noResults: {
        title: 'No results',
        description: 'We have not found results for your search.',
      },
    },
  },
  manualActivityDrawer: {
    title: 'New graded activity',
    config: 'Configuration',
    date: { label: 'Date', error: 'The date is required' },
    name: { label: 'Name', error: 'The name is required' },
    description: { label: 'Description' },
    cancel: 'Cancel',
    save: 'Create activity',

    weightType: {
      title: 'Weighting',
      weightingBy: 'You are weighting by',
      averages: 'this activity will count as part of the average',
      modules: 'this activity will appear as a module',
      roles: 'in which type would you like to add this activity?',
    },
  },
};
