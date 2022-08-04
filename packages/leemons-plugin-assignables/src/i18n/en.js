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
      messageToStudentsToogle: 'Add a message to the students',
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
      selectStudentsTitle: 'Who will perform the activity?',
      excludeStudents: 'Exclude students',
      addNewClassStudents: 'Automatically assign to newly enrolled students',
      clearStudents: 'Clear students',
      subjects: {
        title: 'Subjects to be evaluated in this activity',
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
        'If this activity is assigned to other groups at this step, this message will be the default message for all activities (although it can be changed individually if desired).',
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
      studentListcolumns: {
        student: 'Student',
        status: 'Status',
        completed: 'Completed',
        avgTime: 'Avg. time',
        score: 'Score',
        unreadMessages: 'Messages',
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
    started: 'Started',
    closed: 'Closed',
    evaluated: 'Evaluated',
    submitted: 'Submitted',
    notSubmitted: 'Not submitted',
    noLimit: 'No time limit',
  },
  teacher_actions: {
    sendReminder: 'Send reminder',
    evaluate: 'Evaluate',
    review: 'Review',
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
      task: 'Task',
      group: 'Group',
      start: 'Start date',
      deadline: 'Due date',
      status: 'Status',
      students: 'students',
      open: 'Open',
      ongoing: 'Ongoing',
      completed: 'Completed',
      unreadMessages: 'Messages',
    },
    student: {
      task: 'Task',
      subject: 'Subject',
      start: 'Start date',
      deadline: 'Due date',
      status: 'Status',
      timeReference: 'Time reference',
      submission: 'Submission',
      unreadMessages: 'Messages',
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
    type: 'Type',
    seeAll: 'See all',
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
    assigment: {
      subject: 'Subject',
      submission: 'Submissions',
      avgTime: 'Avg. time',
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
  },
};
