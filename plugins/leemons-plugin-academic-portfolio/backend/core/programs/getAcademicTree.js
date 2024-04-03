/* eslint-disable no-param-reassign */
const { programsByIds } = require('./programsByIds');

function handleNonSequentialCourses({ groups, knowledgeAreas, subjects, classes }) {
  let tree = [];
  if (groups.length > 0) {
    tree = groups.map((group) => ({
      id: group.id,
      name: group.name,
      abbreviation: group.abbreviation,
      metadata: group.metadata,
      type: 'group',
      children: subjects
        .filter((subject) =>
          classes.some((cls) => cls.groups?.id === group.id && cls.subject.id === subject.id)
        )
        .map(({ id, name }) => ({ id, name, type: 'subject' })),
    }));

    // Subjects with no group are shown at root level
    const groupedSubjectIds = tree.flatMap((group) => group.children.map((subject) => subject.id));
    const ungroupedSubjects = subjects.filter((subject) => !groupedSubjectIds.includes(subject.id));
    tree.push(...ungroupedSubjects.map(({ id, name }) => ({ id, name, type: 'subject' })));
    return tree;
  }
  if (knowledgeAreas.length > 0) {
    tree = knowledgeAreas.map((knowledgeArea) => ({
      name: knowledgeArea.name,
      abbreviation: knowledgeArea.abbreviation,
      id: knowledgeArea.id,
      type: 'knowledgeArea',
      children: subjects
        .filter((subject) =>
          classes.some(
            (cls) => cls.knowledges?.id === knowledgeArea.id && cls.subject.id === subject.id
          )
        )
        .map(({ id, name }) => ({ id, name, type: 'subject' })),
    }));
    return tree;
  }

  // Cases when no knowledge areas or groups are used
  return [...subjects.map(({ id, name }) => ({ id, name, type: 'subject' }))];
}

function handleSequentialAndSingleCourses({
  cycles,
  courses,
  groups,
  knowledgeAreas,
  subjects,
  classes,
}) {
  let tree = [];

  if (cycles.length > 0) {
    tree = cycles.map((cycle) => ({
      id: cycle.id,
      name: cycle.name,
      index: cycle.index,
      type: 'cycle',
      children: cycle.courses.map((courseId) => ({
        ...(({ index, id }) => ({ index, id }))(courses.find((course) => course.id === courseId)),
        type: 'course',
      })),
    }));
  } else {
    // Handle multiple courses not grouped in cycles
    tree = courses.map((course) => ({
      index: course.index,
      id: course.id,
      type: 'course',
      children: [],
    }));
  }

  tree.forEach((node) => {
    // If node is a cycle, iterate over its children (courses), otherwise directly use the course node
    const targetCourses = node.type === 'cycle' ? node.children : [node];
    targetCourses.forEach((course) => {
      const courseClasses = classes.filter((cls) => cls.courses?.id === course.id);
      const courseGroups = groups.filter((group) => group.metadata.course === course.index);
      const courseKnowledgeAreas = knowledgeAreas; // All knowledge areas are applicable

      if (courseGroups.length > 0) {
        course.children = courseGroups.map((group) => {
          const groupClasses = courseClasses.filter((cls) => cls.groups?.id === group.id);
          const subjectIds = groupClasses.map((cls) => cls.subject.id);
          return {
            id: group.id,
            name: group.name,
            abbreviation: group.abbreviation,
            metadata: group.metadata,
            type: 'group',
            children: subjects
              .filter((subject) => subjectIds.includes(subject.id))
              .map(({ id, name }) => ({ id, name, type: 'subject' })),
          };
        });

        // For classes with no group (within programs that use reference gorups), list them directly under the course
        const noGroupClasses = courseClasses.filter((cls) => !cls.groups);
        const noGroupSubjectIds = noGroupClasses.map((cls) => cls.subject.id);
        course.noGroupSubjects = subjects
          .filter((subject) => noGroupSubjectIds.includes(subject.id))
          .map(({ id, name }) => ({ id, name, type: 'subject' }));
      } else if (courseKnowledgeAreas.length > 0) {
        course.children = courseKnowledgeAreas.map((knowledgeArea) => {
          const knowledgeAreaClasses = courseClasses.filter(
            (cls) => cls.knowledges?.id === knowledgeArea.id
          );
          const subjectIds = knowledgeAreaClasses.map((cls) => cls.subject.id);
          return {
            name: knowledgeArea.name,
            abbreviation: knowledgeArea.abbreviation,
            id: knowledgeArea.id,
            type: 'knowledgeArea',
            children: subjects
              .filter((subject) => subjectIds.includes(subject.id))
              .map(({ id, name }) => ({ id, name, type: 'subject' })),
          };
        });
      } else {
        course.children = subjects.map(({ id, name }) => ({ id, name, type: 'subject' }));
      }
    });
  });

  return tree;
}

async function getAcademicTree({ programId, ctx }) {
  const [programDetails] = await programsByIds({ ids: programId, withClasses: true, ctx });
  const { cycles, courses, groups, knowledgeAreas, subjects, classes, sequentialCourses } =
    programDetails;

  let tree = [];
  if (!sequentialCourses || courses.length === 1) {
    tree = handleNonSequentialCourses({ groups, knowledgeAreas, subjects, classes });
  } else {
    tree = handleSequentialAndSingleCourses({
      cycles,
      courses,
      groups,
      knowledgeAreas,
      subjects,
      classes,
    });
  }

  console.log(tree);
  return tree;
}
module.exports = { getAcademicTree };
