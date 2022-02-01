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
          tagline: 'Tagline',
          buttonNext: 'Next',
        },
        descriptions: {
          tagline: '...',
        },
        placeholders: {
          tagline: '...',
        },
        helps: {
          tagline: '...',
        },
        errorMessages: {
          tagline: { required: 'Required field' },
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
          buttonNext: 'Next',
          buttonPrev: 'Previous',
        },
        helps: {
          methodology: '...',
        },
        errorMessages: {
          methodology: { required: 'Required field' },
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
};
