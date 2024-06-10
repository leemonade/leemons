import { useMemo } from 'react';
import _ from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import getSubjectGroupCourseNamesFromClassData from '@academic-portfolio/helpers/getSubjectGroupCourseNamesFromClassData';
import useTeacherClassesOfSubject from './useTeacherClassesOfSubject';

function difference(...arr) {
  const all = _.uniq(arr.flat());

  return all.filter((item) => !arr.every((array) => array.includes(item)));
}

// EN: Get all the classes of a given subject of the teacher grouped by group if enough students are shared
// ES: Obtiene todas las clases de una asignatura del profesor agrupadas por grupo si hay suficientes alumnos compartidos
export default function useGroupedClasses(subjects, disableGrouping = false) {
  const classes = useTeacherClassesOfSubject(subjects);
  const [t] = useTranslateLoader(prefixPN('common'));

  return useMemo(() => {
    if (!classes?.length) {
      return { classes: [], students: [], nonAssignableStudents: [], assignableStudents: [] };
    }

    const classesOfSubject = _.groupBy(classes, (c) => c.subject);
    const subjectsStudents = Object.entries(classesOfSubject).map(([, cls]) => [
      ...new Set(cls.flatMap((c) => c.c.students)),
    ]);

    const studentsNotPresentInAllSubjects = difference(...subjectsStudents);

    let groups = _.groupBy(
      classes.flatMap((c) => ({
        students: c.c.students,
        assignableStudents: _.difference(c.c.students, studentsNotPresentInAllSubjects),
        nonAssignableStudents: _.intersection(c.c.students, studentsNotPresentInAllSubjects),
        group: c.c.groups?.id,
        class: c,
      })),
      (c) => c.group
    );

    groups = Object.entries(groups).reduce((acc, [id, group]) => {
      const groupStudents = _.uniq(group.flatMap((c) => c.students));

      const shouldDisplayOnlyGroup =
        disableGrouping || group.length <= 1
          ? false
          : group.every(({ students }) => {
              const common = _.intersection(students, groupStudents);
              return (
                (common.length > 0 || students.length === 0) &&
                common.length >= groupStudents.length * 0.8
              );
            });
      const parsedGroupName = getSubjectGroupCourseNamesFromClassData(group[0].class.c);
      if (shouldDisplayOnlyGroup) {
        const groupAssignableStudents = _.uniq(group.flatMap((c) => c.assignableStudents));
        const groupNonAssignableStudents = _.uniq(group.flatMap((c) => c.nonAssignableStudents));
        // We enter here when there are reference groups or when the different subjects share students between classes.
        // the second case requires us to give a generic name to the group.
        // Todo: discuss the need of checking the intersection of students when reference groups are used. We could only do this if the program doesn't use reference groups.
        acc.push({
          label: parsedGroupName.courseAndGroupParsed ?? t('defaultGroupName'),
          type: 'group',
          id,
          students: groupStudents,
          assignableStudents: groupAssignableStudents,
          nonAssignableStudents: groupNonAssignableStudents,
          totalStudents: groupStudents.length,
          classes: group,
        });
      } else {
        acc.push(
          ...group.map((g) => ({
            // label: g.class.label,
            label: parsedGroupName.courseAndGroupParsed,
            type: 'class',
            id: g.class.id,
            students: g.students,
            assignableStudents: g.assignableStudents,
            nonAssignableStudents: g.nonAssignableStudents,
            totalStudents: g.students.length,
            group: g,
          }))
        );
      }

      return acc;
    }, []);

    const students = _.uniq(groups.flatMap((c) => c.students));

    return {
      classes: groups,
      students,
      assignableStudents: _.uniq(groups.flatMap((c) => c.assignableStudents)),
      nonAssignableStudents: studentsNotPresentInAllSubjects,
    };
  }, [classes, t]);
}
