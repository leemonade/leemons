module.exports = {
  libraryPage: {
    header: {
      title: 'Modules library',
      buttons: {
        new: 'New',
      },
    },
    tabs: {
      published: 'Published',
      draft: 'Drafts',
    },
  },
  moduleSetup: {
    header: {
      title: 'New module',
      editTitle: 'Edit module',
      subtitlePlaceholder: 'Module title',

      buttons: {
        save: 'Save draft',
      },
    },
    tabs: {
      basicData: 'Basic data',
      structure: 'Learning path',
      resources: 'Resources',
    },
    buttons: {
      next: 'Next',
      previous: 'Previous',
      saveDraft: 'Save draft',
      publishOptions: 'Publish options',
      publish: 'Publish',
      publishAndAssign: 'Publish and assign',
      publishAndShare: 'Publish and share',

      tooltips: {
        disabledNotActivities: 'Add two or more activities to continue',
      },
    },
    steps: {
      basicData: {
        errors: {
          program: {
            required: 'Program is required',
          },
          subject: {
            required: 'At least one subject is required',
          },
        },
      },
      resourcesData: {
        buttons: {
          new: 'New resource',
        },
        emptyState: {
          title: 'Additional learning resources',
          description: 'You can select additional resources to deepen the subject (optional)',
        },
        moduleComposer: {
          title: 'Resource list',
          columns: {
            resource: 'Resource',
            actions: 'Actions',
          },
          lastUpdate: 'Last update',
        },
      },
      structureData: {
        alerts: {
          error: {
            nonAssignableAsset: 'The selected resource is not an assignable acitivity',
          },
        },
        buttons: {
          new: 'New activity',
        },
        emptyState: {
          title: 'Activity list',
          description:
            'Select activities from your library to create a personalised learning path.',
        },
        moduleComposer: {
          title: 'Activity list',
          columns: {
            resource: 'Activity',
            type: 'Type',
            time: 'Tiempo',
            actions: 'Actions',
          },
          lastUpdate: 'Last update',
          types: {
            optional: 'Optional',
            recommended: 'Recommended',
            mandatory: 'Mandatory',
            blocking: 'Blocking',
          },
        },
      },
    },
    alert: {
      saveSuccess: 'Saved successfuly',
      saveError: 'An error occurred while saving',
      publishSuccess: 'Saved and published successfuly',
      publishError: 'An error occurred while saving and publishing',
    },
  },
  libraryCard: {
    menuItems: {
      toggle: 'Close',
      open: 'Open',
      view: 'View',
      edit: 'Edit',
      assign: 'Assign',
      duplicate: 'Duplicate',
      delete: 'Delete',
      share: 'Permissions',
    },
    duplicate: {
      title: 'Duplicate module',
      message: 'Are you sure you want to delete the module {{name}}?',
      success: 'The module {{name}} has been duplicated',
      error: 'The module {{name}} could not be duplicated',
    },
    delete: {
      title: 'Delete module',
      message: 'Are you sure you want to delete the module {{name}}?',
      success: 'The module {{name}} has been deleted',
      error: 'The module {{name}} could not be deleted',
    },
  },
  assignation: {
    steps: {
      assignmentForm: {
        action: 'Assign as module',
      },
      setup: {
        action: 'Configuration',
      },
    },
    buttons: {
      previous: 'Previous',
      next: 'Next',
      assign: 'Assign',
    },
    alert: {
      failedToAssign: 'An error occurred while assigning',
    },
  },
  dashboard: {
    activities: 'Activities',
    buttons: {
      review: 'Review',
      start: 'Start',
      continue: 'Continue',
      preview: 'Preview',
      viewEvaluation: 'View evaluation',
      notAvailable: 'Unavailable',
      forEvaluate: 'For evaluation',
      viewProgress: 'View progress',
      viewReport: 'View report',
    },
    resources: 'Resources',
    students: 'Students',
  },
  modulesTab: {
    tabName: 'Modules',
  },
  moduleDrawer: {
    module: 'Módulo',
    activities: 'Actividades',
    name: 'Nombre',
    Type: 'Tipo',
  },
  moduleCardBadge: {
    options: {
      nonEvaluable: 'Non-evaluable',
      calificable: 'Qualifiable',
      punctuable: 'Punctuable',
      feedbackOnly: 'Comments only',
      feedback: 'Feedback',
      feedbackAvailable: 'Feedback available',
    },
  },
  gradeState: {
    evaluated: 'Evaluated',
    delivered: 'Delivered',
  },
  moduleJourney: {
    introduction: 'Introduction',
    resources: 'Resources',
  },
  emptyState: {
    description: 'There is no module assigned',
  },
};
