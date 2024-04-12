import { sortBy } from 'lodash';

export default function useSubjectName({ klass }) {
  const courses = sortBy(
    Array.isArray(klass?.courses) ? klass?.courses : [klass?.courses],
    'index'
  );

  const groupName = klass?.groups?.abbreviation === '-auto-' ? '' : `${klass?.groups?.name} - `;

  return `${groupName}${klass?.subject?.name} ${courses.map((course) => course?.name).join(', ')}`;
}
