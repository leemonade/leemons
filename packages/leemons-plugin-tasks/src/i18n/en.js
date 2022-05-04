module.exports = {
  tableInput: {
    add: 'Add',
    remove: 'Remove',
    edit: 'Edit',
    accept: 'Accept',
    cancel: 'Cancel',
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
    udl: 'UDL (Unified Design for Learning)',
    other: 'Other',
  },
  welcome_page: {
    page_title: 'Tasks',
    page_description:
      'Thanks to the tasks module you can create new tasks, assign them to groups of students or individuals, monitor their current status and start evaluations of completed tasks.',
    hide_info_label: `Ok, I've got it. When the configuration is complete, don't show this info anymore`,
    step_profiles: {
      title: 'Link profiles',
      description: 'Identify which profiles match the teachers and students',
      btn: 'Link profiles',
    },
    step_library: {
      title: 'Tasks Library',
      description:
        'Create new tasks and assign them or review the create ones on the task library.',
      btn: 'Create task',
    },
    step_ongoing: {
      title: 'Ongoing tasks',
      description:
        'Reviews tasks in progress and monitors their status. You can also start the correction of completed tasks.',
      btn: 'View ongoing tasks',
    },
    step_history: {
      title: 'History',
      description: `View completed tasks, their evaluations and the student's feedback.`,
      btn: 'View tasks history',
    },
  },
  library_page: {
    page_title: 'Task Library',
  },
  task_setup_page: {
    title: 'Create new task',
    edit_title: 'Edit task',
    common: {
      select_center: 'Select center',
      create_done: 'Task created',
      update_done: 'Task updated',
      publish_done: 'Task published',
      no_id_error: 'No task id provided',
      save: 'Save draft',
      publish: 'Publish',
    },
    setup: {
      basicData: {
        step_label: 'Basic',
        labels: {
          name: 'Name',
          tagline: 'Tagline',
          description: 'Summary',
        },
        placeholders: {
          name: "Task's name",
          tagline: 'Subtitle of the task',
          description: 'What is this assignment about?',
        },
        errorMessages: {
          name: { required: 'Field required' },
          tagline: { required: 'Required field' },
          description: { required: 'Required field' },
        },
      },
      configData: {
        step_label: 'Config',
        labels: {
          name: 'Name',
          tagline: 'Tagline',
          configTitle: 'Config',
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
          summary: 'Summary',
          tags: 'Tags',
          buttonNext: 'Next',
          wordCounter: {
            single: 'Word',
            plural: 'Words',
          },

          preTask: {
            toggler: 'Add a pre-task activity',
            mandatory: 'Mandatory to start the Task',
            condition: 'Condition to start the Task',
            conditions: {
              take: 'Only take the test',
              greater: 'Pass the test with a score higher than',
            },
          },
        },

        placeholders: {
          tagline: 'Subtitle of the task',
          name: "Task's name",
          center: 'Select...',
          program: 'Select...',
          course: 'Select...',
          subject: 'Select...',
          level: 'Select...',
          summary: 'What is this assignment about?',
          tags: 'Start typing a tag',
        },
        errorMessages: {
          name: { required: 'Field required' },
          tagline: { required: 'Required field' },
          program: { required: 'Required field' },
          course: { required: 'Required field' },
          subject: { required: 'Required field' },
          level: { required: 'Required field' },
          summary: { required: 'Required field' },
          tags: { required: 'Required field' },
        },
      },
      designData: {
        step_label: 'Design',
        labels: {
          title: 'Design',
          color: 'Color',
          cover: 'Cover Image',
          buttonNext: 'Next',
          buttonPrev: 'Previous',
        },
        placeholders: {
          color: 'Pick color',
          cover: 'Upload or select from Library',
        },
        errorMessages: {
          color: { required: 'Required field' },
          cover: { required: 'Required field' },
        },
      },
      contentData: {
        step_label: 'Content',
        labels: {
          title: 'Content',
          methodology: 'Methodology',
          recommendedDuration: 'Recommended duration',
          statement: 'Statement',
          development: 'Development',
          objectives: 'Objectives',
          curriculum: 'Curriculum',
          content: 'Content',
          assessmentCriteria: 'Assessment criteria',
          buttonNext: 'Next',
          buttonPrev: 'Previous',
          selfReflection: {
            title: 'Self reflection',
            description: 'Description',
            id: 'WIP: Id of the test',
            mandatory: 'Mandatory to fill the task',
          },
          feedback: {
            title: 'Feedback',
            description: 'Description',
            id: 'WIP: Id of the test',
            mandatory: 'Mandatory to fill the task',
          },
          submission: {
            title: 'This task is comppleted with the submission of a paper or activity',
            type: 'Type of submission',
            types: {
              file: 'File',
              link: 'Link',
            },
            description: 'Description',
            FileType: {
              multiFile: 'Allow multiple files',
              type: 'Type',
              typePlaceholder: 'Add extension',
              maxSize: 'Max size',
            },
          },
        },
        descriptions: {
          selfReflection: 'Add a space for the student to reflect on what he/she has learned.',
          feedback: 'Ask the student for a quick evaluation of this exercise.',
        },
        errorMessages: {
          methodology: { required: 'Required field' },
          recommendedDuration: { required: 'Required field' },
        },
      },
      instructionData: {
        step_label: 'Instructions',
        labels: {
          title: 'Instructions',
          forTeacher: 'Instructions for Teacher',
          forStudent: 'Instructions for Student',
          buttonPublish: 'Only publish',
          buttonNext: 'Publish and assign',
          buttonPrev: 'Previous',
        },
        placeholders: {
          forTeacher: 'Help other teachers approach this exercise with a few simple instructions.',
          forStudent:
            'Here you can include extra information to help the student perform the exercise better.',
        },
        errorMessages: {
          forTeacher: { required: 'Required field' },
          forStudent: { required: 'Required field' },
        },
      },
      publishData: {
        step_label: 'Publish',
        labels: {
          title: 'Publish & Assign',
          description:
            'You can now save this activity in your library to use it whenever you want or, in the same step, assign it to your students to do.',
          assign: 'Assign later to students',
          buttonNext: 'Publish',
          buttonPrev: 'Previous',
        },
      },
    },
  },
  assignment_page: {
    page_title: 'Assign tasks',
  },
  assignment_form: {
    labels: {
      classroomToAssign: 'Classroom to assign',
      studentToAssign: 'Student to assign',
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
      groupName: "Group's name",
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
        'If you assign this task to other groups in this step, this message will be the default message for all tasks (although you can change it individually if you wish).',
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
      'First of all we need to match the system profiles with the custom profiles you have created on the platform (Please read carefully the characteristics of each profile. Once the profiles are linked, it cannot be undone.)',
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
};
