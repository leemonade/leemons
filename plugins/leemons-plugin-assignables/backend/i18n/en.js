module.exports = {
  userNavigator: {
    student: 'Student',
    multiSubject: 'Multi-subject',
  },
  assignmentForm: {
    steps: {
      assignation: 'Assignation',
      action: 'Assign',
    },
    subjects: {
      placeholder: 'Select...',
      program: 'Program',
      course: 'Course',
      subject: 'Subject',
      title: 'Subjects',
      subjectInput: {
        label: 'Subjects',
        placeholder: 'Type the subject names',
        error: 'Pick at least one subject',
      },
      add: 'Add',

      programChangeModal: {
        title: 'Are you sure you want to change the program?',
        description: 'This will clean the subjects selection',
      },
    },
    groups: {
      title: 'Students',
      subtitle: 'Select the group of students',
      options: {
        class: 'Existing class',
        customGroup: 'Custom group',
        singleStudent: 'Single student',
      },
      noStudentsError:
        'No student was found for the selected subjects. Add or remove subjects to continue.',
      classSelectLabel: 'Class selection type',
      class: {
        studentsCount: 'matching students',
        autoAssignStudents: 'Auto-assign new students',
        excludeStudents: 'Exclude specific students',
        error: 'Pick at least one group',
        notAllStudentsAssigned: "Some students won't be included in the activity",
        excludeStudentsInput: {
          label: 'Students',
          placeholder: 'Type the excluded students',
        },
        total: 'Total',
        selectedStudents: 'Selected students',
        nonMatchingStudents: 'Non matching',
        excluded: 'Manually excluded',
      },
      customGroup: {
        studentsInput: {
          label: 'Add participants',
          placeholder: 'Type the group students',
          error: 'Add at least one student',
        },
        groupName: {
          label: 'Group name',
          placeholder: 'Type the name',
          error: 'The name is required',
        },
        hideCustomName: 'Show to students',
      },
      singleStudent: {
        studentInput: {
          label: 'Select student',
          placeholder: 'Add a student',
        },
      },
    },
    dates: {
      title: 'Completion deadline',
      optionsInput: {
        label: 'Timespan',
        options: {
          alwaysAvailable: 'Anytime',
          fixed: 'Timespan',
          session: 'Live session',
        },
      },
      hideFromCalendar: 'Hide from calendar until start/deadline',
      maxTime: 'Set execution max time',
      maxTimeInput: {
        label: 'Execution time',
      },

      fixedType: {
        title: {
          fixed: 'Set up timespan',
          session: 'Setup live session',
        },
        startDate: {
          label: 'Start date',
          placeholder: 'Select date',
          error: 'Pick a start date',
        },
        deadline: {
          label: 'Deadline',
          placeholder: 'Select date',
          error: 'Pick a deadline',
        },
        bothDatesError: 'Pick a start date and deadline',
      },
    },
    instructions: {
      title: 'Instructions',
      description: 'Instructions for the consult of content',
      editor: {
        placeholder: 'You can specify the best way to consult this content...',
      },
    },
    evaluation: {
      title: 'Evaluation',
      description:
        'All types of evaluations have the possibility to include comments (except the non-evaluatable)',
      typeInput: {
        label: 'Type',
        options: {
          nonEvaluable: 'No evaluable',
          calificable: 'Gradable',
          punctuable: 'Punctuable',
          feedbackOnly: 'Feedback only',
          feedback: 'Feedback',
          feedbackAvailable: 'Feedback available',
        },
      },
      showCurriculum: 'Show curriculum',
      assignationHeaderButton: 'View assignation',
    },
    others: {
      title: 'Other options',
      teacherDeadline: 'Add deadline for teacher correction',
      teacherDeadlineInput: {
        label: 'Deadline',
        placeholder: 'Type the date',
        error: 'Pick a date',
      },
      notifyStudents: 'Notify students by email',
      createComunicaRooms: 'Create a chat room for this activity',
      messageForStudents: 'Write the email',
      notifyPlaceholder: 'Add the statement text here',
      hideResponses: 'Hide the answers of the activity once it is finished.',
      hideReport: 'Hide the results report.',
    },
    buttons: {
      assign: 'Assign',
      next: 'Next',
      previous: 'Previous',
      save: 'Save', // Used on modules assignation drawer
      cancel: 'Cancel',
    },
    presentation: {
      title: 'Presentation',
      titleInput: {
        label: 'Title',
        placeholder: 'Type the title',
      },
      thumbnail: 'Thumbnail',
    },
    preview: {
      title: 'Preview',
    },
  },
  activity_deadline_header: {
    noDeadline: 'No deadline',
    deadline: 'Deadline',
    deadlineExtraTime: 'Add time',
    closeTask: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    archiveTask: 'Archive',
    period: 'Period type',
    startDate: 'Start date',
    startHour: 'Start hour',
    endDate: 'End date',
    endHour: 'End hour',
    closedPeriod: 'Closed period',
    liveSession: 'Live session',
    openPeriod: 'Open period',
    liveSessionData: 'Date',
  },
  activity_dashboard: {
    progress: 'Progress',
    evaluation: 'Evaluation',
    students: 'Students',
    califications: 'Califications',
    passed: 'Pass',
    close: 'Close',
    opened: 'Opened',
    archive: 'Archive',
    unarchive: 'Unarchive',
    delete: 'Delete',
    chatButton: 'Chat',
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
    start: {
      messages: {
        success: 'Activity start date updated',
        error: 'Error updating activity start date: {{error}}',
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
        progress: 'Progress',
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
    deleteAction: {
      success: 'Activity deleted',
      error: 'Error deleting activity: {{error}}',
    },
    deleteModal: {
      title: 'Are you sure you want to delete this activity?',
      message1: 'This action cannot be undone.',
      message2: 'All the information related to this activity will be deleted.',
      confirm: 'Accept and delete',
      cancel: 'Cancel',
    },
    closeModal: {
      title: 'Close activity',
      message1: 'Are you sure you want to close the activity?',
      message2: 'Students will not be able to send new responses once the activity is closed.',
      confirm: 'Close activity',
      cancel: 'Cancel',
    },
    closeActionAlerts: {
      success: 'Activity closed',
      error: 'Error closing activity: {{error}}',
    },
    archiveActionAlerts: {
      success: 'Activity archived successfully',
      error: 'Error archiving activity: {{error}}',
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
        student: 'Students',
        progress: 'Progress',
        avgTime: 'Average time',
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
    opened: 'Open',
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
    blocked: 'Blocked',
    archived: 'Archived',
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
      activity: 'Activity',
      subject: 'Group',
      students: 'Students',
      deadline: 'Deadline',
      status: 'Status',
      completions: 'Completions',
      evaluated: 'Evaluated',
      messages: 'Messages',
    },
    student: {
      activity: 'Activity',
      subject: 'Group',
      deadline: 'Deadline',
      status: 'Status',
      progress: 'Progress',
      messages: 'Messages',
    },
  },
  multiSubject: 'Multi-subject',
  customObjectives: 'Custom objectives',
  activities_filters: {
    ongoing: 'Ongoing {{count}}',
    evaluated: 'Evaluated {{count}}',
    history: 'Archived {{count}}',
    search: 'Search activities in progress',
    subject: 'Subject',
    status: 'Status',
    progress: 'Progress',
    type: 'Type',
    sort: 'Orden',
    seeAll: 'See all',
    seeAllActivities: 'See all activities',
  },
  sortTypes: {
    assignation: 'Assignation',
    start: 'Start date',
    deadline: 'Deadline',
  },
  activities_list: {
    emptyState: 'There are no activities yet',
    blocked: 'The selected activity is blocked',
    nonEvaluable: 'The selected activity is no evaluable and have already been finished',
  },
  ongoing: {
    ongoing: 'Ongoing activities',
    history: 'History',
    activities: 'Activities',
    pendingActivities: 'Activities to evaluate',
  },
  dates: {
    visualization: 'Visualization',
    start: 'Start',
    deadline: 'Deadline',
    close: 'Close',
    closed: 'Closed',
    teacherDeadline: 'Correction deadline',
  },
  need_your_attention: {
    activitiesTitle: 'Pending activities',
    evaluationsTitle: 'Pending evaluations',
    ownEvaluations: 'My evaluations',
    new: 'New',
    activitiesEmptyState: 'There are no pending activities',
    evaluationsEmptyState: 'There are no pending evaluations',
    seeAllActivities: 'See all the activities',
    seeAllEvaluations: 'See all the evaluations',
    links: {
      academy: 'https://www.leemons.io/leemons-academy',
      library: 'https://www.leemons.io/academy-post/the-amazing-leemons-library',
    },
    assigment: {
      subject: 'Subject',
      submission: 'Submissions',
      avgTime: 'Avg. time',
      grade: 'Score',
      score: 'Correct answers',
      activityType: 'Activity type',
    },
    deadline: {
      opened: 'Opened',
      programmed: 'Programmed',
      daysRemaining: '{{count}} days remaining',
      hoursRemaining: '{{count}} hours remaining',
      late: 'Late',
      noDeadline: 'No deadline',
    },
    status: {
      evaluated: 'See evaluation',
      submission: 'Submission',
      evaluate: 'To evaluate',
      evaluation: 'Evaluation',
      opened: 'Activity opened',
      start: 'Start date',
      assigned: 'Scheduled',
      late: 'Late',
      submitted: 'Submitted',
      startActivity: 'Start activity',
    },
    emptyState: {
      title: 'You have everything on track!',
      greetingWelcome: 'Welcome, {{name}}!',
      noEvaluations: 'No pending evaluations',
      noActivities: 'No pending activities',
    },
    welcome: {
      title: 'Welcome!',
      teacher: {
        title: 'There is no information to show here yet',
        description1:
          'In this dashboard, you will soon find information about the activities and tasks you have assigned to your students, the planning calendar, or your agile task manager.',
        description2: 'Meanwhile, to get started, we recommend the following actions:',
        helpCenter: {
          title: 'Visit the help center',
          description:
            'At Leemons Academy, you will find useful information to make the most of the platform.',
          cta: 'Leemons Academy',
        },
        leebrary: {
          title: 'Upload resources',
          description:
            'In the Leemons Library you can upload content and create materials and activities for your classes.',
          cta: 'Leemons Library',
        },
        comunica: {
          title: 'Say “Hello”',
          description:
            'Below you have a green balloon, click it to open Comunica, and greet your students in the chat.',
        },
      },
      student: {
        title: 'There is no information to show here yet',
        description1:
          'In this dashboard, you will soon find information about the activities and tasks assigned to you by your teachers, your delivery calendar, or your agile task manager.',
        description2: 'Meanwhile, to get started, we recommend the following actions:',
        helpCenter: {
          title: 'Complete your profile',
          description: 'Review your profile information and make sure everything is correct.',
        },
        comunica: {
          title: 'Say “Hello”',
          description:
            'Below you have a green balloon, click it to open Comunica, and greet your classmates and teachers in the chat.',
        },
      },
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
    programLabel: 'Program',
    subjectLabel: 'Subjects',
    program: 'Program...',
    subject: 'Subject...',
    allPrograms: 'All programs',
    allSubjects: 'All subjects',
    subectGroups: {
      mySubjects: 'My subjects',
      collaborations: 'Collaborations',
    },
  },

  evaluation: {
    timeoutAlert: {
      title: 'Maximum time reached',
      message:
        'The time limit set for this activity has been reached. The last delivery or questions answered have been sent automatically.',
    },
    submitted_alert: {
      title: 'Activity submitted successfully',
      message: 'Here you have more information about your activity',
    },
    pending_evaluation_alert: {
      title: 'Pending evaluation.',
      message: 'When the teacher evaluates your activity, you will receive a notification',
    },
    not_submitted_alert: {
      title: 'Activity not submitted',
    },
    finished_alert: {
      title: 'Activity finished',
    },
    goToModuleDashboard: 'Go back to dashboard',
  },
  evaluationFeedbackComponent: {
    contactTeacher: 'Chat with my teacher',
    contactStudent: 'Chat with the student',
    feedback: 'Feedback',
  },
  progress: {
    tabTitle: 'Progress',
    dashboardTitle: {
      main: {
        student: 'My progress',
        teacher: 'Course average grades',
      },
      subject: {
        student: 'Subject grades',
        teacher: 'Average grades in the subject',
      },
      module: {
        student: 'Module grades',
        teacher: 'Average grades in the module',
      },
    },
    average: 'Average',
    pass: 'Approved',
    approved: 'Acquired knowledge',
    notApproved: 'Knowledge to acquire',
    inProgress: 'In progress',
  },
  evaluationTable: {
    title: 'Evaluation',
    weighting: 'Weighting',
    seeNonGradable: 'See non-gradable',
    columns: {
      activity: 'Activity',
      module: 'Module',
      activities: 'Activities',
      weight: 'Weight',
      evaluation: 'Evaluation',
      feedback: 'Qualitative feedback ',
    },
  },
  activityNotStarted: {
    activityUnavailable: 'Activity unavailable',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
    activityNotStarted:
      'This activity is not available yet. You will be able to access it and complete it from {date} at {time}.',
    activityBlocked: 'This activity is blocked by a previous activity in the module.',
    willSendMail: 'You will receive an email when the execution period opens.',
    checkBackLater: 'Please check back later to start.',
  },
};
