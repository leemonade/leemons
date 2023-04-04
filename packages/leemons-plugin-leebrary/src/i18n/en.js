module.exports = {
  tableInput: {
    add: 'Add',
    remove: 'Remove',
    edit: 'Edit',
    accept: 'Accept',
    cancel: 'Cancel',
  },
  home: {
    navbar: {
      title: 'Library',
      subjects: 'Subjects',
      sharedWithMe: 'Shared with me',
      quickAccess: 'Quick access',
      uploadButton: 'Upload or Create',
      createNewTitle: 'Create new',
      uploadTitle: 'Upload file',
      fileUploadTitle: 'Click to browse files',
      fileUploadSubtitle: 'or drop a computer file here',
    },
  },
  assetSetup: {
    header: {
      back: 'Back',
      close: 'Close',
      title: 'Library',
    },
    basicData: {
      header: {
        stepLabel: 'Basic data',
        titleNew: 'New resource',
        titleEdit: 'Edit resource',
        back: 'Back',
      },
      bookmark: {
        title: 'New bookmark',
      },
      labels: {
        title: 'Upload file',
        featuredImage: 'Featured image',
        tags: 'Tags',
        addTag: 'Add tag',
        browseFile: 'Click to browse your files',
        advancedConfig: 'Advanced config',
        program: 'Program',
        subjects: 'Subjects',
        dropFile: 'or drop a computer file here',
        changeImage: 'Change image',
        uploadButton: 'Upload image',
        search: 'Search from library',
        submitForm: 'Add to library',
        submitChanges: 'Save changes',
        name: 'Name',
        tagline: 'Tagline',
        description: 'Description',
        createdSuccess: 'Asset successfully created',
        updatedSuccess: 'Asset successfully updated',
        url: 'URL (webpage link)',
        checkUrl: 'Check url',
        color: 'Color',
        wordCounter: {
          single: 'Word',
          plural: 'Words',
        },
        preview: 'Thumbnail preview',
        subjectSelects: {
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
      },
      descriptions: {
        featuredImage: "Only to change the webpage's default featured image",
      },
      placeholders: {
        tagsInput: 'Name of tag',
        name: 'Resource name',
        tagline: 'Resource tagline',
        tags: 'Resource tags',
        url: 'Webpage link',
        description: 'Resource description',
        color: 'Select a color',
      },
      errorMessages: {
        name: {
          required: 'Name is required',
        },
        url: {
          required: 'URL is required',
        },
        file: {
          required: 'File is required',
          rejected: 'File was rejected',
        },
        tags: {
          required: 'Write a tag to add it',
        },
        program: {
          required: 'Program is required',
        },
        subject: {
          required: 'Subject is required',
        },
      },
    },
    permissionsData: {
      header: {
        stepLabel: 'Permissions',
        shareTitle: 'Share resource',
        close: 'Close',
      },
      labels: {
        title: 'Resource permissions',
        addUsers: 'Add individual users',
        addUsersDescription:
          'Teachers will see this resource in their shared folder, students will see it in their corresponding subject folder or in their shared folder if they do not have assigned subject labels.',
        programs: 'Educational programs',
        program: 'Program',
        addClasses: 'Add groups',
        addClassesDescription:
          'Students will see this resource in their corresponding subject folder.',
        isPublic: 'This resource is public',
        saveButton: 'Save permissions',
        shareButton: 'Share',
        addUserButton: 'Add',
        editUserButton: 'Edit',
        removeUserButton: 'Remove',
        acceptButton: 'Accept',
        cancelButton: 'Cancel',
        permissionsSuccess: 'Permissions successfully established',
        shareSuccess: 'Resource successfully shared',
      },
      placeholders: {
        userInput: 'Start typing a name',
        userRole: 'Select role',
      },
      errorMessages: {
        user: {
          required: 'User is required',
        },
        userRole: {
          required: 'Role is required',
        },
        share: {
          required: 'You are not allowed to share this resource',
        },
      },
    },
    roleLabels: {
      viewer: 'Viewer',
      commentor: 'Commentor',
      editor: 'Editor',
      owner: 'Owner',
      public: 'Public',
    },
  },
  list: {
    show: 'Show',
    goTo: 'Go to',
    tableLabels: {
      name: 'Name',
      owner: 'Owner',
      updated: 'Last change',
    },
    labels: {
      search: 'Search',
      searchPlaceholder: 'Search for resources',
      type: 'Type',
      duplicateSuccess: 'Asset successfully duplicated',
      removeSuccess: 'Asset successfully removed',
      pinnedSuccess: 'Asset successfully pinned',
      unpinnedSuccess: 'Asset successfully unpinned',
      listEmpty: 'No assets found',
      listEmptyDescription:
        'Thanks to Leemons Libraries, teachers can manage assignments, tests, and sessions. Both teachers and students can create and share multimedia files and save their favorite web pages.',
      searchListEmpty: 'No assets found with this search criteria',
      searchListEmptyDescription:
        'Try searching by keywords (tags) or type in more general information and then use the filters to refine the search.',
      copy: 'Copy',
      copied: 'Copied',
      privated: 'Privated',
      sharedWith: 'Shared',
      sharedViewAll: 'View all',
      sharedWithEverybody: 'Shared with everyone',
      showPublic: 'Show public assets',
      resourceTypes: 'Type of resource',
      allResourceTypes: 'All types',
    },
    cardToolbar: {
      edit: 'Edit',
      duplicate: 'Duplicate',
      download: 'Download',
      delete: 'Delete',
      share: 'Share',
      assign: 'Assign',
      pin: 'Pin',
      unpin: 'Unpin',
      toggle: 'Toggle',
      open: 'Open',
      covertToTask: 'Convert to task',
    },
  },
  pickerDrawer: {
    header: {
      title: 'Library',
    },
    tabs: {
      library: 'Library',
      new: 'New resource',
    },
    filters: {
      search: {
        label: 'Search',
        placeholder: 'Search resources',
      },
      resources: {
        label: 'Categories',
        placeholder: 'Select a category',
      },
    },
  },
  admin: {
    card: {
      title: 'Bookstore Suppliers',
      description: 'Configure your suppliers for library management',
    },
    setup: {
      chooseProvider: 'Choose provider',
    },
  },
};
