const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

async function init() {
  await client.connect();
  database = client.db();
}

async function getFreeDeployments() {
  const deployments = database.collection('package-manager_deployments');
  return deployments.find({ type: { $ne: 'basic' } }).toArray();
}

async function updatePrograms(deploymentIds) {
  const programs = database.collection('v1::academic-portfolio_programs');

  return programs.updateMany(
    { deploymentID: { $in: deploymentIds } },
    { $set: { sequentialCourses: true, useCustomSubjectIds: true } }
  );
}

async function updateSubject({
  subject,
  subjectsCollection,
  classesCollection,
  deploymentIds,
  courseId,
}) {
  const correspondingClass = await classesCollection.findOne({
    subject: subject.id,
    deploymentID: { $in: deploymentIds },
  });
  if (correspondingClass) {
    const subjectColorResults = await subjectsCollection.updateOne(
      { id: subject.id, deploymentID: { $in: deploymentIds } },
      { $set: { color: correspondingClass.color } }
    );
    console.log('subjectColorResults', subjectColorResults);
  }

  if (courseId) {
    const subjectCourseResults = await subjectsCollection.updateOne(
      { id: subject.id, deploymentID: { $in: deploymentIds } },
      { $set: { course: JSON.stringify([courseId]) } }
    );
    console.log('subjectCourseResults', subjectCourseResults);
  }
}

async function updateSubjects(deploymentIds) {
  const subjects = database.collection('v1::academic-portfolio_subjects');
  const classes = database.collection('v1::academic-portfolio_classes');
  const groups = database.collection('v1::academic-portfolio_groups');

  // Find the course group. The free tier allows the user to have only one course per Program.
  const course = await groups.findOne({ type: 'course', deploymentID: { $in: deploymentIds } });
  const courseId = course ? course.id : null;

  const allSubjects = await subjects.find({ deploymentID: { $in: deploymentIds } }).toArray();

  await allSubjects.reduce(async (promise, subject) => {
    await promise;
    return updateSubject({
      subject,
      subjectsCollection: subjects,
      classesCollection: classes,
      courseId,
      deploymentIds,
    });
  }, Promise.resolve());

  // All subjects can have one single class only with the free tire, so we set the classWithoutGroupId to '001' to every class
  const updateClassesResult = await classes.updateMany(
    { deploymentID: { $in: deploymentIds } },
    { $set: { classWithoutGroupId: '001' } }
  );
  console.log('updateClassesResult', updateClassesResult);
}

async function removeGroupsAndClassgroups(deploymentIds) {
  const groups = database.collection('v1::academic-portfolio_groups');
  const classgroups = database.collection('v1::academic-portfolio_classgroups');

  const groupsToDelete = await groups
    .find({ type: 'group', abbreviation: '-auto-', deploymentID: { $in: deploymentIds } })
    .toArray();
  const groupsToDeleteIds = groupsToDelete?.map((item) => item.id);

  const groupsDeletionResults = await groups.deleteMany({ id: { $in: groupsToDeleteIds } });
  const groupsClassDeletionResults = await classgroups.deleteMany({
    deploymentID: { $in: deploymentIds },
    group: { $in: groupsToDeleteIds },
  });
  console.log('groupsToDelete', groupsToDelete);
  console.log('groupsDeletionResult', groupsDeletionResults);
  console.log('groupsClassDeletionResults', groupsClassDeletionResults);
}

(async () => {
  try {
    await init();
    const freeDeployments = await getFreeDeployments();
    const freeDeploymentsIds = freeDeployments?.map((deployment) => deployment.id) ?? [];

    if (freeDeploymentsIds?.length) {
      const programsUpdated = await updatePrograms(freeDeploymentsIds);
      console.log('programsUpdated', programsUpdated);
      await updateSubjects(freeDeploymentsIds);
      await removeGroupsAndClassgroups(freeDeploymentsIds);
    }

    await client.close();
  } catch (error) {
    console.error('error', error);
    await client.close();
  }
})();

/*

db.getCollection("v1::academic-portfolio_groups").aggregate([
 {
    $match: {
      type: "group"
    }
  },
    {
    $lookup: {
      from: "v1::package-manager_deployments",
      localField: "deploymentID",
      foreignField: "id",
      as: "deploymentInfo"
    }
  },
  { $unwind: "$deploymentInfo" },
  { $match: { "deploymentInfo.type": { $ne: 'basic' } } },
  {
    $group: {
      _id: null,
      uniqueTypes: { $addToSet: "$abbreviation" }
    }
  }
]);

*/
