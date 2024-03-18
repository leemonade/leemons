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
      quickAccess: 'Favorites',
      recent: 'Recent',
      uploadButton: 'New',
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
      cancel: 'Cancel',
    },
    basicData: {
      header: {
        stepLabel: 'Basic data',
        titleNew: 'New resource',
        titleEdit: 'Edit resource',
        back: 'Back',
        presentation: 'Presentation',
        subTitle: 'Resource title',
      },
      footer: {
        finish: 'Finish',
        publish: 'Publish',
      },
      bookmark: {
        titleNew: 'New bookmark',
        titleEdit: 'Edit bookmark',
        subTitle: 'Bookmark title',
      },
      labels: {
        content: 'Content',
        presentation: 'Presentation',
        other: 'Other',
        title: 'Upload file',
        featuredImage: 'Featured image',
        course: 'Course',
        programAndSubjects: 'Program and subjects',
        selectPlaceholder: 'Select one...',
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
        name: 'Title',
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
            configTitle: 'Programs and Subjects',
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
            addSubject: 'Add',
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
        tagsInput: 'Write your tags here and press enter',
        name: 'Resource Title',
        bookmarkName: 'Bookmark title',
        tagline: 'Resource tagline',
        tags: 'Resource tags',
        url: 'Webpage link',
        description: 'Resource description',
        color: 'Select a color',
      },
      errorMessages: {
        name: {
          required: 'Title is required',
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
        libraryItem: 'Library item',
        permissionsHeader: 'Permissions configuration',
        groupUserHeader: 'Group/User',
        actionsHeader: 'Actions',
      },
      labels: {
        currentUsers: 'Current users',
        addUsersTab: 'Add users',
        allCenters: 'All centers',
        shareTypePublic: 'Public',
        shareTypeCenters: 'By centers',
        shareTypeProfiles: 'By profiles',
        shareTypePrograms: 'By programs',
        shareTypeClasses: 'By classes',
        shareTypeUsers: 'By users',
        shareTab: 'Share',
        sharedTab: 'Shared with',
        title: 'Resource permissions',
        addProfiles: 'Add profiles',
        addProfilesDescription:
          'Users with the indicated profiles will see this resource in their shared folder, students will see it in their corresponding subject folder or in their shared folder if they do not have assigned subject labels. ',
        addProfilesEdit: 'Profiles',
        addClasses: 'Add classes',
        addClassesDescription:
          'Classroom users will see this resource in their shared folder, students will see it in their corresponding subject folder or in their shared folder if they do not have assigned subject labels.',
        addPrograms: 'Add programs',
        addProgramsDescription:
          'Program users will see this resource in their shared folder, students will see it in their corresponding subject folder or in their shared folder if they do not have assigned subject labels.',
        addProgramsEdit: 'Programs',
        profilesPerProgram: 'Add profiles by program',
        addUsers: 'Add individual users',
        addUsersDescription:
          'Teachers will see this resource in their shared folder, students will see it in their corresponding subject folder or in their shared folder if they do not have assigned subject labels.',
        programs: 'Educational programs',
        program: 'Program',
        profilesPerCenter: 'Add profiles by center',
        programsPerCenter: 'Add programs by center',
        addCenterAsPublic:
          'You have added the equivalent to public, if you save, all current viewer permissions will be deleted and it will be set to public.',
        addCentersEdit: 'Centers',
        addCenters: 'Add centers',
        addCenterEditAll:
          'For security reasons it is not possible to configure that all the centers have permission to edit',
        addCentersDescription:
          'All profiles of the selected center will see this resource in their corresponding subject folders.',
        isPublic: 'This resource is public',
        saveButton: 'Save permissions',
        shareButton: 'Share',
        addUserButton: 'Add',
        editUserButton: 'Edit',
        removeUserButton: 'Remove',
        acceptButton: 'Accept',
        cancelButton: 'Cancel',
        updateButton: 'Update',
        saveFooterButton: 'Save',
        permissionsSuccess: 'Permissions successfully established',
        shareSuccess: 'Resource successfully shared',
        shareCenters: 'Search centers',
        sharePrograms: 'Programs',
        shareProfiles: 'Profiles',
        sharePermissions: 'Permissions',
        shareClasses: 'Search class',
        editAddUsers: 'Individual users',
        addUserAlert:
          'Teachers will see this resource in their shared folder, students will see it in their corresponding subject folder or in their shared folder if it does not have assigned subject tags.',
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
      assigner: 'Assigner',
      public: 'Public',
    },
    cancelModal: {
      title: 'Cancel content',
      description: 'Do you want to cancel?',
      confirm: 'Confirm',
      cancel: 'Back',
    },
    common: {
      labels: {
        processingImage: 'Processing image',
      },
    },
  },
  list: {
    show: 'Show',
    goTo: 'Go to',
    permissions: 'Permissions',
    editPermissions: 'Edit permissions',
    owner: 'Owner',
    viewer: 'Viewer',
    editor: 'Editor',
    assigner: 'Assigner',
    new: 'New {label}',
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

      searchListEmpty: 'No items found with this search criteria',
      searchListEmptyDescription:
        'Try searching by keywords (tags) or type in more general information and then use the filters to refine the search.',
      copy: 'Copy',
      copied: 'Copied',
      privated: 'Privated',
      sharedWith: 'Shared',
      sharedViewAll: 'View all',
      sharedWithEverybody: 'Shared with everyone',
      showPublic: 'Show public assets',
      resourceTypes: 'Resource type',
      allResourceTypes: 'All types',
      detail: 'Detail',
      permissions: 'Permissions',
      instructions: 'Instructions',
      assetStatus: 'State',
      assetStatusPublished: 'Published',
      assetStatusDraft: 'Draft',
      assetStatusAll: 'All statuses',
      emptyInstructions: 'This asset does not have any instructions for teachers yet.',
    },
    cardToolbar: {
      edit: 'Edit',
      duplicate: 'Duplicate',
      download: 'Download',
      delete: 'Delete',
      share: 'Permissions',
      assign: 'Assign',
      pin: 'Mark as favorite',
      unpin: 'Remove from favorites',
      toggle: 'Toggle',
      open: 'Open',
      covertToTask: 'Assign',
    },
    emptyStates: {
      title: 'There are no {category} yet',
      'media-files': {
        descriptionCTA: 'New {singularCategory}.',
        helpCTA: 'How to create a {singularCategory}.',
        description:
          'Start uploading your media files (images, PDFs, audios, videos...) by clicking {CTA}',

        help: 'And if you need help, access {CTA}',
      },
      bookmarks: {
        descriptionCTA: 'New {singularCategory}.',
        helpCTA: 'How to create a {singularCategory}.',
        description:
          'A bookmark is a shortcut to a web page that you are interested in keeping handy. Create your first bookmark by copying the web address of the site and clicking {CTA}',
        help: 'And if you need help, access {CTA}',
      },
      pins: {
        helpCTA: 'How to manage favorites.',
        description:
          'Click on the heart icon on the card of any library item to highlight it in this section and have it handy.',
        help: 'And if you need help, access {CTA}',
      },
      'leebrary-shared': {
        descriptionCTA: 'New',
        description:
          'When another user shares a content, resource or activity with you, it will appear highlighted in this section. You have not been shared anything yet but you can start by creating your own materials by clicking the {CTA} button in the upper left area.',
      },
      'leebrary-recent': {
        descriptionCTA: 'New',
        description:
          'Here you will find the latest items in the library. Start by clicking the {CTA} button in the top left corner to upload a resource, create a bookmark or a task, or write content and they will appear in this section.',
      },
      'leebrary-subject': {
        title: 'There is no content for your subjects yet',
        description:
          'When your teachers share class resources with you, they will appear in these folders. You can also store your content in this folder by tagging them with a subject.',
        help: 'And if you need help, access {CTA}',
        helpCTA: 'How to tag content',
      },
      'assignables.content-creator': {
        descriptionCTA: 'New {singularCategory}.',
        helpCTA: 'How to create {pluralCategory}.',
        description:
          'In Leemons, you can create your own documents with content for students. Create your first document by clicking {CTA}',
        help: 'And if you need help, access {CTA}',
      },
      'assignables.task': {
        descriptionCTA: 'New {singularCategory}.',
        helpCTA: 'How to create {pluralCategory}.',
        description:
          'Tasks are activities that you can assign to your students to apply what they have learned in a practical way or to demonstrate their knowledge. Create your first task by clicking {CTA}',
        help: 'And if you need help, access {CTA}',
      },
      'tests-questions-banks': {
        descriptionCTA: 'New {singularCategory}.',
        helpCTA: 'How to create {pluralCategory}.',
        description:
          'Question banks are the basis for creating assessment tests, you can group your materials by topics in different banks where you classify them by categories and difficulty. Create your first bank by clicking {CTA}',
        help: 'And if you want to know how they work in detail, access {CTA}',
      },
      'assignables.tests': {
        descriptionCTA: 'New {singularCategory}.',
        helpCTA: 'How to create {singularCategory}.',
        description:
          'A test is a set of questions selected from a question bank and serves to evaluate knowledge. Create your first test by clicking {CTA}',
        help: 'And if you want to know how they work in detail, access {CTA}',
      },
      'assignables.feedback': {
        descriptionCTA: 'New {singularCategory}.',
        helpCTA: 'How to create {pluralCategory}.',
        description:
          'With surveys, you can find out the satisfaction level of your students, request feedback on content, tasks, etc... and view the results in a super useful report. Create your first survey by clicking {CTA}',
        help: 'And if you want to know how they work in detail, access {CTA}',
      },
      'assignables.learningpaths.module': {
        descriptionCTA: 'New {singularCategory}.',
        helpCTA: 'How to create {pluralCategory}.',
        description:
          'A module is a learning situation that has several stages (a content, test, task...) and that must be carried out consecutively. To create a module, you must first upload or create the contents and activities that comprise it. Start now by clicking {CTA}',
        help: 'And if you want to know how they work in detail, access {CTA}',
      },
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
      mediaType: {
        label: 'Resource types',
        placeholder: 'Select a resource type',
        allTypes: 'All types',
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
  uploadFileModal: {
    title: 'Uploading file',
    fileOf: 'Uploading file {currentFile} of {totalFiles} - {currentFilePercentageCompleted}%',
    init: 'Starting file upload',
    finalize: 'Finalizing file upload',
    unzip: 'Preparing zip for upload',
    processingImage: 'Processing image',
    finalizing: 'Finalizing...',
  },
  assetsList: {
    published: 'Published',
    draft: 'Drafts',
    isDraft: 'Draft',
    size: 'Size',
    dimensions: 'Dimensions',
    format: 'Format',
    duration: 'Duration',
    lastUpdate: 'Last update',
  },
  pdfPlayer: {
    pageLabel: 'Page',
    paginatorLabel: '/',
    schemaLabel: 'Schema',
  },
};
