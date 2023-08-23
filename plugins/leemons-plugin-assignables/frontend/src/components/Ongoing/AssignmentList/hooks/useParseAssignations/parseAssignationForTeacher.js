import React from 'react';

import { Badge } from '@bubbles-ui/components';

import { forEach, get, uniq } from 'lodash';

import UnreadMessages from '@comunica/components/UnreadMessages';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import { unflatten } from '@common';
import { useClassesSubjects } from '@academic-portfolio/hooks';
import { parseAssignationForCommonView } from './parseAssignationForCommon';

function Completion({ instance }) {
  const { requiresScoring } = instance;
  const students = React.useMemo(() => instance.students || [], [instance.students]);

  const studentsCount = React.useMemo(() => students.length, [students]);
  const studentsWhoCompleted = React.useMemo(
    () => students.filter((student) => !!student.timestamps?.end).length,
    [students]
  );

  const percentage = Math.round((studentsWhoCompleted / studentsCount) * 100);

  const severity = React.useMemo(() => {
    if (instance.alwaysAvailable) {
      return 'default';
    }

    const startDate = new Date(instance.dates.start);
    const deadline = new Date(instance.dates.deadline);
    const now = new Date();

    const totalTime = deadline - startDate;
    const elapsedTime = now - startDate;
    /*
          EN: This formula comes from the following rule of three:
          ES: Esta formula sale de la siguiente regla de tres:

            totalTime        100%             100% * elapsedTime
          -------------  =  ------ ;  x%  =  --------------------
           elapsedTime        x%                  totalTime
        */
    const elapsedPercentage = (100 * elapsedTime) / totalTime;

    if (elapsedPercentage <= 25) {
      if (percentage >= 40) {
        return 'success';
      }
      return 'warning';
    }
    if (elapsedPercentage <= 65) {
      if (percentage >= 70) {
        return 'success';
      }
      if (percentage >= 40) {
        return 'warning';
      }
      return 'error';
    }

    if (percentage >= 90) {
      return 'success';
    }
    if (percentage >= 70) {
      return 'warning';
    }
    return 'error';
  }, [percentage, instance.dates.start, instance.dates.deadline, instance.alwaysAvailable]);

  // TODO: Add custom visualization

  if (!requiresScoring) {
    return (
      <Badge closable={false} color="stroke">
        -
      </Badge>
    );
  }
  return (
    <Badge closable={false} severity={severity}>
      {percentage}%
    </Badge>
  );
}

function useEvaluatedLocalizations() {
  const [, translations] = useTranslateLoader(
    prefixPN('assignment_form.gradeVariations.notEvaluable.label')
  );

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const notEvaluable = get(res, prefixPN('assignment_form.gradeVariations.notEvaluable.label'));

      return {
        notEvaluable,
      };
    }

    return {};
  }, [translations]);
}

function Evaluated({ instance }) {
  const { requiresScoring, classes } = instance;
  const students = React.useMemo(() => instance.students || [], [instance.students]);

  const classesSubjects = useClassesSubjects(classes);
  const subjectsCount = classesSubjects.length;

  const localizations = useEvaluatedLocalizations();

  const studentsLength = React.useMemo(() => students.length, [students]);
  const studentsWithEvaluations = React.useMemo(
    () =>
      students.filter(
        (student) =>
          student.grades?.filter((grade) => grade.type === 'main').length === subjectsCount &&
          subjectsCount > 0
      ).length,
    [students]
  );

  if (!requiresScoring) {
    return (
      <Badge closable={false} color="stroke">
        {localizations?.notEvaluable}
      </Badge>
    );
  }
  return (
    <Badge closable={false} color="stroke">
      {Math.round((studentsWithEvaluations / studentsLength) * 100)}%
    </Badge>
  );
}

export async function parseAssignationForTeacherView(instance, labels, options) {
  const commonData = await parseAssignationForCommonView(instance, labels, options);
  const role = instance?.assignable?.roleDetails;
  const dashboardURL = (role.dashboardUrl || '/private/assignables/details/:id').replace(
    ':id',
    instance.id
  );

  let rooms = [];
  forEach(instance.students, ({ chatKeys }) => {
    rooms = rooms.concat(chatKeys);
  });
  rooms = uniq(rooms);

  return {
    ...commonData,
    completion: <Completion instance={instance} />,
    dashboardURL,
    evaluated: <Evaluated instance={instance} />,
    messages: <UnreadMessages rooms={rooms} />,
  };
}

export default parseAssignationForTeacherView;
