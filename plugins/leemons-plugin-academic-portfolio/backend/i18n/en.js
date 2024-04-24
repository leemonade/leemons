module.exports = {
  welcome_page: {
    page_title: 'Academic Portfolio',
    page_description:
      'Portfolio allows the creation of programs or educational stages, and the addition of subjects with courses, groups, professors, and more. With this information, a visual tree is created in order to manage the portfolio, assign students, create clusters, edit rules and much more.',
    hide_info_label:
      "Ok, I've got it. When the configuration is complete, don't show this info anymore",
    step_profiles: {
      title: 'Match profiles',
      description:
        'Academic portfolio needs clarification regarding which key profiles are to be worked on. This will only need to be done once.',
      btn: 'Match profiles',
    },
    step_programs: {
      title: 'Create programs',
      description:
        'Elementary, High School, GCSE, A Levels, Bachelors, Masters, and more. Define the programs and courses offered in your organization.',
      btn: 'Create programs',
    },
    step_subjects: {
      title: 'Add subjects',
      description:
        'With bulk or manual upload, a subject portfolio can be created that relates to a specific program and course.',
      btn: 'Add subjects',
    },
    step_tree: {
      title: 'Manage academic portfolio',
      description:
        'Define the kind of tree for your specific education system and assigning students, create clusters or edit information.',
      btn: 'Create your tree',
    },
  },
  subjectTypes_page: {
    header: {
      title: 'Subject Types',
      cancel: 'Cancel',
      centerSelectPlaceholder: 'Select a center',
    },
    labels: {
      add: 'Add',
      remove: 'Remove',
      edit: 'Edit',
      accept: 'Accept',
      cancel: 'Cancel',
      name: 'Name',
      description: 'Description',
      type: 'Type',
      actions: 'Actions',
    },
    placeholders: {
      name: 'Type name...',
      description: 'Write a description...',
    },
    alerts: {
      success: {
        add: 'Subject Type created successfully.',
        update: 'Subject Type updated successfully.',
        delete: 'Subject Type deleted successfully.',
      },
      failure: {
        add: 'Could not create the Subject Type. ',
        update: 'Could not update the Subject Type. ',
        delete: 'Could not delete the Subject Type. ',
      },
    },
    errors: {
      requiredField: 'Required field',
    },
    emptyState: {
      text: 'Create a subject type. Just enter the name and press add on the form above.',
      altText: 'Add your first subject type.',
    },
  },
  knowledgeAreas_page: {
    header: {
      title: 'Knowledge Areas',
      cancel: 'Cancel',
      centerSelectPlaceholder: 'Select a center',
    },
    labels: {
      add: 'Add',
      remove: 'Remove',
      edit: 'Edit',
      accept: 'Accept',
      cancel: 'Cancel',
      name: 'Name',
      abbreviation: 'Abbreviation',
      area: 'Area',
      actions: 'Actions',
    },
    placeholders: {
      name: 'Area name...',
      abbreviation: 'Alias or abbreviation...',
    },
    alerts: {
      success: {
        add: 'Knowledge Area created successfully.',
        update: 'Knowledge Area updated successfully.',
        delete: 'Knowledge Area deleted successfully.',
      },
      failure: {
        add: 'Could not create the Knowledge Area. ',
        update: 'Could not update the Knowledge Area. ',
        delete: 'Could not delete the Knowledge Area. ',
      },
    },
    errors: {
      requiredField: 'Required field',
    },
    emptyState: {
      text: 'Create a Knowledge Area. Just enter the name, the abbreviation, and press add on the form above.',
      altText: 'Add your first Knowledge Area.',
    },
  },
  programs_page: {
    page_title: 'Learning programs',
    page_description:
      'Elementary, High School, Bachelor, Masters, and more. Define the programs and courses offered in your organization. If your organization does not have traditional stages, simple programs or courses can be created instead.',
    errorNoEvaluationSystems:
      'There are no evaluation systems defined. Please, create one or more evaluation systems.',
    errorNoEvaluationSystemsGoTo: 'Go to evaluation systems',
    emptyStates: {
      noProgramsCreated: 'No programs have been created yet.',
      noProgramsArchived: 'No programs have been archived yet.',
      noAcademicRules:
        'No Academic Rules have been created. To start with the programs, please first create the Academic Rules.',
      createAcademicRules: 'Create Academic Rules',
    },
    labels: {
      publishedPrograms: 'Published',
      archivedPrograms: 'Archived',
      addNewProgram: 'New Program',
      program: 'Program',
      cycles: 'Cycles',
      courses: 'Courses',
      course: 'Course',
      substages: 'Substages',
      subjects: 'Subjects',
      students: 'Students',
      actions: 'Actions',
      cancel: 'Cancel',
      edit: 'Edit',
      duplicate: 'Duplicate',
      archive: 'Archive',
      remove: 'Remove',
      accept: 'Aceptar',
      info: 'Info',
    },
    alerts: {
      success: {
        add: 'Program created successfully.',
        update: 'Program updated successfully.',
        delete: 'Program archived successfully.',
        duplicate: 'Program duplicated successfully.',
      },
      failure: {
        add: 'The Program could not be created. ',
        update: 'The Program could not be updated. ',
        delete: 'The Program could not be archived. ',
        duplicate: 'The Program could not be duplicated. ',
      },
    },
    common: {
      select_center: 'Select center',
      add_program: 'Add new program',
      create_done: 'Program created',
      update_done: 'Program updated',
    },
    archiveModal: {
      title: 'Archive program',
      description:
        'Are you sure you want to archive the program "{programName}"? The program will no longer be displayed in any student or teacher section and you can restore it whenever you need.',
      confirm: 'Archive',
    },
    duplicateModal: {
      title: 'Duplicate program',
      description:
        'You are going to duplicate the program "{programName}". The new copy will not keep the enrolled students.',
      confirm: 'Duplicate',
    },
    programDrawer: {
      title: 'New program',
      updateTitle: 'Edit program',
      classroomsAndGroups: 'Subjects or groups',
      requiredField: 'Required field',
      others: 'Others',
      loadingForm: 'Customizing your program',
      save: 'Save',
      wizardForm: {
        yes: 'Yes',
        no: 'No',
        customization: 'Customization',
        temporalStructure: 'Temporal Structure',
        doesItHaveMoreThanOneCourse: 'Does this program have several courses?',
        doesItHaveSequentialCourses: 'Is it necessary to finish a course to start the next one?',
        doesItHaveCycles: 'Are those courses grouped into educational cycles?',
        doesItHaveSubstages: 'Are there evaluation substages? (for example, quarters or semesters)',
        doesItHaveKnowledgeAreas: 'Are there knowledge areas that group subjects?',
        doesItHaveSubjectTypes:
          'Are there types of subjects? (Core, Elective, Free configuration...)',
        doItsSubjectsHaveAnUniqueId:
          'Do you need to establish a custom ID (identification number) for each subject?',
        doesItHaveReferenceGroups:
          'Do you need to create Reference Groups that share subjects? (for example, 2nd A, 2nd B...)',
        doesItHaveOfficialCredits: 'Do you need to use an official credit system?',
        doesItHaveADefinedAmountOfHours:
          'Do you need to define a total duration in hours to track progress? (without credits)',
      },
      addProgramForm: {
        basicData: {
          title: 'Basic Data',
          presentation: 'Presentation',
          name: 'Name',
          abbreviation: 'Abbreviation',
          color: 'Color',
          featuredImage: 'Featured Image',
        },
        academicRules: {
          title: 'Academic Rules',
          selectSystem: 'Select a system',
        },
        durationAndCredits: {
          titleWithCredits: 'Duration and Credits',
          titleOnlyDuration: 'Duration',
          hoursPerCredit: 'Hours per credit',
          numberOfCredits: 'Number of credits',
          totalHours: 'Total hours',
          totalHoursPlaceholder: 'Total hours...',
          totalCreditsPlaceholder: 'Total credits...',
          durationInHours: 'Duration (hours)',
          hoursPlaceholder: 'Hours...',
        },
        temporalStructure: {
          title: 'Temporal Structure',
          courseSubstages: 'Course substages',
          courses: 'Courses',
          cycles: 'Cycles',
        },
        coursesSetup: {
          course: 'Course',
          minCredits: 'Minimum credits',
          maxCredits: 'Maximum credits',
          mustHaveAtLeastTwoCourses: 'Must have at least 2 courses',
        },
        cyclesSetup: {
          cycleName: 'Cycle Name',
          cycleCourses: 'Courses',
          selectCoursesPlaceholder: 'Select courses...',
          addTextPlaceholder: 'Add text...',
          add: 'Add',
          coursesRequired: 'Courses are required',
          coursesMustBeAdjacent: 'Courses must be adjacent',
        },
        substagesSetup: {
          add: 'Add',
          name: 'Name',
          abbreviation: 'Abbreviation',
          addTextPlaceholder: 'Add text...',
        },
        referenceGroupsSetup: {
          nameFormat: 'Name Format',
          nameFormatPlaceholder: 'Select a format...',
          prefix: 'Prefix',
          prefixPlaceholder: 'Prefix...',
          digits: 'Digits',
          digitsPlaceholder: 'Digits...',
          offeredGroups: 'Offered Groups',
          course: 'Course',
          numberOfGroups: 'Nº of groups',
          nameFormatOptions: {
            alphabetical: 'Letters (A, B, C)',
            numerical: 'Numbers (1, 2, 3, 4)',
            custom: 'Custom',
          },
        },
        seatsPerCourseSetup: {
          offeredSeats: 'Offered Seats',
          seatsVaryByCourse: 'Seats vary by course',
          numberOfSeats: 'Nº of seats',
          course: 'Course',
        },
        classConfiguration: 'Class Configuration',
        referenceGroups: 'Reference Groups',
        referenceGroupsInfo:
          'Reference groups are those in which the same set of students share most of the subjects and the same classroom.',
        privacy: 'Privacy',
        hideStudentsFromEachOther:
          'Students cannot see each other (this option disables chat options among students)',
        automaticAssignment: 'Automatic Assignment',
        autoAssignmentDescription:
          'All new students enrolled in the program are automatically assigned in all previously assigned tasks (you can customize it in each assignment, but this will be the default option).',
        cancel: 'Cancel',
        createProgram: 'Create program',
        saveChanges: 'Save changes',
        validation: { abbreviation: 'Maximum 8 characters' },
      },
    },
    setup: {
      title: 'Setup new program',
      editTitle: 'Edit program',
      basicData: {
        step_label: 'Basic Data',
        labels: {
          title: 'Basic Data',
          name: 'Program name',
          color: 'Color:',
          image: 'Image:',
          abbreviation: 'Program abbreviation',
          evaluationSystem: 'Evaluation system',
          creditSystem: 'Use credit system',
          creditsTitle: 'Total credits and hours',
          credits: 'Créditos',
          totalHours: 'Total hours',
          oneStudentGroup: 'This program has only one group of students',
          groupsIDAbbrev: 'Groups ID Abbreviation',
          maxGroupAbbreviation: 'Max abbreviation length for groups',
          maxGroupAbbreviationIsOnlyNumbers: 'Only numbers',
          privacy: 'Privacy',
          hideStudentsToStudents: 'Hide the list of users to student profile',
          buttonNext: 'Next',
        },
        descriptions: {
          maxGroupAbbreviation:
            'If the creation of more than one group of students (classrooms) is needed per subject, this configuration allows the possibility to define the alphanumeric ID format.',
        },
        placeholders: {
          name: 'My awesome program',
          abbreviation: 'HIGSxxxx',
        },
        helps: {
          abbreviation: '(8 char. max)',
          maxGroupAbbreviation: '(i.e: G01, G02, G03…)',
        },
        errorMessages: {
          name: {
            required: 'Required field',
          },
          abbreviation: {
            required: 'Required field',
          },
          evaluationSystem: {
            required: 'Required field',
          },
          maxGroupAbbreviation: {
            required: 'Required field',
          },
        },
      },
      coursesData: {
        step_label: 'Courses',
        labels: {
          title: 'Courses',
          oneCourseOnly: 'This program takes one course only',
          hideCoursesInTree: 'Hidden courses in the tree (subjects not nested behind courses)',
          moreThanOneAcademicYear:
            'There are subjects that are offered in several courses simultaneously',
          maxNumberOfCourses: 'Number of courses',
          courseCredits: 'Credits per course',
          courseSubstage: 'Course substages',
          haveSubstagesPerCourse: 'No substages per course',
          substagesFrequency: 'Frequency',
          numberOfSubstages: 'Number of substages',
          subtagesNames: 'Name the substages',
          useDefaultSubstagesName: 'Use the default name and abbreviation',
          abbreviation: 'Abbreviation',
          maxSubstageAbbreviation: 'Max abbrevation length',
          maxSubstageAbbreviationIsOnlyNumbers: 'Only numbers',
          buttonNext: 'Next',
          buttonPrev: 'Previous',
          cycles: 'Cycles',
          haveCycles: 'There are cycles or groupings of courses',
          cycleName: 'Cycle name',
          cycleNameRequired: 'Cycle name required',
          cycleCourses: 'Courses included',
          cycleCoursesRequired: 'Field required',
          add: 'Add cycle',
          remove: 'Remove',
          edit: 'Edit',
          accept: 'Accept',
          cancel: 'Cancel',
        },
        placeholders: {
          substagesFrequency: 'Select frequency',
        },
        errorMessages: {
          abbrevationOnlyNumbers: 'Only numbers allowed',
          maximunSubstageAbbreviation: 'Maximum {n} characters',
          useDefaultSubstagesName: {
            required: 'Required field',
          },
          maxNumberOfCourses: {
            required: 'Required field',
          },
          courseCredits: {
            required: 'Required field',
          },
          substagesFrequency: {
            required: 'Required field',
          },
          numberOfSubstages: {
            required: 'Required field',
          },
          maxSubstageAbbreviation: {
            required: 'Required field',
          },
        },
      },
      subjectsData: {
        step_label: 'Subjects',
        labels: {
          title: 'Subjects',
          standardDuration: 'Standard duration of the subjects',
          allSubjectsSameDuration:
            'All subjects have the same duraction as the evaluation substage',
          numberOfSemesters: 'Number of semesters',
          periodName: 'Period name',
          numOfPeriods: 'Number of periods',
          substagesFrequency: 'Frecuency',
          knowledgeAreas: 'Knowledge areas abbreviation',
          haveKnowledge: 'Program has Knowledge areas',
          maxKnowledgeAbbreviation: 'Max abbreviation length for areas:',
          maxKnowledgeAbbreviationIsOnlyNumbers: 'Only numbers',
          subjectsIDConfig: 'Subjects ID configuration',
          subjectsFirstDigit: 'First digit',
          subjectsDigits: 'Digits',
          buttonNext: 'Save Program',
          buttonPrev: 'Previous',
          buttonAdd: 'Add',
          buttonRemove: 'Remove',
        },
        helps: {
          maxKnowledgeAbbreviation: '(i.e: MKTG, MATH, HIST…)',
        },
        errorMessages: {
          periodName: {
            required: 'Required field',
          },
          numOfPeriods: {
            required: 'Required field',
          },
          substagesFrequency: {
            required: 'Required field',
          },
        },
      },
      frequencies: {
        year: 'Annual',
        semester: 'Half-yearly(Semester)',
        quarter: 'Four-month period',
        trimester: 'Quarterly(Trimester/Quarter)',
        month: 'Monthly',
        week: 'Weekly',
        day: 'Daily',
      },
      firstDigits: {
        course: 'Course Nº',
        none: 'None',
      },
    },
  },
  newSubjectsPage: {
    title: 'Subject Listing',
    emptyStates: {
      noProgramsCreated:
        'No programs have been created. To start with the subject listing, please create a program first',
      createProgram: 'Create program',
      noSubjectsCreated: 'No subjects have been created. Please create a subject',
      noSubjectsArchived: 'No subjects have been archived yet.',
    },
    labels: {
      publishedSubjects: 'Published',
      archivedSubjects: 'Archived',
      addNewSubject: 'New Subject',
      subject: 'Subject',
      classrooms: 'Classrooms',
      courses: 'Courses',
      course: 'Course',
      type: 'Type',
      substages: 'Substages',
      noSubstages: 'Full course',
      actions: 'Actions',
      cancel: 'Cancel',
      edit: 'Edit',
      duplicate: 'Duplicate',
      archive: 'Archive',
      restore: 'Restore',
      remove: 'Remove',
      accept: 'Accept',
      add: 'Add',
      cannotDeleteSubject: 'Only subjects with no students or teachers enrolled can be deleted.',
    },
    drawer: {
      title: 'New subject',
      updateTitle: 'Edit subject',
      requiredField: 'Required field',
      others: 'Others',
      save: 'Save',
      textPlaceholder: 'Add text...',
      createSubject: 'Create subject',
      cancel: 'Cancel',
      saveChanges: 'Save changes',
      basicData: {
        title: 'Basic Data',
        presentation: 'Presentation',
        name: 'Name',
        internalId: 'Unique ID (numeric, 3 digits)',
        color: 'Color',
        featuredImage: 'Image',
        icon: 'Icon',
      },
      features: {
        title: 'Features',
        knowledgeArea: 'Knowledge area',
        knowledgeAreaPlaceholder: 'Select an area...',
        type: 'Type',
        typePlaceholder: 'Select a type...',
        numberOfCredits: 'Number of credits',
        numberOfCreditsPlaceholder: 'Credits per course...',
      },
      offer: {
        title: 'Offer',
        coursesWhereItIsOffered: 'Courses where it is offered',
        coursesWhereItIsOfferedPlaceholder: 'Choose one or more courses...',
        substageWhereItIsOffered: 'Substage where it is offered',
        substageWhereItIsOfferedPlaceholder: 'Chose one...',
      },
      classroomsSetup: {
        title: 'Classrooms Setup',
        numberOfClassrooms: 'Number of classrooms',
        classroom: 'Classroom',
        classroomId: 'Classroom ID',
        alias: 'Alias',
        seats: 'Available seats',
        disableReferenceGroups: 'This subject does not belong to a Reference Group',
        referenceGroup: 'Reference group',
        referenceGroupPlaceholder: 'Select...',
      },
      validation: {
        internalIdMaxLength: 'ID must be a maximum of 3 digits',
        internalIdFormat: 'ID must be numeric ',
        atLeastOneClassroom: 'At least one classroom is needed',
        atLeastOneSeat: 'Value cannot be less than 1',
        requiredField: 'Required field',
        referenceGroupAlreadyInUse:
          'This reference group is already being used. Please select another one.',
      },
    },
    deleteModal: {
      title: 'Delete subject',
      description: 'Are you sure you want to delete the subject "{subjectName}"? ',
      confirm: 'Delete',
    },
    duplicateModal: {
      title: 'Duplicate subject',
      description:
        'You are going to duplicate the subject "{subjectName}". Keep in mind that the students enrolled in this subject will not be transferred',
      confirm: 'Duplicate',
    },
    alerts: {
      success: {
        add: 'Subject created successfully.',
        update: 'Subject updated successfully.',
        delete: 'Subject deleted successfully.',
        duplicate: 'Subject duplicated successfully.',
      },
      failure: {
        add: 'The Subject could not be created. ',
        update: 'The Subject could not be updated. ',
        delete: 'The Subject could not be deleted. ',
        duplicate: 'The Subject could not be duplicated. ',
      },
    },
  },
  subject_page: {
    page_title: 'Subjects configuration',
    page_description:
      'Define first the types of subjects (core, elective...) and the areas of knowledge (if applicable to your program).',
    centerLabel: 'Center',
    centerPlaceholder: 'Select a center',
    programLabel: 'Program',
    programPlaceholder: 'Select a program',
    addKnowledgeDone: 'Knowledge saved',
    addSubjectTypeDone: 'Subject type saved',
    subjectCreated: 'Subject created',
    groupCreated: 'Group created',
    classCreated: 'Class created',
    classUpdated: 'Class updated',
    goTree: 'Go to tree',
    knowledge: {
      title: 'Knowledge areas',
      name: 'Name',
      nameRequired: 'Required field',
      abbreviation: 'Abbr.',
      abbreviationRequired: 'Required field',
      color: 'Color',
      colorRequired: 'Required field',
      icon: 'Icon',
      creditsCourse: 'Cr. Course',
      creditsProgram: 'Cr. Program',
      maxLength: 'Max length: {max}',
      onlyNumbers: 'Only numbers',
    },
    subjectTypes: {
      title: 'Types of subjects',
      name: 'Name',
      nameRequired: 'Required field',
      creditsCourse: 'Cr. Course',
      creditsProgram: 'Cr. Program',
      groupVisibility: 'Group visibility',
      groupVisibilityLabel: 'Avoid nested groups',
    },
    subjects: {
      addSubject: 'Add subject',
      newTitle: 'New subject',
      title: 'Subjects',
      course: 'Course/s',
      id: 'ID',
      idRequired: 'Required field',
      courseRequired: 'Required field',
      subject: 'Subject',
      noSubjectsFound: 'No subjects found',
      subjectRequired: 'Required field',
      knowledge: 'Knowledge',
      knowledgeRequired: 'Required field',
      subjectType: 'Type',
      subjectTypeRequired: 'Required field',
      credits: 'Credits',
      color: 'Color',
      colorRequired: 'Required field',
      group: 'Group',
      groupRequired: 'Required field',
      substage: 'Sub-stage',
      seats: 'Seats',
      classroom: 'Classroom',
      schedule: 'Schedule',
      teacher: 'Teacher',
      description: 'Description',
      maxInternalIdLength: 'Must be {max} numbers',
      groupAny: 'Must be {max} characters',
      groupNumbers: 'Must be {max} numbers',
    },
    tableActions: {
      add: 'Add',
      remove: 'Remove',
      edit: 'Edit',
      accept: 'Accept',
      cancel: 'Cancel',
    },
    programTreeType: {
      title: 'Configure {name} tree view',
      description1:
        'Configure portfolio tree view in order to adapt it to your specific program characteristics. This setting can be changed whenever needed.',
      note: 'NOTE:',
      description2:
        'See only the schemas that fit with previous configuration. “Group visibility” (from Subject type configuration), will be respected independent of tree schema chosen.',
      opt1Label: 'Classroom first',
      opt1DescriptionCycle: 'Program > Cycle > Course > Group > Type > Area > Subject',
      opt1DescriptionNoCourseCycle: 'Program > Cycle > Group > Type > Area > Subject',
      opt2DescriptionCycle: 'Program > Cycle > Course > Group > Area > Type > Subject',
      opt2DescriptionNoCourseCycle: 'Program > Cycle > Group > Area > Type > Subject',
      opt3DescriptionCycle: 'Program > Cycle > Course > Type > Area > Subject',
      opt3DescriptionNoCourseCycle: 'Program > Cycle > Type > Area > Subject',

      opt1Description: 'Program > Course > Group > Type > Area > Subject',
      opt1DescriptionNoCourse: 'Program > Group > Type > Area > Subject',
      opt2Label: 'Classroom + Area first',
      opt2Description: 'Program > Course > Group > Area > Type > Subject',
      opt2DescriptionNoCourse: 'Program > Group > Area > Type > Subject',
      opt3Label: 'Subject first',
      opt3Description: 'Program > Course > Type > Area > Subject',
      opt3DescriptionNoCourse: 'Program > Type > Area > Subject',
      opt4Label: 'Free schema',
      opt4Description: 'Program > Type > Area > Subject',
    },
  },
  profiles_page: {
    page_title: 'Academic portfolio - Profiles setup',
    page_description:
      'First, it is necessary to match the system profiles with the custom profiles that have been created on the platform (Please read the characteristics of each profile carefully. Once the profiles are linked, it cannot be undone.)',
    save: 'Save',
    profileSaved: 'Saved profiles',
    profiles: 'Profiles',
    teacher: 'Teacher',
    teacherDescription: 'Responsible for teaching the subjects of a program/course',
    teacherRequired: 'Field required',
    student: 'Student',
    studentDescription:
      'Assigned to a classroom, studies the subjects of his program/course with a specific teacher',
    studentRequired: 'Field required',
  },
  tree_page: {
    courseTranslation: 'Course',
    enrollmentAndManagement: 'Enrollment and management',
    deletedStudentSuccess: 'Student successfully deleted',
    deletedStudentError: 'The student could not be deleted',
    cancelHeaderButton: 'Cancel',
    centerPlaceholder: 'Select a center',
    programPlaceholder: 'Select a program',
    basicDataTitle: 'Basic data',
    courseNumber: 'Course number',
    seatsNumber: 'Seats number',
    courseAlias: 'Course alias',
    responsableLabel: 'Responsable',
    responsableMoreConfig: 'For more configuration it is necessary to visit:',
    responsablePrograms: 'Educational programs',
    minimumCredits: 'Minimum credits',
    enrollTitle: 'Enrollment',
    AlertTitle: 'Student Assignment',
    AlertDescription:
      'Assign students to all the classrooms nested at this level from the student database.',
    AlertNote:
      'NOTE: The selected students will be added to the current student lists of each classroom. If it is necessary to consult or edit a group of students, it must be done directly in each classroom',
    enrollButton: 'Enroll students',
    info: 'Info',
    updateClassMessage: 'Class updated successfully',
    updateClassError: 'Error updating class',
    saveChanges: 'Save changes',
    icon: 'Icon',
    iconDescription: 'Icon of the subject',
    image: 'Image',
    imageDescription: 'Image of the subject',
    idLabel: 'ID',
    abbreviationLabel: 'Abbreviation',
    courseLabel: 'Course/s',
    groupLabel: 'Group',
    knowledgeLabel: 'Area',
    subjectTypeLabel: 'Type',
    creditsLabel: 'Credits',
    teachers: 'Teachers',
    mainTeacher: 'Main teacher',
    scheduleAndPlace: 'Schedule and place',
    virtualClassroom: 'Virtual classroom',
    classroomAdress: 'Classroom address or physical location',
    lessonSchedule: 'Lesson schedule',
    actualEnrollment: 'Actual enrollment',
    assignManagerSuccess: 'Manager assigned successfully',
    assignManagerError: 'Error assigning Manager',
    configTreeView: 'Configure tree view',
    page_title: 'Academic Portofolio Tree',
    page_description:
      'This is the Portfolio Tree, it can be edited, duplicated or used to create new elements for your program. Students can also be assigned at any level (all subjects under it will inherit this task).',
    centerLabel: 'Select center',
    programLabel: 'Select program',
    programUpdated: 'Program updated',
    courseUpdated: 'Course updated',
    groupUpdated: 'Group updated',
    groupDuplicated: 'Group duplicated',
    subjectRemoved: 'Subject removed',
    knowledgeUpdated: 'Area updated',
    subjectTypeUpdated: 'Subject type updated',
    subjectUpdated: 'Subject updated',
    classUpdated: 'Class updated',
    cycleUpdated: 'Cycle updated',
    lassCreated: 'Class created',
    treeEdit: 'Edit',
    treeRemove: 'Remove',
    treeDuplicate: 'Duplicate',
    groupsRemoved: 'Group removed from classes',
    classRemoved: 'Class removed',
    groupCreated: 'Group created',
    subjectTypeCreated: 'Subject type created',
    knowledgeCreated: 'Area created',
    newgroups: 'New group',
    newsubjectType: 'New subject type',
    newclass: 'New class',
    newknowledges: 'New area',
    newsubject: 'New subject',
    noProgramEmptyStateDescription:
      'No program has been created yet. To view the tree structure, first create a program.',
    noProgramEmptyStateAction: 'Create program',
    cycleTreeType: {
      title: 'Cycle configuration',
      name: 'Name:',
      save: 'Save',
    },
    enrrollmentDrawer: {
      cancel: 'Cancel',
      enrollStudents: 'Enroll students',
      searchUsersByTag: 'Search by tags',
      searchUsersByData: 'Search by user data.',
      enrollmentSuccess: 'Enrollment successful.',
      enrollmentError: 'Enrollment error.',
      enrollmentSeatsError: 'Enrollment error: No available seats in some classroom or group ',
      remove: 'Eliminar',
    },
    studentsTable: {
      surnames: 'Surnames',
      name: 'Name',
      email: 'Email',
      birthdate: 'Birthdate',
      searchBarPlaceholder: 'Search students by name, surnames or email',
    },
    addUsers: {
      title: 'Assign Students',
      description:
        'Assign students to all classrooms nested on this level from the student database.',
      note: 'NOTE:',
      noteDescription:
        'selected students will be added to the current student lists for each classroom. If consultation or editing of a group of students is needed, it must be done directly in each classroom.',
      byTag: 'Select by tag',
      byData: 'Search by user data',
      addTag: 'Add',
      emailHeader: 'Email',
      nameHeader: 'Name',
      surnameHeader: 'Surname',
      birthdayHeader: 'Birthday',
      studentsFound: '{{count}} Students have been found',
      selected: '{{count}} Selected',
      studentsError:
        '{{count}} students are already included in all classes and cannot be added again',
      studentsWarning:
        '{{count}} students are already included in one of the classes and can be added to the rest of the classes.',
      seatsError1: 'The following classes are already fully booked:',
      seatsError2:
        'Please access each class individually and add as many students as needed, or reduce the number of students.',
      seatsClassError: '- {{className}} ({{seats}} seats left)',
      addStudent: 'Add student',
      userAlreadySelected: 'User already selected',
      removeUser: 'Remove',
      managersLabel: 'Responsible for reference',
    },
    program: {
      title: 'Program configuration',
      nameLabel: 'Program name:',
      abbreviationLabel: 'Program abbreviation/acronym:',
      abbreviationHelper: '8 char. max',
      creditsLabel: 'Total credits:',
      nameRequired: 'Required field',
      abbreviationRequired: 'Required field',
      creditsRequired: 'Required field',
      visitProgramDescription: 'For further configuration it is necessary to visit',
      visitProgramLabel: '“Educational Programs”',
      save: 'Save',
    },
    course: {
      title: 'Course configuration',
      numberLabel: 'Course number:',
      nameLabel: 'Course alias:',
      nameHelper: 'i.e. “1st Grade”',
      creditsLabel: 'Minimum credits:',
      visitProgramDescription: 'For further configuration it is necessary to visit',
      visitProgramLabel: '“Educational Programs”',
      save: 'Save',
    },
    group: {
      titleNew: 'New group',
      duplicateTitle: 'Duplicate group',
      duplicateWarning:
        'When duplicating a group, new classrooms are created that inherit the basic configuration of the subjects nested in the current group (such as the type, or the area of knowledge), but a new set of students, teachers, places, etc. must be specified for these new classrooms.',
      title: 'Group configuration',
      abbreviationLabel: 'Group abbreviation:',
      abbreviationHelper: '3 char. max',
      aliasLabel: 'Group alias:',
      aliasHelper: 'i.e. “Main Group”',
      aliasRequired: 'Required field',
      groupAny: 'Must be {max} characters',
      groupNumbers: 'Must be {max} numbers',
      save: 'Save',
      assignSubjects: {
        title: 'Assign subjects',
        description1:
          'New classrooms will be created for this group from the selected subjects, later, new students can be assigned and its properties modified.',
        notes: 'NOTE:',
        description2:
          ' In order to create a new group keeping all settings except the assigned students, please use the "duplicate" option instead.',
      },
    },
    subjectType: {
      titleNew: 'New subject type',
      title: 'Subject type configuratión',
      nameLabel: 'Name:',
      nameRequired: 'Required field',
      crCourse: 'Credits course:',
      crProgram: 'Credits program:',
      nested: 'Avoid nested groups',
      save: 'Save',
      assignSubjects: {
        title: 'Assign/Re-asssign subjects',
        description:
          'The new type will be modified or added to the selected subjects, keeping the remaining information. This can be done manually by dragging the existing subjects to this new type in the tree.',
      },
    },
    knowledge: {
      titleNew: 'New area',
      title: 'Area configuration',
      nameLabel: 'Name:',
      nameRequired: 'Required field',
      abbreviationLabel: 'Abbreviation:',
      abbreviationHelper: '{max} char',
      abbreviationRequired: 'Required field',
      colorLabel: 'Color:',
      colorRequired: 'Required field',
      crCourse: 'Credits course:',
      crProgram: 'Credits program:',
      maxLength: 'Max length: {max}',
      save: 'Save',
      assignSubjects: {
        title: 'Assign/Re-asssign subjects',
        description:
          'The new area will be modified or added to the selected subjects, keeping the remaining information. This can be done manually by dragging the existing subjects to this new area in the tree.',
      },
    },
    class: {
      title: 'Subject configuration',
      subjectNameLabel: 'Subject name:',
      subjectNameRequired: 'Required field',
      subjectTypeRequired: 'Required field',
      knowledgeRequired: 'Required field',
      subjectType: 'Type',
      knowledge: 'Knowledge',
      classrooms: 'Classrooms',
      newClassroom: 'Add new classroom',
      save: 'Save',
      courseLabel: 'Course:',
      groupLabel: 'Group:',
      substageLabel: 'Sub-stage:',
      imageSubjectLabel: 'Image:',
      imageLabel: 'Image (Replaces the subject image):',
      iconLabel: 'Icon:',
      seatsLabel: 'Seats:',
      knowledgeLabel: 'Area:',
      colorLabel: 'Color:',
      scheduleLabel: 'Schedule:',
      scheduleAndLocation: 'Schedule and location',
      addressLabel: 'Address or physical location of the classroom:',
      virtualUrlLabel: 'Virtual classroom (video-call link):',
      notValidUrl: 'Not a valid URL',
      teacherLabel: 'Main Teacher',
      teachersLabel: 'Teachers',
      associateTeachersLabel: 'Associate teachers',
      teacherDescription: 'Assign a main teacher for this classroom',
      studentsLabel: 'Students',
      addStudents: 'Add students',
      addStudentsDescription: 'Add students to this classroom',
      cancelAddStudents: 'Cancel',
      studentsAddedSuccessfully: 'Students added successfully',
      removeStudentSuccess: 'Student successfully removed.',
      removeStudentError: 'The student could not be removed.',
      noStudentsYet: 'No students yet',
      findStudents: 'Find',
      changeTeacherButtonLabel: 'Change',
      newClass: 'New classroom',
      basicInformation: 'Basic information',
      groupsOfClasse: 'Groups of classe',
      studentsEnrolled: 'Currently enrolled',
      saveChanges: 'Save changes',
      removeSubject: 'Remove subject',
      removeClassroom: 'Remove classroom',
      remove: 'Remove',
      attention: 'Attention',
      groupAny: 'Must be {max} characters',
      groupNumbers: 'Must be {max} numbers',
      enrollStudents: 'Enroll students',
      currentlyEnrolled: 'Currently enrolled',
      subjectChangeCourse:
        'Your tree model indicates that your courses are structuring, i.e. subjects are nested within course levels. When making a course change, the subject will disappear from the current course level and will be moved to the newly selected course.',
      subjectChangeCourseButton: 'Change anyway',
      removeSubjectButton: 'Eliminate anyway',
      cancelClassroomButton: 'Cancel',
      show: 'Show',
      goTo: 'Go to',
      removeSubjectDescription:
        '<strong>This action is not recommended if there is already content or assignments associated with this subject.</strong> <br/><br/> Deleting a subject will archive all class groups associated with it and all activities created or assigned that use this subject, as well as related assessments. <br/><br/> Errors may also occur when editing related activities.',
      removeClassDescription:
        '<strong>This action is not recommended if there is already content or assignments associated with this classroom.</strong> <br/><br/> Deleting a classroom will archive all activities created or assigned that use this classroom, as well as related assessments. <br/><br/> Errors may also occur when editing related activities.',
    },
  },
  selectSubjectsByTable: {
    subjectTypeLabel: 'Subject type:',
    knowledgeLabel: 'Knowledge:',
    subjectLabel: 'Find subject:',
    tableId: 'ID',
    tableName: 'Name',
    tableKnowledge: 'Knowledge',
    tableType: 'Type',
  },
  userClassesSwiperWidget: {
    multiCourse: 'Multi-course',
    subjects: 'Subjects',
    multiSubject: 'Multisubject',
  },
  tabDetail: {
    label: 'Classroom',
  },
  classDetailWidget: {
    emailHeader: 'Email',
    nameHeader: 'Name',
    surnameHeader: 'Surname',
    birthdayHeader: 'Birthday',
    teachers: 'Teachers',
    students: 'Students',
  },
  classStudents: {
    label: 'Students',
  },
  subjectsDrawer: {
    add: 'Add subject',
    edit: 'Edit subject',
    save: 'Save subject',
  },

  common: {
    defaultGroupName: 'Default group',
  },
  classroomPicker: {
    and: 'and',
    more: 'more',
    monday: 'Mo',
    tuesday: 'Tu',
    wednesday: 'We',
    thursday: 'Th',
    friday: 'Fr',
    saturday: 'Sa',
    sunday: 'Su',
    selectSubject: 'Select subject',
    noMore: 'No more subjects available',
    collision: 'Some subjects are not compatible',
    allSubjects: 'All subjects',
  },
  selectSubjectAndCourse: {
    subject: 'Subject',
    course: 'Course',
  },
};
