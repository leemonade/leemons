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
      buttons: {
        save: 'Save draft',
      },
    },
    tabs: {
      basicData: 'Basic data',
      structure: 'Structure',
      resources: 'Resources',
    },
    buttons: {
      next: 'Next',
      previous: 'Previous',
      publishOptions: 'Publish options',
      publish: 'Publish',
      publishAndAssign: 'Publish and assign',
      publishAndShare: 'Publish and share',

      tooltips: {
        disabledNotResources: 'Add two or more activities to publish',
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
          title: "¡Let's start creating!",
          description:
            'Add Resources to the library and sort them as you want them to appear to the student.',
        },
        moduleComposer: {
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
          title: "¡Let's start creating!",
          description:
            'Add activities to the library and sort them as you want them to appear to the student.',
        },
        moduleComposer: {
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
      share: 'Share',
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
    },
    resources: 'Resources',
  },
  modulesTab: {
    tabName: 'Modules',
  },
};
