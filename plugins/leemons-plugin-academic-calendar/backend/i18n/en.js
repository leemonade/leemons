module.exports = {
  configList: {
    title: 'Academic calendar',
    description:
      'Defines the start and end dates for each program and course, as well as the usual teaching hours.',
    select_center: 'Select center',
  },
  configDetail: {
    title: 'Configuration {name}',
    switchAllCourses: 'All courses (x{n}) have the same configuration',
    initEndCourse: 'Beginning and end of course',
    allCoursesSameDate: 'All courses share these dates',
    startDate: 'Start date',
    endDate: 'End date',
    schoolDays: 'School days',
    allCoursesSameDays: 'All courses share these days ',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    saturday: 'Saturday',
    Sunday: 'Sunday',
    schoolHour: 'School hours (may include extra-curricular)',
    allCoursesSameHours: 'Same schedule for all courses',
    sameHoursForAllDays: 'Same schedule for all days',
    course: 'Course',
    from: 'From',
    to: 'Until',
    breaks: 'Breaks',
    name: 'Name',
    addBreak: 'Add break',
    save: 'Save',
    fieldRequired: 'Field required',
    configSaved: 'Saved configuration',
    tableAdd: 'Add break',
    tableRemove: 'Remove',
    allCourses: 'All courses',
    calendarOf: 'Program calendar of',
  },
  regionalList: {
    title: 'Regional calendars',
    description:
      'You can create regional calendars to record holidays or vacations in a given territory. <br/> These events can later be associated with your Program Calendars.',
    selectCenter: 'Select center',
    addRegionalCalendar: 'Add regional calendar',
    detailTitle: 'Regional calendar {name}',
    regionalEvents: 'National/regional holidays',
    regionalEventsDescription:
      'If national/regional events are repeated in several different calendars, you can indicate this below.',
    useEventsFrom: 'Use the events of:',
    useEventsFromPlaceholder: 'Choose calendar',
    localEvents: 'Local holidays',
    daysOffEvents: 'Non-school days',
    daysOffEventsDescription:
      'If these days are specific to a particular program and not to a geographic area, we advise you to include them in the program calendar rather than in the regional calendar.',
    name: 'Name',
    nameRequired: 'Name required',
    init: 'Init',
    end: 'End',
    add: 'Add',
    save: 'Save',
    remove: 'Remove',
    edit: 'Edit',
    accept: 'Accept',
    cancel: 'Cancel',
    saved: 'Saved',
    newRegionalCalendar: 'New regional calendar',
    requiredField: 'Required field',
  },
  programList: {
    tableAdd: 'Add break',
    tableRemove: 'Remove',
    saved: 'Saved',
    title: 'Program Calendar',
    description:
      'Sets key dates for specific programs/courses (e.g. start and end of the academic year, assessment sub-stages, exam periods...).',
    selectCenter: 'Select center',
    basic: 'Basic',
    periods: 'Periods',
    preview: 'Preview',
    basicData: 'Basic data',
    hourZone: 'TimeZone:',
    firstDayOfWeek: 'First day of the week:',
    baseRegionalCalendar: 'Base regional calendar:',
    selectCalendar: 'Select calendar',
    forAllProgram: 'For the whole program',
    forEachCourseOfTheProgram: 'For each course in the program',
    course: 'Course',
    courses: 'Courses',
    forAllSubStages: 'For all sub-stages',
    continueButton: 'Continue',
    saveButton: 'Save',
    academicPeriods: 'Academic periods',
    allCoursesShareTheSameDates: 'All courses share the same dates',
    initOfCourse: 'Course start',
    endOfCourse: 'End of course',
    initOfProgram: 'Start of program',
    endOfProgram: 'End of program',
    substagesOrEvaluations: 'SUB-STATES OR EVALUATIONS',
    init: 'Start',
    end: 'End',
    otherEvents: 'OTHER EVENTS',
    name: 'Name',
    addNewEvent: 'Add new event',
    hoursOfPauseOrDailyBreaks: 'Hours of pause or daily breaks',
    hoursOfPauseOrDailyBreaksDescription:
      'Breaks, lunch... these breaks will be automatically reflected in the weekly schedules of each student according to the courses they are enrolled in.',
    from: 'From',
    to: 'Until',
    add: 'Add',
    previous: 'Previous',
    saveAndPreview: 'Save and preview',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    allCourses: 'All courses',
    fieldRequired: 'Field required',
    edit: 'Edit',
    delete: 'Delete',
    frequencies: {
      year: 'Annual',
      semester: 'Half-yearly(Semester)',
      quarter: 'Four-month period',
      trimester: 'Quarterly(Trimester/Quarter)',
      month: 'Monthly',
      week: 'Weekly',
      day: 'Daily',
    },
    eventModal: {
      labels: {
        periodName: 'Period name',
        schoolDays: 'School days',
        nonSchoolDays: 'Non school days',
        withoutOrdinaryDays: 'Without ordinary classes',
        startDate: 'Start date',
        endDate: 'End date',
        color: 'Color',
        add: 'Add',
      },
      placeholders: {
        periodName: 'Final exams',
        startDate: 'Select a start date',
        endDate: 'Select an end date',
        color: 'Select a color',
      },
    },
  },
  calendarKey: {
    regionalEvents: 'National/regional holidays',
    localEvents: 'Local holidays',
    daysOffEvents: 'Non-school days',
    specialSchoolDay: 'Special school day',
    courseStartEnd: 'Start/end of course',
    subStageStartEnd: 'Start/end of substage',
  },
};
