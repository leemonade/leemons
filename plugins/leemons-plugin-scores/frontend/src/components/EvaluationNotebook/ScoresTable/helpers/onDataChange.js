import _ from 'lodash';

import { printErrorMessage, printSuccessMessage } from './printMessages';

export default function onDataChange({
  assignationScoreMutate,
  customScoreMutate,
  manualActivityScoreMutate,
  retakeScoreMutate,
  scales,
  students,
  activities,
  class: klass,
  period,
  labels,
  retakes,
}) {
  return (value) => {
    const score = parseFloat(value.value);
    const isLetter = _.isNaN(score);

    const grade = {
      ...(scales.find((g) => g.number === parseInt(value.value, 10) || g.letter === value.value) ??
        {}),
    };

    if (!grade?.number) {
      throw new Error('Invalid grade');
    }

    if (!isLetter) {
      const maxScore = scales.reduce((max, current) => Math.max(max, current.number), 0);
      const minScore = scales.reduce((min, current) => Math.min(min, current.number), maxScore);
      grade.number = Math.min(Math.max(score, minScore), maxScore);
    }

    const student = students.find((s) => s.id === value.rowId);
    const activity = activities.find((a) => a.id === value.columnId);

    if (value.columnId === 'customScore') {
      const studentId = value.rowId;
      const periodId = period?.period?.id;

      if (!periodId) {
        return printErrorMessage({
          labels,
          student,
          activity: period?.period?.name,
          score: grade,
          error: new Error('No period'),
        });
      }

      return customScoreMutate({
        scores: [
          {
            student: studentId,
            class: klass.id,
            period: periodId,
            published: false,
            grade: parseInt(value.value, 10),
          },
        ],
      })
        .then(() =>
          printSuccessMessage({
            labels,
            student,
            activity: period?.period?.name,
            score: grade,
          })
        )
        .catch((e) =>
          printErrorMessage({
            labels,
            student,
            activity: period?.period?.name,
            score: grade,
            error: e,
          })
        );
    }

    if (value.columnId.startsWith('retake-')) {
      const [, retakeId] = value.columnId.split('-');
      const retake = retakeId === 'null' ? retakes[0] : retakes.find((r) => r.id === retakeId);

      return retakeScoreMutate({
        classId: klass.id,
        period: period?.period?.id,
        user: student.id,
        grade: grade.number,
        retakeId: retakeId === 'null' ? null : retakeId,
        retakeIndex: retake.index,
      })
        .then(() =>
          printSuccessMessage({
            labels,
            student,
            activity: `${labels.retakeName} ${retake.index + 1}`,
            score: grade,
          })
        )
        .catch((e) =>
          printErrorMessage({
            labels,
            student,
            activity: `${labels.retakeName} ${retake.index + 1}`,
            score: grade,
            error: e,
          })
        );
    }

    if (activity.source === 'manualActivities') {
      return manualActivityScoreMutate({
        scores: [
          {
            user: student.id,
            activity: activity.id,
            grade: grade.number,
            class: klass.id,
          },
        ],
      })
        .then(() => printSuccessMessage({ labels, student, activity: activity.name, score: grade }))
        .catch((e) =>
          printErrorMessage({ labels, student, activity: activity.name, score: grade, error: e })
        );
    }

    if (activity.source === 'assignables') {
      return assignationScoreMutate({
        instance: value.columnId,
        student: value.rowId,
        grades: [
          {
            type: 'main',
            grade: grade.number,
            subject: klass.subject.id,
          },
        ],
      })
        .then(() => printSuccessMessage({ labels, student, activity: activity.name, score: grade }))
        .catch((e) =>
          printErrorMessage({ labels, student, activity: activity.name, score: grade, error: e })
        );
    }

    throw new Error('Invalid activity source');
  };
}
