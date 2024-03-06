module.exports = {
  tableInput: {
    add: 'Add',
    remove: 'Remove',
    edit: 'Edit',
    accept: 'Accept',
    cancel: 'Cancel',
    required: 'Required field',
    actions: 'Actions',
  },
  methodology: {
    directInstruction: 'Direct Instruction',
    flippedClassroom: 'Flipped Classroom',
    projectBasedLearning: 'Project-Based Learning',
    inquiryBasedLearning: 'Inquiry-Based Learning',
    expeditionaryLearning: 'Expeditionary Learning',
    cooperativeLearning: 'Cooperative Learning',
    personalizedLearning: 'Personalized Learning',
    gameBasedLearning: 'Game-Based Learning',
    kinestheticLearning: 'Kinesthetic Learning',
    differentiatedInstruction: 'Differentiated Instruction',
    other: 'Other',
  },
  welcome_page: {
    page_title: 'Tasks',
    page_description:
      'Thanks to the tasks module you can create new tasks, assign them to groups of students or individuals, monitor their current status and start evaluations of completed tasks.',
    hide_info_label:
      "Ok, I've got it. When the configuration is complete, don't show this info anymore",
    step_profiles: {
      title: 'Link profiles',
      description: 'Identify which profiles match the teachers and students',
      btn: 'Link profiles',
    },
    step_library: {
      title: 'Tasks Library',
      description:
        'Create new tasks and assign them or review the created tasks in the task library.',
      btn: 'Create task',
    },
    step_ongoing: {
      title: 'Ongoing tasks',
      description:
        'Reviews tasks in progress and monitors their status. It is also possible to start the correction of completed tasks.',
      btn: 'View ongoing tasks',
    },
    step_history: {
      title: 'History',
      description: "View completed tasks, their evaluations, and the student's feedback.",
      btn: 'View tasks history',
    },
  },
  library_page: {
    page_title: 'Task Library',
    published: 'Published',
    draft: 'Draft',
  },
  task_setup_page: {
    title: 'New task',
    subTitle: 'Task title',
    edit_title: 'Edit task',
    cancel: 'Cancel',
    common: {
      select_center: 'Select center',
      create_done: 'Task created',
      update_done: 'Task updated',
      publish_done: 'Task published',
      no_id_error: 'No task ID provided',
      save: 'Save draft',
      publish: 'Publish',
      finish: 'Finish',
    },
    setup: {
      basicData: {
        step_label: 'Basic',
        labels: {
          name: 'Name',
          tagline: 'Tagline',
          description: 'Summary',
          buttonNext: 'Next',
        },
        placeholders: {
          name: 'Task name',
          tagline: 'Subtitle of the task',
          description: 'What is this assignment about?',
        },
        errorMessages: {
          name: {
            required: 'Required field',
          },
        },
      },
      configData: {
        step_label: 'Configure',
        labels: {
          configTitle: 'Configure',
          center: 'Center',
          program: 'Program',
          course: 'Course',
          subjectsTitle: 'Subjects',
          subject: 'Subject',
          addSubject: 'Add subject',
          level: 'Level',
          levelValues: {
            begginer: 'Beginner',
            intermediate: 'Intermediate',
          },
          buttonNext: 'Next',
          buttonPrev: 'Previous',
          preTask: {
            toggler: 'Add a pre-task activity',
            mandatory: 'Mandatory to start the Task',
            condition: 'Condition to start the Task',
            conditions: {
              take: 'Only take the test',
              greater: 'Pass the test with a score higher than',
            },
          },
          title: 'Configuration',
          subjects: 'Subjects',
          showOtherSubjects: 'Add subjects I collaborate in',
        },
        placeholders: {
          center: 'Select...',
          program: 'Select...',
          course: 'Select...',
          subject: 'Select...',
          level: 'Select...',
          addSubject: 'Add subject',
        },
        errorMessages: {
          program: {
            required: 'Required field',
          },
          course: {
            required: 'Required field',
          },
          subjects: {
            required: 'Required field',
          },
          level: {
            required: 'Required field',
          },
          summary: {
            required: 'Required field',
          },
          subject: {
            required: 'Required field',
          },
        },
      },
      contentData: {
        step_label: 'Content',
        labels: {
          title: 'Content',
          subjects: 'Subjects',
          methodology: 'Methodology',
          statement: 'Statement',
          development: 'Development',
          statementAndDevelopmentTitle: 'Statement and development',
          content: 'Content',
          evaluation: 'Evaluation',
          other: 'Other',
          addCustomObjectives: 'Add custom objectives',
          enableCurriculum: 'Enable Curriculum',
          addInstructions: 'Add instructions',
          addResources: 'Add resources',
          buttonNext: 'Next',
          buttonPrev: 'Previous',
          submission: {
            title: 'Submissions',
            gradable: 'Gradable',
            checkDescription: 'This task requires the submission of a file, document or link.',
            type: 'Type of submission',
            types: {
              file: 'File',
              link: 'Link',
            },
            description: 'Description',
            FileType: {
              multiFile: 'Allow multiple files',
              format: 'File format',
              formatPlaceholder: 'Write extension and add (pdf, xls, doc...)',
              maxSize: 'Max size',
              required: 'Required field',
            },
          },

          supportImage: 'Support image',
        },
        errorMessages: {
          statement: {
            required: 'Required field',
          },
        },
      },
      instructionData: {
        step_label: 'Resources and Instructions',
        labels: {
          title: 'Instructions',
          forTeacher: 'Instructions for Teacher',
          forStudent: 'Instructions for Student',
          recommendedDuration: 'Recommended duration',
          buttonPublish: 'Only publish',
          buttonPublishAndAssign: 'Publish and assign',
          buttonPrev: 'Previous',
          attachmentsTitle: 'Resources',
          searchFromLibrary: 'Search in library',
          searchFromLibraryDocsAndMedia: 'Add documents and media',
          addResource: 'Add resource',
          resourceLastUpdate: 'Last update',
        },
        placeholders: {
          forTeacher: 'Help other teachers approach this exercise with a few simple instructions.',
          forStudent:
            'Here it is possible to include extra information to help the student perform the exercise better.',
        },
      },
      evaluationData: {
        step_label: 'Evaluation',
        labels: {
          title: 'Evaluation',
          buttonNext: 'Next',
          buttonPrev: 'Previous',
          buttonPublish: 'Only publish',
          buttonPublishAndAssign: 'Publish and assign',
          objectives: 'Custom objectives',
          curriculum: 'Curriculum',
          add: 'Add objective',
          numberHeader: 'Nº',
          objectiveHeader: 'Objective',
          assessmentCriteria: 'Assessment criteria',
          subjects: 'Asignaturas',
          inputLabel: 'Enter custom objective',
          inputPlaceholder: 'Objective...',
        },
      },
      publishData: {
        step_label: 'Publish',
        labels: {
          title: 'Publish & Assign',
          description:
            'You can now save this activity in your library to use it whenever you want or, in the same step, assign it for your students to do.',
          assign: 'Assign later to students',
          buttonNext: 'Publish',
          buttonPrev: 'Previous',
        },
      },
    },
  },
  assignment_page: {
    action: 'Assign task',
  },
  assignment_form: {
    labels: {
      classroomToAssign: 'Assign to classroom',
      studentToAssign: 'Assign to Student',
      mode: 'Mode',
      startDate: 'Start date',
      deadline: 'Deadline',
      visualizationDateToogle: 'Make visible in advance',
      visualizationDate: 'Visualization date',
      limitedExecutionToogle: 'Limit execution time',
      limitedExecution: 'Limited execution time',
      alwaysOpenToogle: 'This task is always available and can be performed at any time.',
      closeDateToogle: 'Deadline for teacher corrections',
      closeDate: 'Close date',
      messageToStudentsToogle: 'Add a message to the students',
      messageToStudents: 'Message to the students',
      showCurriculumToogle: 'Show curriculum',
      content: 'Content',
      objectives: 'Objectives',
      assessmentCriteria: 'Assessment criteria',
      submit: 'Assign',
      add: 'Add',
      assignTo: {
        class: 'Class',
        customGroups: 'Custom Groups',
        session: 'Session',
      },
      selectStudentsTitle: 'Who will perform the task?',
      excludeStudents: 'Exclude students',
      subjects: {
        title: 'Subjects to be evaluated in this task',
        subtitle: 'NOTE: At least one of them',
      },
      unableToAssignStudentsMessage:
        'The students which are not enrolled in all the selected subjects will not be assigned',
      matchingStudents: 'matching students',
      groupName: 'Group name',
      students: 'Students',
      noStudentsToAssign:
        'There are no students enrrolled in the selected subjects, please select other combination',
    },
    placeholders: {
      date: 'dd/mm/yyyy',
      time: 'hh:mm',
      units: 'units',
    },
    descriptions: {
      messageToStudents:
        'If this task is assigned to other groups in this step, this message will be the default message for all tasks (although it can be changed individually if desired).',
      visualizationDate:
        'NOTE: The task will be available for review, but cannot be completed until the start date.',
      closeDateToogle: 'NOTE: After this date, no corrections can be made',
      limitedExecution:
        'NOTE: This is the time interval after reviewing the task summary until the submission of the deliverable.',
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
  },
  profiles_page: {
    page_title: 'Tasks - Profile setup',
    page_description:
      'First of all it is necessary to match the system profiles with the custom profiles that have been created on the platform (Please carefully read the characteristics of each profile. Once the profiles are linked, it cannot be undone.)',
    save: 'Save',
    loadFromAP: 'Load profiles from Academic Portfolio',
    profileSaved: 'Saved profiles',
    profiles: 'Profiles',
    teacher: 'Teacher',
    teacherDescription: 'Responsible for the creation and assignment of tasks',
    teacherRequired: 'Field required',
    student: 'Student',
    studentDescription: 'Will be assigned the tasks and will be responsible for executing them',
    studentRequired: 'Field required',
  },
  ongoing_page: {
    page_title: 'Ongoing tasks',
  },
  history_page: {
    page_title: 'History',
  },
  teacher_assignments: {
    table: {
      headers: {
        group: 'Group',
        task: 'Task',
        deadline: 'Deadline',
        students: 'Students',
        status: 'Status',
        open: 'Open',
        ongoing: 'Ongoing',
        completed: 'Completed',
        actions: 'Actions',
      },
    },
  },
  tabStudentTasks: {
    label: 'Task & Activities',
  },
  cardMenu: {
    view: 'View',
    edit: 'Edit',
    assign: 'Assign',
    delete: 'Delete',
    duplicate: 'Duplicate',
    pin: 'Mark as favorite',
    unpin: 'Unmark as favorite',
    share: 'Share',
  },
  variant: 'Task',
  expressVariant: 'Express Task',
  deliverables: 'Deliverables',
  yes: 'Yes',
  no: 'No',
  statementTitle: 'Statement',
  viewMore: 'View more',
  viewLess: 'View less',
  task_realization: {
    steps: {
      introduction: 'Introduction',
      development: 'Development',
      submission: 'Submission',
    },
    introduction_step: {
      statement: 'Statement',
      resources: 'Resources',

      not_opened: {
        title: 'Activity not available',
        description: 'This activity will be available on {date} at {time}.',
      },
    },
    development_step: {
      instructions: 'Instructions',
      development: 'Development',
    },
    buttons: {
      previous: 'Previous',
      next: 'Next',
      finish: 'Finish',
      submit: 'Submit',
      save: 'Save',
      nextActivity: 'Next activity',
      goToModule: 'Module dashboard',
    },
    submission_step: {
      instructions: 'Instructions',

      notfinished_title: 'Activity not finished',
      notfinished_message:
        'Remember to submit the assignment by clicking on the submit button at the bottom.',
    },

    submission_file: {
      title: 'Format and valid size',
      format: 'Format',
      size: 'Size',
      upload_title: 'Click to upload a new file',
      upload_subtitle: 'or drag and drop here',
      errorAlert: `Error uploading file {fileName}: {error}`,
    },
    submission_link: {
      title: 'Link',
      label: 'Link',
      placeholder: 'Enter link...',
    },

    confirmation_modal: {
      title: 'Tasks finished',
      description: 'Your task has been successfuly submitted',
      action: 'Ongoing activities',
      goToModule: 'Module dashboard',
      nextActivity: 'Next activity',
    },
    timeout_modal: {
      title: 'The given time to finish this activity have finished.',
      description:
        'If you have saved the submission previously, it will be sended, in other case, no submission was made.\nYou can review your submission by clicking on "Review submission"',
      action: 'Review submission',
      nextActivity: 'Next activity',
    },
    activityContainer: {
      deadline: {
        label: 'Submission',
      },
    },

    sidebar: {
      resources: 'Resources',
      team: 'Your team',
    },

    statement_step: {
      statement: 'Statement',
      presentation: 'Presentation',
      curriculum: {
        title: 'Curriculum',
        content: 'Content',
        objectives: 'Custom objectives',
        assessmentCriteria: 'Assessment criteria',
      },
    },

    limitedTimeAlert: {
      beforeStart: 'Before beginning',
      noTimeLimit: 'Without time limit',
      withoutPause: 'Non-stop',
      howItWorks: 'How it works?',
      limitedTimeTitle: 'Time limit',
      limitedTime:
        'Once you start, you have {{time}} to finish this task, you must submit it before this time ends.',
      pauseTitle: "The task can't be paused",
      pause:
        'If you leave the app with the task in process, this task will be finished and the last submission will be sent automatically before the interruption. If the system detects an error and you are expelled from the task, you can notify it and if your error is verified you can repeat it.',
      closedTaskFirstLine: 'This activity is in "only read" mode.',
      closedTaskSecondLine: 'The start date for this activity is: {{time}}',
    },
  },
  task_correction: {
    student: {
      submitted_alert: {
        title: 'Activity submitted successfully',
        message: 'Here you have more information about your activity',
      },
      pending_evaluation_alert: {
        title: 'Pending evaluation.',
        message: 'When the teacher evaluates your activity, you will receive a notification',
      },

      submission: 'Submission',
      activity_summary: 'Activity summary',
      statement: 'Statement',
      curriculum: 'Curriculum',
      development: 'Development',
    },
    teacher: {
      evaluation: 'Evaluation',
      student: 'Student',
      submission: 'Submission',
      score_label: 'Grade',
      score_placeholder: 'Select a grade',
      add_feedback: 'Add feedback to the student about his performance in this activity',
      comunica: 'Chat with the student',
      publish: 'Save and send feedback',
      publish_success: 'Evaluation sent to student',
    },

    chatDescription: 'Do you have any questions about this evaluation?',
    chatTeacherDescription: 'Would you like to write a comment?',
    chatButtonStudent: 'Write to your student',
    chatButtonTeacher: 'Write to your teacher',
    punctuation: 'Punctuation',
    minToPromote: 'Min. to promote',
    feedbackForStudent: 'Feedback for student',
    optional: 'Optional',
    submission: {
      title: 'Submission',
      types: {
        notFound: {
          notFound: 'The submission type could not be found',
        },
        file: {
          noSubmission: 'No submission was made yet',
        },
      },
    },
    types: {
      calificable: 'Qualifiable',
      evaluable: 'Evaluate with punctuation',
      noPunctuationEvaluable: 'Evaluate without punctuation',
    },
    contactTeacher: {
      title: 'Do you want to contact the teacher?',
      button: 'Write to your teacher',
    },
    save: 'Save feedback',
    saveAndSend: 'Save and send feedback',
    saveMessage: 'The changes have been saved',
    saveAndSendMessage: 'The changes have been saved and have been sent to the student',
    saveError: 'The changes could not be saved: {{error}}',
    subjectNotCorrectedYet: ' This subject has not been corrected yet',
  },
};
