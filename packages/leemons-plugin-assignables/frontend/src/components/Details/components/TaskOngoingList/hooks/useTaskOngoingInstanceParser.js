import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import useProgramEvaluationSystem from '../../../../../hooks/useProgramEvaluationSystem';
import getStatus from '../../UsersList/helpers/getStatus';
import useClassData from '../../../../../hooks/useClassData';

function getGradesGraphData(evaluationSystem, students) {
  if (!students || !evaluationSystem) {
    return null;
  }

  return {
    scores: [
      { student: 'Albert', score: 10 },
      { student: 'Bert', score: 9 },
      { student: 'Manolo', score: 9 },
      { student: 'Bertrand', score: 8 },
      { student: 'Bertrand 2', score: 8 },
      { student: 'Bertrand 3', score: 8 },
      { student: 'Bertrand 4', score: 8 },
      { student: 'Bertrand 5', score: 8 },
      { student: 'Céline', score: 7 },
      { student: 'Céline 2', score: 7 },
      { student: 'Dora', score: 6 },
      { student: 'Dora 2', score: 6 },
      { student: 'Edouard', score: 5 },
      { student: 'Edouard 2', score: 5 },
      { student: 'Edouard 3', score: 5 },
      { student: 'Céline 3', score: 7 },
      { student: 'Céline 4', score: 7 },
      { student: 'Dora 3', score: 6 },
      { student: 'Dora 4', score: 6 },
      { student: 'Céline 5', score: 7 },
      { student: 'Céline 6', score: 7 },
      { student: 'Dora 5', score: 6 },
      { student: 'Dora 6', score: 6 },
      { student: 'Edouard 4', score: 5 },
      { student: 'Edouard 5', score: 5 },
      { student: 'Edouard 6', score: 5 },
      { student: 'Félix', score: 4 },
      { student: 'Henri', score: 2 },
      { student: 'Ida', score: 1 },
      { student: 'Henri', score: 2 },
      { student: 'Ida', score: 1 },
      { student: 'Henri', score: 2 },
      { student: 'Ida', score: 1 },
      { student: 'Henri', score: 2 },
      { student: 'Ida', score: 1 },
      { student: 'Henri', score: 2 },
      { student: 'Olivia', score: 3 },
      { student: 'Olivia', score: 3 },
      { student: 'Olivia', score: 3 },
      { student: 'Olivia', score: 3 },
      { student: 'Jean-Claude', score: 0 },
      { student: 'Kévin', score: 7 },
      { student: 'Léa', score: 6 },
      { student: 'Olivia', score: 3 },
      { student: 'Philippe', score: 6 },
      { student: 'Quentin', score: 5 },
      { student: 'Rémi', score: 4 },
      { student: 'Sylvie', score: 5 },
      { student: 'Théo', score: 4 },
      { student: 'Théo', score: 4 },
      { student: 'Théo', score: 4 },
      { student: 'Théo', score: 4 },
      { student: 'Ursule', score: 3 },
      { student: 'Vincent', score: 5 },
    ],
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

function getStatusAsNumber(student, instance) {
  const status = getStatus(student, instance);

  if (status === 'COMPLETED' || status === 'LATE') {
    return 0;
  }

  if (status === 'ONGOING') {
    return 1;
  }

  if (status === 'OPENED') {
    return 2;
  }

  return -1;
}

export default function useTaskOngoingInstanceParser(instance) {
  const students = instance.students.map((student) => ({
    id: student.user,
    status: getStatusAsNumber(student, instance),
  }));

  const classData = useClassData(instance.classes);
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
      subtitle: classData.name,
      icon: classData.icon,
      color: classData.color,
      deadline: new Date(instance?.dates?.deadline),
      // TODO: UPDATE
      locale: 'es-ES',
      // TODO: UPDATE
      labels: {
        deadline: 'Deadline',
        deadlineExtraTime: 'Add extra time',
        closeTask: 'Close task',
        save: 'Save',
        cancel: 'Cancel',
      },
    },

    leftScoresBar: getStatusGraphData(students),
    // TODO: UPDATE
    rightScoresBar: getGradesGraphData(evaluationSystem, students),
  };

  if (!instance.alwaysAvailable) {
    data.horizontalTimeline = {
      data: Object.entries(instance?.dates).map(([name, date]) => ({
        label: name,
        date: new Date(date),
      })),
    };
  }

  return data;
}
