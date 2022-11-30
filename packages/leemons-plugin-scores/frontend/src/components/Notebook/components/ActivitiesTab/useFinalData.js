import { useScores } from '@scores/requests/hooks/queries';
import { useUserAgentsInfo } from '@users/hooks';
import React from 'react';
import _ from 'lodash';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import { useCache } from '@common';
import { filterStudentsByLocalFilters, sortByStudentName } from './useParsedActivities';

function useStudents(students) {
  const { data, isLoading } = useUserAgentsInfo(students, {
    enabled: !!students.length,
  });

  return React.useMemo(
    () => ({
      students: data?.map((student) => ({
        id: student.id,
        name: student.user.name,
        surname: student.user.surnames,
        image: student.user.avatar,
      })),
      isLoading,
    }),
    [data, isLoading]
  );
}

function usePeriods({ class: klass, period }) {
  const { program } = klass;
  const course = klass.courses.id;

  return period.periods.map((p) => ({
    ..._.pick(p, ['startDate', 'endDate', 'name']),
    id: p.periods[program][course],
  }));
}

function getActivitiesFromPeriods({ periods }) {
  return periods.map((period) => ({
    id: period.id,
    name: period.name,
    deadline: period.endDate,
    weight: 1 / periods.length,
    allowChange: false,
    type: 'calificable',
  }));
}

function getValues({
  students: _students,
  scores,
  finalScores,
  periods,
  periodIsSubmitted,
  filters,
}) {
  let students = sortByStudentName(_students);
  students = filterStudentsByLocalFilters({ filters, values: students });

  if (!students?.length) {
    return [];
  }

  return students.map((student) => ({
    ...student,
    activities: periods.map((period) => ({
      id: period.id,
      score: scores?.find((score) => score.student === student.id && score.period === period.id)
        ?.grade,
      isSubmitted: true,
    })),
    allowCustomChange: !periodIsSubmitted,
    customScore: finalScores?.find((score) => score.student === student.id)?.grade || null,
  }));
}

function useGrades(klass) {
  const evaluationSystem = useProgramEvaluationSystem(klass.program);

  const cache = useCache();
  return cache(
    'grades',
    React.useMemo(
      () => evaluationSystem?.scales?.sort((a, b) => a.number - b.number),
      [evaluationSystem?.scales]
    )
  );
}

export default function useFinalData({ filters, localFilters }) {
  const cache = useCache();
  const klass = filters.class;
  const { period } = filters.period;

  const { students } = klass;

  const { students: studentsData, isLoading: studentsAreLoading } = useStudents(students);
  const periods = usePeriods({ class: klass, period });
  const { data: periodsScores, isLoading: periodsScoresAreLoading } = useScores({
    class: [klass.id],
    periods: _.map(periods, 'id'),
    published: true,
  });

  const { data: finalScores, isLoading: finalScoresAreLoading } = useScores({
    class: [klass.id],
    periods: ['final'],
  });

  const isPeriodSubmitted = React.useMemo(
    () => finalScores?.length && !finalScores.some((s) => !s.published),
    [finalScores]
  );

  const activities = getActivitiesFromPeriods({
    periods,
  });
  const values = getValues({
    students: studentsData,
    scores: periodsScores,
    finalScores,
    periods,
    periodIsSubmitted: isPeriodSubmitted,
    filters: localFilters,
  });

  const grades = useGrades(klass);

  return {
    isLoading:
      studentsAreLoading || periodsScoresAreLoading || finalScoresAreLoading || !grades?.length,
    activitiesData: cache('activitiesData', {
      activities,
      value: values,
      isPeriodSubmitted,
      isFinalEvaluation: true,
    }),
    grades,
  };
}
