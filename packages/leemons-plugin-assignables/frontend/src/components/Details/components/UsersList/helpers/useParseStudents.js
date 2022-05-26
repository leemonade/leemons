import React, { useMemo, useState, useEffect } from 'react';
import _ from 'lodash';
import { LocaleDate, LocaleDuration, unflatten } from '@common';
import dayjs from 'dayjs';
import { getUserAgentsInfoRequest } from '@users/request';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { UserDisplayItem } from '@bubbles-ui/components';
import getStatus from './getStatus';
import getActions from './getActions';
import prefixPN from '../../../../../helpers/prefixPN';

function useStudentData(students) {
  const [studentsData, setStudentsData] = useState({});

  useEffect(() => {
    if (!students?.length) {
      return;
    }

    students.map(async (student) => {
      const userInfo = await getUserAgentsInfoRequest(student.user);

      setStudentsData((prev) => ({
        ...prev,
        [student.user]: {
          ...student,
          userInfo: userInfo.userAgents[0].user,
        },
      }));
    });
  }, [students]);

  return Object.values(studentsData);
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

  return scoresAvgObject.total / scoresAvgObject.count;
}

export default function useParseStudents(instance, statusLabels) {
  const students = useStudentData(instance?.students);
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
    return students?.map((student) => ({
      id: student.user,
      student: <UserDisplayItem {...student.userInfo} />,
      status: statusLabels[getStatus(student, instance)],
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
      actions: getActions(student, instance, localizations),
      userInfo: student.userInfo,
    }));
  }, [students]);
}
