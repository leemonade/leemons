import React, { useMemo } from 'react';
import _ from 'lodash';
import { LocaleDate, LocaleDuration, unflatten } from '@common';
import dayjs from 'dayjs';
import { getUserAgentsInfoRequest } from '@users/request';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { UserDisplayItem } from '@bubbles-ui/components';
import { useClassesSubjects } from '@academic-portfolio/hooks';
import { useQuery } from 'react-query';
import UnreadMessages from '@comunica/UnreadMessages';
import getStatus from './getStatus';
import getActions from './getActions';
import prefixPN from '../../../../../helpers/prefixPN';

function useUserAgentsInfo(students) {
  const users = students.map((student) => student.user);
  return useQuery(
    ['userAgentsInfoMulti', { ids: users }],
    () => getUserAgentsInfoRequest(users).then((res) => res.userAgents),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );
}

function useStudentData(students) {
  const userAgentsInfoMulti = useUserAgentsInfo(students);

  return useMemo(() => {
    // TODO: Handle user fetching errors
    if (!userAgentsInfoMulti.isSuccess || !userAgentsInfoMulti.data) {
      return [];
    }

    const data = students.map((student) => {
      const userAgent = userAgentsInfoMulti.data.find((d) => d.id === student.user);
      return {
        ...student,
        userInfo: userAgent?.user,
      };
    });

    return data;
  }, [students, userAgentsInfoMulti.data]);
}

function getStudentAverageScore(studentData) {
  const scores = studentData.grades;
  const mainScores = scores.filter((grade) => grade.type === 'main');
  const scoresAvgObject = mainScores.reduce(
    (acc, grade) => ({
      total: acc.total + grade.grade,
      count: acc.count + 1,
    }),
    { total: 0, count: 0 }
  );
  if (scoresAvgObject.count === 0) {
    return '-';
  }

  return (scoresAvgObject.total / scoresAvgObject.count).toFixed(2);
}

export default function useParseStudents(instance, statusLabels) {
  const students = useStudentData(instance?.students);
  const subjects = useClassesSubjects(instance?.classes);
  const [, translations] = useTranslateLoader(prefixPN('teacher_actions'));

  const localizations = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('teacher_actions'));
      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  return useMemo(() => {
    if (!instance?.students?.length) {
      return [];
    }

    if (!students?.length || !subjects?.length) {
      return [];
    }

    return students?.map((student) => ({
      id: student.user,
      student: <UserDisplayItem {...student.userInfo} />,
      status: statusLabels[getStatus(student, instance)],
      unreadMessages: <UnreadMessages rooms={student.chatKeys} />,
      completed:
        (student?.timestamps?.end && (
          <LocaleDate
            date={student?.timestamps?.end}
            options={{ dateStyle: 'short', timeStyle: 'short' }}
          />
        )) ||
        '-',
      avgTime:
        student?.timestamps?.start && student?.timestamps?.end ? (
          <LocaleDuration
            seconds={dayjs(student.timestamps.end).diff(student.timestamps.start, 'seconds')}
          />
        ) : (
          '-'
        ),
      score: getStudentAverageScore(student),
      actions: getActions(student, instance, localizations, subjects),
      userInfo: student.userInfo,
    }));
  }, [students, subjects]);
}
