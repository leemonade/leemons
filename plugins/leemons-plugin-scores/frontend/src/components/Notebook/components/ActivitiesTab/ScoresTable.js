import React from 'react';
import { Box } from '@bubbles-ui/components';
import { ScoresBasicTable } from '@bubbles-ui/leemons';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useScoresMutation } from '@scores/requests/hooks/mutations';

function printSuccessMessage({ labels, student, activity, score }) {
  addSuccessAlert(
    labels?.updatedSuccess
      ?.replace('{{student}}', `${student.name} ${student.surname}`)
      ?.replace('{{activity}}', activity)
      ?.replace('{{score}}', score.letter || score.number)
  );
}

function printErrorMessage({ labels, student, activity, score, error }) {
  addErrorAlert(
    labels?.updatedError
      ?.replace('{{student}}', `${student.name} ${student.surname}`)
      ?.replace('{{activity}}', activity)
      ?.replace('{{score}}', score.letter || score.number)
      ?.replace('{{error}}', error.message || error.error)
  );
}

function onDataChange(
  v,
  { data, assignationScoreMutateAsync, customScoreMutateAsync, filters, labels }
) {
  const grade = data.grades.find((g) => g.number === parseInt(v.value, 10) || g.letter === v.value);
  const student = data.value.find((s) => s.id === v.rowId);
  const activity = data.activities.find((a) => a.id === v.columnId);

  if (v.columnId === 'customScore') {
    const studentId = v.rowId;
    const klass = filters.class.id;
    const period = filters.period?.period?.id;

    customScoreMutateAsync({
      scores: [
        {
          student: studentId,
          class: klass,
          period,
          published: false,
          grade: parseInt(v.value, 10),
        },
      ],
    })
      .then(() =>
        printSuccessMessage({
          labels,
          student,
          activity: filters.period?.period?.name,
          score: grade,
        })
      )
      .catch((e) =>
        printErrorMessage({
          labels,
          student,
          activity: filters.period?.period?.name,
          score: grade,
          error: e,
        })
      );

    return;
  }
  if (data.isFinalEvaluation) {
    const studentId = v.rowId;
    const klass = filters.class.id;
    const finalPeriod = filters?.period?.period;

    const period = Object.values(finalPeriod?.periods).find(
      (p) => p.periods[finalPeriod?.program][finalPeriod?.course] === v.columnId
    );

    customScoreMutateAsync({
      scores: [
        {
          student: studentId,
          class: klass,
          period: v.columnId,
          published: false,
          grade: parseInt(v.value, 10),
        },
      ],
    })
      .then(() => printSuccessMessage({ labels, student, score: grade, activity: period?.name }))
      .catch((e) =>
        printErrorMessage({ labels, student, score: grade, activity: period?.name, error: e })
      );

    return;
  }

  assignationScoreMutateAsync({
    instance: v.columnId,
    student: v.rowId,
    grades: [
      {
        type: 'main',
        grade: grade.number,
        subject: filters.subject,
      },
    ],
  })
    .then(() => printSuccessMessage({ labels, student, activity: activity.name, score: grade }))
    .catch((e) =>
      printErrorMessage({ labels, student, activity: activity.name, score: grade, error: e })
    );
}

export function ScoresTable({ activitiesData, grades, filters, onOpen, labels }) {
  const { mutateAsync: assignationScoreMutateAsync } = useStudentAssignationMutation();
  const { mutateAsync: customScoreMutateAsync } = useScoresMutation();
  const data = React.useMemo(
    () => ({
      labels: {
        students: labels?.table?.students,
        noActivity: labels?.table?.noActivity,
        avgScore: labels?.table?.avgScore,
        gradingTasks: labels?.table?.calculated,
        customScore: labels?.table?.custom,
        attendance: labels?.table?.attendance,
      },
      grades,
      ...activitiesData,
    }),
    [grades, activitiesData]
  );

  return (
    <Box>
      <ScoresBasicTable
        {...data}
        onDataChange={(v) =>
          onDataChange(v, {
            data,
            assignationScoreMutateAsync,
            customScoreMutateAsync,
            filters,
            labels,
          })
        }
        onOpen={onOpen}
        from={filters?.startDate}
        to={filters?.endDate}
      />
    </Box>
  );
}

export default ScoresTable;
