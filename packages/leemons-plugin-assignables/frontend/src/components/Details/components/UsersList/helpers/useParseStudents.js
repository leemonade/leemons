import React, { useMemo } from 'react';
import { LocaleDate } from '@common';
import dayjs from 'dayjs';
import UserDisplay from './userDisplay';
import getStatus from './getStatus';
import getActions from './getActions';

export default function useParseStudents(instance) {
  const students = useMemo(() => {
    if (!instance?.students?.length) {
      return [];
    }

    return instance?.students?.map((student) => ({
      id: student.user,
      student: <UserDisplay id={student.user} />,
      status: getStatus(student, instance),
      completed:
        (student?.timestamps?.end && (
          <LocaleDate
            date={student?.timestamps?.end}
            options={{ dateStyle: 'short', timeStyle: 'short' }}
          />
        )) ||
        '-',
      avgTime:
        student?.timestamps?.start && student?.timestamps?.end
          ? dayjs(student.timestamps.end).diff(student.timestamps.start, 'minutes')
          : '-',
      score: 'TBD',
      actions: getActions(student, instance),
    }));
  }, [instance?.students]);

  return students;
}
