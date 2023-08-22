import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import { getSubjectCredits, getSubjectsCredits } from '@academic-portfolio/request/subjects';

const { classByIdsRequest } = require('@academic-portfolio/request');

export function getMultiClassData(labels) {
  return {
    id: 'multiSubject',
    subjectName: labels?.multiSubject,
    groupName: labels?.groupName || labels?.multiSubject,
    name: labels?.groupName || labels?.multiSubject,
    icon: '/public/assets/svgs/module-three.svg',
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
    name: `${klass?.subject?.name}${klass?.groups?.isAlone ? '' : ` - ${klass?.groups?.name}`}`,
    subjectName: klass?.subject?.name,
    icon: getClassIcon(klass),
    color: klass?.color,
    internalId: subjectsCredits[i]?.internalId,
    subjectCompiledInternalId: subjectsCredits[i]?.compiledInternalId,
  }));
}

export default async function getClassData(
  classes,
  labels = { multiSubject: 'Multi-Subject' },
  multiSubject
) {
  if (multiSubject) {
    return getMultipleClassData(classes);
  }
  if (classes.length > 1) {
    return getMultiClassData(labels);
  }

  const klass = classes[0];
  const response = await classByIdsRequest(klass);
  const data = response.classes[0];
  const { subjectCredits } = await getSubjectCredits({
    program: data.subject.program,
    subject: data.subject.id,
  });

  let name = labels?.groupName;

  if (!name) {
    if (data?.groups?.isAlone) {
      name = '';
    } else if (data?.groups?.name) {
      name = `${data?.subject?.name} - ${data?.groups?.name}`;
    } else {
      name = `${data?.subject?.name} - ${data?.groups?.abbreviation}`;
    }
  }

  return {
    id: klass,
    name,
    subjectName: data?.subject?.name,
    groupName: labels?.groupName || data?.groups?.isAlone ? '' : data?.groups?.name,
    icon: getClassIcon(data),
    color: data?.color,
    customGroup: !!labels?.groupName,
    internalId: subjectCredits.internalId,
    subjectCompiledInternalId: subjectCredits.compiledInternalId,
  };
}
