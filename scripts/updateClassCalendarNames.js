const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

async function init() {
  await client.connect();
  database = client.db();
}

async function getCalendarsToUpdate() {
  const calendarsCollection = database.collection('v1::calendar_calendars');
  return calendarsCollection.find({ section: 'calendar.classes' }).toArray();
}

// SUBJECTS INFO
async function getSubjectsInternalIds(subjectIds) {
  const subjectsCollection = database.collection('v1::academic-portfolio_programsubjectscredits');
  const subjectsInfo = await subjectsCollection
    .find({ subject: { $in: subjectIds } }, { projection: { subject: 1, internalId: 1 } })
    .toArray();

  return subjectsInfo.reduce((acc, subject) => {
    acc[subject.subject] = subject.internalId;
    return acc;
  }, {});
}

async function getPrograms(programIds) {
  const programsCollection = database.collection('v1::academic-portfolio_programs');
  return programsCollection.find({ id: { $in: programIds } }).toArray();
}

// COURSE AND GROUPS INFO
async function getAllGroupIds(classIds) {
  const classCoursesCollection = database.collection('v1::academic-portfolio_classgroups');
  return classCoursesCollection
    .find({ class: { $in: classIds } }, { projection: { group: 1, class: 1 } })
    .toArray();
}

async function getAllGroups() {
  const groupsCollection = database.collection('v1::academic-portfolio_groups');
  const groupsFound = await groupsCollection.find({}).toArray();

  const allCourses = [];
  const allReferenceGroups = [];

  await groupsFound.forEach((group) => {
    if (group.type === 'course') {
      allCourses.push(group);
    } else if (group.type === 'group') {
      allReferenceGroups.push(group);
    }
  });

  return { allCourses, allGroups: allReferenceGroups };
}

async function getClassDetails(calendars) {
  const classes = {};
  calendars.forEach((calendar) => {
    const keyParts = calendar.key.split('.');
    if (keyParts.length > 2) {
      const classId = keyParts[2];
      if (!classes[classId]) {
        classes[classId] = { calendarId: calendar.id };
      }
    }
  });

  const classIds = Object.keys(classes);
  const classesCollection = database.collection('v1::academic-portfolio_classes');
  const classCalendars = await classesCollection.find({ id: { $in: classIds } }).toArray();

  classCalendars.forEach((classCalendar) => {
    const classId = classCalendar.id;
    if (classes[classId]) {
      classes[classId] = { ...classes[classId], ...classCalendar };
    }
  });

  // SUBJECTS & PROGRAM
  const subjectIds = Object.values(classes).map((classObj) => classObj.subject);
  const subjectsCollection = database.collection('v1::academic-portfolio_subjects');
  const subjects = await subjectsCollection.find({ id: { $in: subjectIds } }).toArray();
  const subjectMap = subjects.reduce((acc, subject) => {
    acc[subject.id] = subject;
    return acc;
  }, {});
  const subjectsInternalIds = await getSubjectsInternalIds(subjectIds);

  const programIds = Object.values(classes).map((classObj) => classObj.program);
  const allPrograms = await getPrograms(programIds);

  Object.keys(classes).forEach((classId) => {
    if (classes[classId].subject && subjectMap[classes[classId].subject]) {
      classes[classId].subject = {
        ...subjectMap[classes[classId].subject],
        internalId: subjectsInternalIds[classes[classId].subject],
      };
    }
    if (classes[classId].program) {
      classes[classId].program = allPrograms.find((p) => p.id === classes[classId].program);
    }
  });

  // COURSES AND GROUPS
  const groupsByClass = await getAllGroupIds(Object.keys(classes));
  const { allCourses, allGroups } = await getAllGroups();

  Object.keys(classes).forEach((classId, i) => {
    const classObject = classes[classId];
    const { program, classWithoutGroupId, subject } = classObject;

    console.log(
      'index',
      i,
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------'
    );
    console.log(
      'program.maxNumberOfCourses',
      program.maxNumberOfCourses,
      '<= 1 ? course should be undefined'
    );

    if (program.maxNumberOfCourses > 1) {
      let courseIds;
      console.log('subject.course', subject.course);
      try {
        courseIds = JSON.parse(subject.course ?? '[]');
        // console.log('1 courseIds', courseIds);
      } catch (e) {
        if (subject.course?.length && (subject.course || '').startsWith('lrn')) {
          courseIds = [subject.course];
          // console.log('2 courseIds is string', courseIds);
        }
      }

      const course = allCourses.filter((crs) => courseIds.includes(crs.id));

      // We don't want to add course when the subject is offered in more than one course
      if (course?.length === 1) {
        classObject.course = course[0].index;
      }
      console.log('classObject.course', classObject.course);
    }

    if (!classWithoutGroupId) {
      const groupId = groupsByClass.find((g) => g.class === classId).group;
      const groupDetail = allGroups.find((g) => g.id === groupId);
      classObject.group = groupDetail?.abbreviation ?? undefined;

      console.log('classObject.group', classObject.group);
    }
    console.log('classWithoutGroupId', classWithoutGroupId);
    console.log('classObject.alias', classObject.alias);
    console.log('classObject.classroomId', classObject.classroomId);
    console.log('classObject.program.id', classObject.program.id);
    console.log('classObject.subject.name', classObject.subject.name);
    console.log('classObject.subject.internalId', classObject.subject.internalId);
    console.log('\n');
  });

  return classes;
}
const getClassName = (classData) => {
  if (classData.group) {
    return classData.group;
  }

  if (classData?.alias && classData?.classroomId) {
    return `${classData.classroomId} - ${classData.alias}`;
  }
  if (classData?.alias) {
    return classData.alias;
  }
  if (classData?.classroomId) {
    return classData.classroomId;
  }
  if (classData?.classWithoutGroupId) {
    return classData.classWithoutGroupId;
  }
  throw new Error('No class could be processed');
};

async function updateCalendarNames(classes) {
  const calendarsCollection = database.collection('v1::calendar_calendars');
  const bulkOp = calendarsCollection.initializeUnorderedBulkOp();

  Object.keys(classes).forEach((classId) => {
    const classObject = classes[classId];

    const subjectSuffix = classObject.subject.internalId && ` - ${classObject.subject.internalId}`;
    const subjectName = `${classObject.subject.name}${subjectSuffix || ''}`;

    const coursePrefix = classObject.course || '';
    const separator = coursePrefix ? ' - ' : '';

    const className = getClassName(classObject);
    const classNameParsed = `${coursePrefix}${separator}${className}`;

    if (subjectName.trim().length > 0 && classNameParsed.trim().length > 0) {
      const finalName = `${subjectName} - ${classNameParsed}`;

      bulkOp.find({ id: classObject.calendarId }).updateOne({
        $set: { name: finalName },
      });
    } else {
      console.log('Invalid final name for class ID:', classId);
      console.log('Class Object => ', classObject);
    }
  });
  return bulkOp.execute();
}

(async () => {
  try {
    await init();
    const calendarsToUpdate = await getCalendarsToUpdate();
    const totalCalendarsToUpdate = calendarsToUpdate.length;
    const classes = await getClassDetails(calendarsToUpdate);
    const result = await updateCalendarNames(classes);
    console.log(
      '✨✨✨ Bulk update completed. -------------------------------------------------------------------------- '
    );
    console.log('Total calendars to update:', totalCalendarsToUpdate);
    console.log('Matched count:', result.nMatched);
    console.log('Modified count:', result.nModified);
    if (result.hasWriteErrors()) {
      console.log('Errors:', result.getWriteErrors());
    }

    await client.close();
  } catch (error) {
    console.error('error', error);
    await client.close();
  }
})();
