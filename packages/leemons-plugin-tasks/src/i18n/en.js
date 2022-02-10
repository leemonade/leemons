module.exports = {
  welcome_page: {
    page_title: 'Tasks',
    page_description:
      'Thanks to the tasks module you can create new tasks, assign them to groups of students or individuals, monitor their current status and start evaluations of completed tasks.',
    hide_info_label: `Ok, I've got it. When the configuration is complete, don't show this info anymore`,
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
    },
    setup: {
      configData: {
        step_label: 'Config',
        labels: {
          title: 'Config',
          name: 'Name',
          tagline: 'Tagline',
          program: 'Program',
          course: 'Course',
          subject: 'Subject',
          addSubject: 'Add subject',
          level: 'Level',
          summary: 'Summary',
          tags: 'Tags',
          buttonNext: 'Next',
        },

        placeholders: {
          tagline: ' ',
          name: "Task's name",
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
          buttonNext: 'Next',
          buttonPrev: 'Previous',
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
          buttonNext: 'Next',
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
  assignment_form: {
    labels: {
      assignTo: 'Assign to',
      classroomToAssign: 'Classroom to assign',
      studentToAssign: 'Student to assign',
      mode: 'Mode',
      deadline: 'Deadline',
      availableInAdvance: 'Make available in advance',
      limitedExecution: 'Limited execution time',
      messageToStudents: 'Add a message to the students',
      submit: 'Assign',
    },
    placeholders: {
      date: 'dd/mm/yyyy',
      time: 'hh:mm',
      units: 'units',
    },
    descriptions: {
      messageToStudents:
        'If you assign this task to other groups in this step, this message will be the default message for all tasks (although you can change it individually if you wish).',
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
};
