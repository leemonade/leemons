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

// COURSE AND GROUPS INFO
async function getAllGroupIds(classIds) {
  const classCoursesCollection = database.collection('v1::academic-portfolio_classgroups');
  return classCoursesCollection
    .find({ class: { $in: classIds } }, { projection: { group: 1 } })
    .toArray();
}

async function getAllGroups() {
  const groupsCollection = database.collection('v1::academic-portfolio_groups');
  const groupsFound = await groupsCollection
    .find({ projection: { name: 1, type: 1, index: 1, id: 1 } })
    .toArray();

  const allCourses = [];
  const allReferenceGroups = [];
  console.log('groupsfound', groupsFound);

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

  // SUBJECTS
  const subjectIds = Object.values(classes).map((classObj) => classObj.subject);
  const subjectsCollection = database.collection('v1::academic-portfolio_subjects');
  const subjects = await subjectsCollection.find({ id: { $in: subjectIds } }).toArray();
  const subjectMap = subjects.reduce((acc, subject) => {
    acc[subject.id] = subject;
    return acc;
  }, {});
  const subjectsInternalIds = await getSubjectsInternalIds(subjectIds);
  Object.keys(classes).forEach((classId) => {
    if (classes[classId].subject && subjectMap[classes[classId].subject]) {
      classes[classId].subject = {
        ...subjectMap[classes[classId].subject],
        internalId: subjectsInternalIds[classes[classId].subject],
      };
    }
  });

  // COURSES AND GROUPS

  // console.log('courseIds', courseIds);
  const groupIds = await getAllGroupIds(Object.keys(classes));

  const { allCourses, allGroups } = await getAllGroups();
  console.log('allCourses', allCourses);
  console.log('allGroups', allGroups);

  // Object.keys(classes).forEach((classId) => {
  //   const classObject = classes[classId];
  //   const { program, classWithoutGroupId, subject } = classObject;
  //   const course = allCourses.filter((crs) => JSON.parse(subject.courses).includes(crs.id));

  //   // Only add course when class' subject isn't offered in more than one - We ignore arrays
  //   if (course?.index) {
  //     classObject.course = course.index;
  //   }

  // if (!classWithoutGroupId) {
  // }
  // });

  // Object.values(classes).forEach((c) => {
  //   console.log(
  //     JSON.stringify(
  //       {
  //         subjectName: c.subject.name,
  //         subjectInternalId: c.subject.internalId,
  //         classWithoutGroupId: c.classWithoutGroupId,
  //         course: c.subject.course,
  //         subject: c.subject,
  //       },
  //       null,
  //       2
  //     )
  //   );
  // });
}

(async () => {
  try {
    await init();
    const calendarsToUpdate = await getCalendarsToUpdate();
    await getClassDetails(calendarsToUpdate);

    await client.close();
  } catch (error) {
    console.error('error', error);
    await client.close();
  }
})();
