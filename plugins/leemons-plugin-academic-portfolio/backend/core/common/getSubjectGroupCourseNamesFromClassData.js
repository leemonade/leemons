const getGroup = (classData) => {
  if (classData?.groups) {
    return classData?.groups?.name;
  }
  // si tiene classroomId y alias pintamos los dos
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
  return '';
};

const getCourse = (classData) => {
  if (classData?.courses?.index) {
    return classData?.courses?.index;
  }
  // cuando es un array de cursos, no lo pintamos
  return '';
};

const getSubjectGroupCourseNamesFromClassData = (classData) => {
  // Orden curso - customId si hay - alias
  const data = {
    subject: '',
    group: '',
    displayNameforClass: '',
    course: '',
    courseAndGroupParsed: '',
  };
  const subjectName = classData?.subject?.name;
  const subjectId = classData?.subject?.internalId && `- ${classData?.subject?.internalId}`;

  data.subject = `${subjectName} ${subjectId || ''}`;

  const hasGroup = !!classData?.groups;
  if (hasGroup) {
    data.group = getGroup(classData);
  } else {
    data.displayNameforClass = getGroup(classData);
  }

  const courseData = getCourse(classData);
  data.course = `${courseData}`;

  data.courseAndGroupParsed = `${data?.course} ${
    data?.group || (data?.displayNameforClass && data?.course) ? '-' : ''
  } ${data?.group || data?.displayNameforClass}`;

  return data;
};

module.exports = { getSubjectGroupCourseNamesFromClassData };
