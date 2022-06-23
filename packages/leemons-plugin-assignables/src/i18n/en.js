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
      closeDate: 'Close date',
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
      subjects: {
        title: 'Subjects to be evaluated in this activity',
        subtitle: 'NOTE: At least one of them',
      },
      unableToAssignStudentsMessage:
        'The students which are not enrolled in all the selected subjects will not be assigned',
      matchingStudents: 'matching students',
      groupName: "Group's name",
      students: 'Students',
      noStudentsToAssign:
        'There are no students enrrolled in the selected subjects, please select other combination',
      showToStudents: 'Ocultar nombre del grupo a los estudiantes',
      required: 'Campo requerido',
    },
    placeholders: {
      date: 'dd/mm/yyyy',
      time: 'hh:mm',
      units: 'units',
    },
    descriptions: {
      messageToStudents:
        'If you assign this activity to other groups in this step, this message will be the default message for all activities (although you can change it individually if you wish).',
      visualizationDate:
        'NOTE: The activity will be available for review, but cannot be completed until the start date.',
      closeDateToogle: 'NOTE: After this date, no corrections can be made',
      limitedExecution:
        'NOTE: This is the time interval after reviewing the activity summary until the submission of the deliverable.',
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
      title: 'Tipo de actividad',
      calificable: {
        label: 'Calificable',
        description:
          'La puntuación será tenida en cuenta para la nota final, se admiten comentarios',
      },
      punctuationEvaluable: {
        label: 'Evaluable con puntuación',
        description:
          'Se pide una puntuación pero no serña tenida en cuenta para la nota final, se admiten comentarios',
      },
      evaluable: {
        label: 'Evaluable sin puntuación',
        description: 'Solo se devuelven comentarios',
      },
      notEvaluable: {
        label: 'No evaluable',
        description: 'El alumno no recibe ninguna retro-alimentación',
      },
    },
  },
  activity_deadline_header: {
    deadline: 'Deadline',
    deadlineExtraTime: 'Add extra time',
    closeTask: 'Close activity',
    save: 'Save',
    cancel: 'Cancel',
    archiveTask: 'Archivar actividad',
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
        archiving: 'Archivando',
        archived: 'Archivada',
        unarchiving: 'Desarchivando',
        unarchived: 'Desarchivada',
      },
      messages: {
        success: 'Actividad {{verb}}',
        error: 'Error {{verb}} actividad: {{error}}',
      },
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
    assigned: 'Programada',
    started: 'Empezada',
    closed: 'Cerrada',
    evaluated: 'Evaluada',
    submitted: 'Entregada',
    notSubmitted: 'No entregada',
    noLimit: 'Sin límite de tiempo',
  },
  teacher_actions: {
    sendReminder: 'Send reminder',
    evaluate: 'Evaluate',
    review: 'Revisar',
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
    },
    student: {
      task: 'Task',
      subject: 'Subject',
      start: 'Start date',
      deadline: 'Due date',
      status: 'Status',
      timeReference: 'Time reference',
      submission: 'Entrega',
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
    title: 'Need your attention',
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
    continue: 'Continuar',
    start: 'Empezar',
    view: 'Ver',
    notSubmitted: 'No entregado',
    correction: 'Revisar',
    review: 'Revisar',
  },
};
