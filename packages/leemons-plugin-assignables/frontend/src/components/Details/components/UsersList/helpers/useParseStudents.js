import React, { useMemo, useState, useEffect } from 'react';
import { LocaleDate, LocaleDuration } from '@common';
import dayjs from 'dayjs';
import { getUserAgentsInfoRequest } from '@users/request';
import UserDisplay from './userDisplay';
import getStatus from './getStatus';
import getActions from './getActions';

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

export default function useParseStudents(instance) {
  const students = useStudentData(instance?.students);

  return useMemo(() => {
    if (!instance?.students?.length) {
      return [];
    }
    return students?.map((student) => ({
      id: student.user,
      student: <UserDisplay {...student.userInfo} />,
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
        student?.timestamps?.start && student?.timestamps?.end ? (
          <LocaleDuration
            seconds={dayjs(student.timestamps.end).diff(student.timestamps.start, 'seconds')}
          />
        ) : (
          '-'
        ),
      score: 'TBD',
      actions: getActions(student, instance),
      userInfo: student.userInfo,
    }));
  }, [students]);
  // return students;
}
