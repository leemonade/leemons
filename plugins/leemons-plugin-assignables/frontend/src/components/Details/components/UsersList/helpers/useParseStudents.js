import { useClassesSubjects } from '@academic-portfolio/hooks';
import sendReminder from '@assignables/requests/assignableInstances/sendReminder';
import { UserDisplayItem } from '@bubbles-ui/components';
import { LocaleDate, LocaleDuration, unflatten, useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import UnreadMessages from '@comunica/components/UnreadMessages';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useQuery } from '@tanstack/react-query';
import { getUserAgentsInfoRequest } from '@users/request';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { Progress } from '@assignables/components/Ongoing/AssignmentList/hooks/useParseAssignations/parseAssignationForStudent';
import prefixPN from '../../../../../helpers/prefixPN';
import getActions from './getActions';
import getStatus from './getStatus';

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

    return students.map((student) => {
      const userAgent = userAgentsInfoMulti.data.find((d) => d.id === student.user);
      return {
        ...student,
        userInfo: userAgent?.user,
        userAgentIsDisabled: userAgent.disabled,
      };
    });
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

  const { openConfirmationModal } = useLayout();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const localizations = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return _.get(res, prefixPN('teacher_actions'));
    }

    return {};
  }, [translations]);

  async function reminder({ user }) {
    openConfirmationModal({
      title: localizations.sendReminder,
      onConfirm: async () => {
        try {
          await sendReminder({
            assignableInstanceId: instance.id,
            users: [user],
          });
          addSuccessAlert(localizations.reminderSended);
        } catch (err) {
          addErrorAlert(getErrorMessage(err));
        }
      },
    })();
  }

  return useMemo(() => {
    if (!instance?.students?.length) {
      return [];
    }

    if (!students?.length || !subjects?.length) {
      return [];
    }

    return students?.map((student) => ({
      id: student.user,
      userAgentIsDisabled: student.userAgentIsDisabled,
      student: <UserDisplayItem {...student.userInfo} />,
      unreadMessages: <UnreadMessages rooms={student.chatKeys} />,
      progress: <Progress assignation={{ ...student, instance }} />,
      avgTime:
        student?.timestamps?.start && student?.timestamps?.end ? (
          <LocaleDuration
            seconds={dayjs(student.timestamps.end).diff(student.timestamps.start, 'seconds')}
          />
        ) : (
          '-'
        ),
      actions: getActions(student, instance, localizations, subjects, {
        reminder,
        score: getStudentAverageScore(student),
      }),
      userInfo: student.userInfo,
    }));
  }, [students, subjects]);
}
