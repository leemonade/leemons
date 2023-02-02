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
    },
    buttons: {
      next: 'Next',
      previous: 'Previous',
      publishOptions: 'Publish options',
      publish: 'Publish',
      publishAndAssign: 'Publish and assign',
      publishAndShare: 'Publish and share',

      tooltips: {
        disabledNotResources: 'Add two or more resources to publish',
      },
    },
    steps: {
      basicData: {
        errors: {
          tagline: {
            required: 'Tagline is required',
          },
          program: {
            required: 'Program is required',
          },
          subject: {
            required: 'At least one subject is required',
          },
        },
      },
      structureData: {
        alerts: {
          error: {
            nonAssignableAsset: 'The selected resource is not an assignable acitivity',
          },
        },
        buttons: {
          new: 'New resource',
        },
        emptyState: {
          title: "¡Let's start creating!",
          description:
            'Add resources to the library and sort them as you want them to appear to the student.',
        },
        moduleComposer: {
          columns: {
            resource: 'Resource',
            type: 'Type',
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
  },
  libraryCard: {
    menuItems: {
      edit: 'Edit',
      assign: 'Assign',
      duplicate: 'Duplicate',
      delete: 'Delete',
    },
    duplicate: {
      title: 'Duplicar módulo',
      message: '¿Seguro que quiere duplicar el módulo {{name}}?',
      success: 'The module {{name}} has been duplicated',
      error: 'The module {{name}} could not be duplicated',
    },
    delete: {
      title: 'Eliminar módulo',
      message: '¿Seguro que quiere elminnar el módulo {{name}}?',
      success: 'The module {{name}} has been deleted',
      error: 'The module {{name}} could not be deleted',
    },
  },
};
