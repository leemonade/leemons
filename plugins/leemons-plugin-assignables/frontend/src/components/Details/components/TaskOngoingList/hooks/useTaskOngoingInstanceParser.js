import { useMemo } from 'react';
import _ from 'lodash';
import dayjs from 'dayjs';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { useLocale, unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useProgramEvaluationSystem from '../../../../../hooks/useProgramEvaluationSystem';
import useClassData from '../../../../../hooks/useClassData';
import prefixPN from '../../../../../helpers/prefixPN';
import getStatusAsNumber from '../../UsersList/helpers/getStatusAsNumber';

function getGradesGraphData(evaluationSystem, students) {
  if (!students || !evaluationSystem) {
    return null;
  }

  const studentsWithGrades = students
    .filter((student) => student.finished)
    .map((student) => {
      const mainGrades = student.grades.filter((grade) => grade.type === 'main');
      const averageObj = mainGrades.reduce(
        (acc, grade) => {
          acc.total += grade.grade;
          acc.count += 1;
          return acc;
        },
        { total: 0, count: 0 }
      );

      return {
        student: student.id,
        score: averageObj.total / averageObj.count,
      };
    })
    .filter((student) => !Number.isNaN(student.score));

  return {
    scores: studentsWithGrades,
    grades: evaluationSystem?.scales
      ?.map((scale) => ({
        number: scale.number,
        letter: scale.letter,
      }))
      .sort((a, b) => a.number - b.number),
    minimumGrade: evaluationSystem?.minScaleToPromote?.number,
    withMarker: true,
  };
}

function getStatusGraphData(students) {
  if (!students) {
    return null;
  }

  return {
    scores: students.map((student) => ({ student: student.id, score: student.status })),
    grades: [{ number: 0 }, { number: 1 }, { number: 2 }],
    showBarPercentage: true,
    showLeftLegend: false,
    variant: 'onecolor',
    styles: {
      width: 'calc(100% - 95px)',
    },
  };
}

export default function useTaskOngoingInstanceParser(instance) {
  const students = instance.students.map((student) => ({
    finished: student.finished,
    grades: student.grades,
    id: student.user,
    status: getStatusAsNumber(student, instance),
  }));

  const locale = useLocale();

  const [, translations] = useTranslateLoader([
    prefixPN('activity_deadline_header'),
    prefixPN('multiSubject'),
    prefixPN('dates'),
  ]);

  const { multiSubjectLabel, deadlineHeaderLabels, datesLabels } = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return {
        deadlineHeaderLabels: _.get(res, prefixPN('activity_deadline_header')),
        multiSubjectLabel: _.get(res, prefixPN('multiSubject')),
        datesLabels: _.get(res, prefixPN('dates')),
      };
    }

    return {};
  }, [translations]);

  const classData = useClassData(instance.classes, {
    multiSubject: multiSubjectLabel,
    groupName: instance?.metadata?.groupName,
  });
  const evaluationSystem = useProgramEvaluationSystem(instance);

  const data = {
    // TODO: Update
    headerBackground: {
      withGradient: true,
      withBlur: true,
      image: getFileUrl(instance.assignable.asset.cover),
    },
    taskDeadlineHeader: {
      title: instance?.assignable?.asset?.name,
      subtitle: classData.customGroup
        ? `${classData.subjectName} - ${classData.subjectCompiledInternalId} - ${classData.name}`
        : classData.name,
      icon: classData.icon,
      color: classData.color,
      startDate: instance?.dates?.start ? new Date(instance?.dates?.start) : null,
      deadline: instance?.dates?.deadline ? new Date(instance?.dates?.deadline) : null,
      // TODO: UPDATE
      locale,
      // TODO: UPDATE
      labels: deadlineHeaderLabels,
    },

    leftScoresBar: getStatusGraphData(students),
    // TODO: UPDATE
    rightScoresBar: getGradesGraphData(evaluationSystem, students),
  };

  if (!instance.alwaysAvailable) {
    const start = dayjs(instance?.dates?.start);
    const visualization = dayjs(instance?.dates?.visualization);

    if (start.isBefore(visualization)) {
      delete instance.dates.visualization;
    }
    data.horizontalTimeline = {
      data: Object.entries(instance?.dates).map(([name, date]) => ({
        label: datesLabels?.[name] || name,
        date: new Date(date),
      })),
    };
  }

  return data;
}
