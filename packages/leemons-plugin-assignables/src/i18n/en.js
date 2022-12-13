module.exports = {
  userNavigator: {
    student: 'Student',
    multiSubject: 'Multi-subject',
  },
  assignment_form: {
    labels: {
      isAllDay: 'Show as daily event',
      classroomToAssign: 'Classroom to assign',
      studentToAssign: 'Student to assign',
      mode: 'Mode',
      startDate: 'Start date',
      deadline: 'Deadline',
      visualizationDateToogle: 'Make visible in advance',
      visualizationDate: 'Visualization date',
      limitedExecutionToogle: 'Limit execution time',
      limitedExecution: 'Limited execution time',
      alwaysOpenToogle: 'This activity is always available and can be performed at any time.',
      closeDateToogle: 'Deadline for teacher corrections',
      closeDate: 'Closing date',
      messageToStudentsToogle: 'Notify students',
      messageToStudents: 'Message to the students',
      showCurriculumToogle: 'Show curriculum',
      content: 'Content',
      objectives: 'Custom Objectives',
      assessmentCriteria: 'Assessment criteria',
      submit: 'Assign',
      add: 'Add',
      assignTo: {
        class: 'Class',
        customGroups: 'Custom Groups',
        session: 'Session',
      },
      relations: {
        toggle: 'Establish relation with another activity',
        before: 'Previous activity',
        required: 'Required dependency',
      },
      selectStudentsTitle: 'Who will perform the activity?',
      excludeStudents: 'Exclude students',
      showResults: 'Hide results report',
      showCorrectAnswers: 'Hide solutions for students',
      addNewClassStudents: 'Automatically assign to newly enrolled students',
      clearStudents: 'Clear students',
      subjects: {
        nonCalificableTitle:
          'Select at least one of your subjects to see the different available groups',
        calificableTitle: 'Subjects to be evaluated in this activity',
        subtitle: 'NOTE: At least one of them',
      },
      unableToAssignStudentsMessage:
        'The students which are not enrolled in all the selected subjects will not be assigned',
      matchingStudents: 'Matching students',
      groupName: 'Name of group',
      students: 'Students',
      noStudentsToAssign:
        'There are no students enrolled in the selected subjects, please select other combination',
      showToStudents: 'Hide group name from students',
      required: 'Required field',
    },
    placeholders: {
      date: 'dd/mm/yyyy',
      time: 'hh:mm',
      units: 'units',
    },
    descriptions: {
      messageToStudents:
        'Send notification message to perform the activity. A custom message can be added.',
      visualizationDate:
        'NOTE: The activity will be available for review, but cannot be completed until the start date.',
      closeDateToogle: 'NOTE: After this date, no corrections can be made',
      limitedExecution:
        'NOTE: This is the time interval that begins after the activity statement is reviewed and ends at the submission of the activity.',
      isAllDay:
        'NOTE: Students will have until 23:59h to submit, but will see the deadline as a daily event in their calendar.',
    },
    assignTo: {
      student: 'Student',
      class: 'Class',
    },
    modes: {
      individual: 'Individual',
      pairs: 'In pairs',
      groups: 'Teams',
    },
    timeUnits: {
      hours: 'hours',
      minutes: 'minutes',
      days: 'days',
    },
    gradeVariations: {
      title: 'Type of activity',
      calificable: {
        label: 'Qualifying',
        description:
          'The score will be taken into account for the final grade, comments are welcome',
      },
      punctuationEvaluable: {
        label: 'Assessable with score',
        description:
          'A score is requested but it will not be taken into account for the final grade, comments are welcome',
      },
      evaluable: {
        label: 'Assessable without score',
        description: 'Only comments are returned',
      },
      notEvaluable: {
        label: 'No assessment',
        description: 'The student does not receive any feedback',
      },
    },
  },
  activity_deadline_header: {
    noDeadline: 'No deadline',
    deadline: 'Deadline',
    deadlineExtraTime: 'Add extra time',
    closeTask: 'Close activity',
    save: 'Save',
    cancel: 'Cancel',
    archiveTask: 'Archive activity',
  },
  activity_dashboard: {
    closeAction: {
      verbs: {
        opening: 'opening',
        opened: 'opened',
        closing: 'closing',
        closed: 'closed',
      },
      messages: {
        success: 'Activity {{verb}}',
        error: 'Error {{verb}} activity: {{error}}',
      },
    },
    deadline: {
      messages: {
        success: 'Activity deadline updated',
        error: 'Error updating activity deadline: {{error}}',
      },
    },
    labels: {
      graphs: {
        status: 'Status summary',
        grades: 'Grades summary',
      },
      studentList: {
        studentsCount: 'Students {{count}}',
        search: 'Search student',
        student: 'Student',
        status: 'Status',
        completed: 'Completed',
        avg: 'Avg. time',
        score: 'Score',
      },
    },
    archiveAction: {
      verbs: {
        archiving: 'Archiving',
        archived: 'Archived',
        unarchiving: 'Unarchiving',
        unarchived: 'Unarchived',
      },
      messages: {
        success: 'Activity {{verb}}',
        error: 'Error {{verb}} Activity: {{error}}',
      },
    },
    archiveModal: {
      title: 'There are students not evaluated yet',
      message1: 'The are some students who have not been evaluated yet.',
      message2: 'After archiving this activity, you can add the scores in the notebook.',
      confirm: 'Accept and archive',
      cancel: 'Cancel',
    },
  },
  studentsList: {
    labels: {
      students: 'Students',
      assignStudent: 'Assign student',
      bulkActions: {
        label: 'Actions',
        SEND_REMINDER: 'Send reminder',
      },
      rememberModal: {
        title: 'Send reminder to students that:',
        notOpen: 'They have not opened the activity',
        notEnd: 'They have not finished the activity',
        send: 'Send',
        sended: 'Reminder sent',
      },
      studentListcolumns: {
        student: 'Student',
        status: 'Status',
        completed: 'Completed',
        avgTime: 'Avg. time',
        score: 'Score',
        unreadMessages: 'Messages',
        sendReminder: 'Send reminder',
      },
    },
    placeholders: {
      bulkActions: 'Select an action',
      searchStudent: 'Search student',
    },
    descriptions: {
      searchStudent: 'selected',
    },
  },
  activity_status: {
    late: 'Late',
    completed: 'Completed',
    ongoing: 'Ongoing',
    opened: 'Opened',
    notOpened: 'Not opened',
    assigned: 'Scheduled',
    notStarted: 'Not started',
    started: 'Started',
    closed: 'Closed',
    evaluated: 'Evaluated',
    submitted: 'Submitted',
    ended: 'Finished',
    notSubmitted: 'Not submitted',
    noLimit: 'No time limit',
  },
  teacher_actions: {
    sendReminder: 'Send reminder',
    evaluate: 'Evaluate',
    review: 'Review',
    reminderSended: 'Reminder sent',
  },
  levelsOfDifficulty: {
    beginner: 'Beginner',
    elementary: 'Elementary',
    lowerIntermediate: 'Lower Intermediate',
    intermediate: 'Intermediate',
    upperIntermediate: 'Upper Intermediate',
    advanced: 'Advanced',
  },
  assignment_list: {
    teacher: {
      activity: 'Activity/Module',
      subject: 'Subject, group and students',
      students: 'Students',
      start: 'Start',
      deadline: 'Deadline',
      status: 'Status',
      completions: 'Completions',
      evaluated: 'Evaluated',
      messages: 'Messages',
    },
    student: {
      activity: 'Activity/Module',
      subject: 'Subject and group',
      start: 'Start',
      deadline: 'Deadline',
      status: 'Status',
      progress: 'Progress',
      messages: 'Messages',
    },
  },
  multiSubject: 'Multi-subject',
  activities_filters: {
    ongoing: 'Ongoing {{count}}',
    evaluated: 'Evaluated {{count}}',
    history: 'History {{count}}',
    search: 'Search activities in progress',
    subject: 'Subject',
    status: 'Status',
    progress: 'Progress',
    type: 'Type',
    sort: 'Orden',
    seeAll: 'See all',
  },
  sortTypes: {
    assignation: 'Assignation',
    start: 'Start date',
    deadline: 'Deadline',
  },
  activities_list: {
    emptyState: 'There are no activities yet',
  },
  ongoing: {
    ongoing: 'Ongoing activities',
    history: 'History',
    activities: 'Activities',
  },
  dates: {
    visualization: 'Visualization',
    start: 'Start',
    deadline: 'Deadline',
    close: 'Close',
    closed: 'Closed',
  },
  need_your_attention: {
    title: 'Needs attention',
    new: 'New',
    emptyState: 'There are no scheduled activities',
    assigment: {
      subject: 'Subject',
      submission: 'Submissions',
      avgTime: 'Avg. time',
      grade: 'Score',
      score: 'Correct answers',
      activityType: 'Activity type',
    },
  },
  pagination: {
    show: 'Show',
    goTo: 'Go to',
  },
  student_actions: {
    continue: 'Continue',
    start: 'Start',
    view: 'View',
    notSubmitted: 'Not submitted',
    correction: 'Correction',
    review: 'Review',
    disabled: {
      results: 'The results have been hidden by your teacher',
      previous: 'The previous activity must be completed first',
    },
  },
  assetListFilters: {
    program: 'Program...',
    subject: 'Subject...',
    allPrograms: 'All the programs',
    allSubjects: 'All the subjects',
    subectGroups: {
      mySubjects: 'My subjects',
      collaborations: 'Collaborations',
    },
  },
};
