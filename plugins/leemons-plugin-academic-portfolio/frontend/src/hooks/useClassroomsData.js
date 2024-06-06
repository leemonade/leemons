import { useQuery } from '@tanstack/react-query';
import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import { getSubjectCredits, getSubjectsCredits } from '@academic-portfolio/request/subjects';

const { classByIdsRequest } = require('@academic-portfolio/request');

let multiSubjectData;

export function getMultiClassData(labels) {
  return {
    id: 'multiSubject',
    subjectName: labels?.multiSubject,
    name: labels?.groupName || labels?.multiSubject,
    icon: '/public/multisubject-icon.svg',
    color: '#67728E',
  };
}

async function getMultipleClassData(classes) {
  const { classes: classesById } = await classByIdsRequest(classes);

  const { subjectsCredits } = await getSubjectsCredits(
    classesById?.map((klass) => ({
      program: klass?.subject?.program,
      subject: klass?.subject?.id,
    }))
  );

  return classesById?.map((klass, i) => ({
    id: klass?.id,
    subjectName: klass?.subject?.name,
    icon: getClassIcon(klass),
    color: klass?.color,
    internalId: subjectsCredits[i]?.internalId,
    subjectCompiledInternalId: subjectsCredits[i]?.compiledInternalId,
  }));
}

export default function useClassroomsData(
  classes,
  labels = { multiSubject: 'Multiasignatura' },
  multiSubject
) {
  return useQuery(['classroomsData', { classes, labels, multiSubject }], async () => {
    if (multiSubject) {
      return getMultipleClassData(classes);
    }
    if (classes.length > 1) {
      const multiClassData = getMultiClassData(labels);
      multiSubjectData = {
        ...multiClassData,
      };
    }

    const klass = classes[0];
    const response = await classByIdsRequest(klass);
    const data = response.classes[0];
    if (classes.length === 1) {
      const { subjectCredits } = await getSubjectCredits({
        program: data.subject.program,
        subject: data.subject.id,
      });

      return {
        id: klass,
        isMultiSubject: false,
        subjectName: data?.subject?.name,
        groupName: labels?.groupName || !data?.groups ? '' : data?.groups?.name,
        icon: getClassIcon(data),
        color: data?.color,
        courses: data?.courses,
        customGroup: !!labels?.groupName,
        internalId: subjectCredits?.internalId,
        subjectCompiledInternalId: subjectCredits?.compiledInternalId,
      };
    }
    return {
      id: klass,
      isMultiSubject: true,
      subjectName: multiSubjectData?.name,
      groupName: labels?.groupName || !data?.groups ? '' : data?.groups?.name,
      icon: getClassIcon(data),
      color: data?.color,
      courses: data?.courses,
      customGroup: !!labels?.groupName,
    };
  });
}

export { useClassroomsData };
