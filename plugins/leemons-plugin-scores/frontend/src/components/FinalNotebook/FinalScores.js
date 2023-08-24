import React from 'react';
import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';
import { unflatten, useCache, useLocale } from '@common';
import _ from 'lodash';
import { useUserAgentsInfo } from '@users/hooks';
import { useScores } from '@scores/requests/hooks/queries';
import { ScoresReviewerTable } from '@bubbles-ui/leemons';
import { Box, Loader } from '@bubbles-ui/components';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import { useScoresMutation } from '@scores/requests/hooks/mutations';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { useProgramDetail } from '@academic-portfolio/hooks';
import { useAcademicCalendarPeriods } from '../ScoresPage/useAcademicCalendarPeriods';
import { filterStudentsByLocalFilters } from '../Notebook/components/ActivitiesTab/useParsedActivities';
import { onDataChange } from './onDataChange';
import { useLocalFilters } from './useLocalFilters';
import { useParsedData } from './useParsedData';
import { EmptyState } from '../Notebook/components/ActivitiesTab/EmptyState';
import { useClassesManagers } from './useClassesManagers';
import useExcelDownloadHandler from './useExcelDownloadHandler';

export function useMatchingClasses({ filters }) {
  const cache = useCache();

  let { data: programClasses, isLoading } = useProgramClasses(filters?.program, {
    enabled: !!filters?.program,
  });

  programClasses = React.useMemo(() => cache('programClasses', programClasses), [programClasses]);

  const courseClasses = React.useMemo(
    () =>
      cache(
        'courseClasses',
        programClasses?.filter((klass) => klass.courses.id === filters.course)
      ),
    [programClasses, filters?.course]
  );

  const groupClasses = React.useMemo(() => {
    if (!filters?.group) {
      return courseClasses;
    }

    return courseClasses?.filter((klass) => klass.groups?.id === filters?.group);
  }, [courseClasses, filters?.group]);

  const classesManagers = useClassesManagers({ filters, classes: groupClasses });

  const managers = React.useMemo(
    () => classesManagers.reduce((obj, klass) => ({ ...obj, [klass.id]: klass.managers }), {}),
    [classesManagers]
  );

  const classesWithManagers = React.useMemo(() => {
    if (!classesManagers?.length) {
      return groupClasses;
    }

    return groupClasses.map((klass) => ({ ...klass, managers: managers[klass.id] }));
  }, [groupClasses, managers]);

  return { classes: classesWithManagers, isLoading };
}

function useStudents({ classes, filters }) {
  const cache = useCache();

  const students = React.useMemo(
    () => cache('students', _.uniq(_.flatMap(classes, 'students'))),
    [classes]
  );

  const { data, isLoading } = useUserAgentsInfo(students);

  const studentsData = React.useMemo(
    () =>
      cache(
        'studentsData',
        data?.map((student) => ({
          id: student.id,
          name: student.user.name,
          surname: student.user.surnames,
          image: student.user.avatar,
        })) || []
      ),
    [data]
  );

  const filteredStudents = React.useMemo(() => {
    if (filters?.filterBy !== 'student' || !filters?.search?.length) {
      return studentsData;
    }

    return cache(
      'filteredStudents',
      filterStudentsByLocalFilters({ filters, values: studentsData })
    );
  }, [filters?.filterBy, filters?.search, data]);

  return { isLoading, students: filteredStudents };
}

export function useMatchingAcademicCalendarPeriods({ classes, filters }) {
  const cache = useCache();
  const periods = useAcademicCalendarPeriods({ classes });

  const parsedPeriods = React.useMemo(() => {
    if (!(filters?.program && filters?.course && periods?.length)) {
      return cache('periods', []);
    }

    return cache(
      'periods',
      periods
        .map((period) => ({
          ..._.pick(period, ['startDate', 'endDate', 'name']),
          id: period.periods[filters?.program][filters?.course],
        }))
        .filter((period) => period.id)
    );
  }, [periods, filters?.program, filters?.course]);

  return {
    isLoading: !periods,
    periods: parsedPeriods,
  };
}

function useGrades({ filters }) {
  const cache = useCache();

  const evaluationSystem = useProgramEvaluationSystem(filters?.program);
  const scales = evaluationSystem?.scales;

  const grades = cache(
    'grades',
    React.useMemo(() => scales?.sort((a, b) => a.number - b.number), [scales])
  );

  return { isLoading: !evaluationSystem, grades };
}

function useFinalScoresLocalization() {
  const [, translations] = useTranslateLoader([
    prefixPN('finalNotebook.reviewerTable'),
    prefixPN('scoresPage.filters.period.final'),
    prefixPN('finalNotebook.update'),
  ]);

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return {
        ..._.get(res, prefixPN('finalNotebook.reviewerTable')),
        final: _.get(res, prefixPN('scoresPage.filters.period.final')),
        update: _.get(res, prefixPN('finalNotebook.update')),
      };
    }

    return {};
  }, [translations]);
}

export function FinalScores({ filters, localFilters }) {
  let { classes, isLoading: classesAreLoading } = useMatchingClasses({ filters });
  let { students, isLoading: studentsAreLoading } = useStudents({ classes, filters: localFilters });
  let { periods, isLoading: periodsAreLoading } = useMatchingAcademicCalendarPeriods({
    classes,
    filters,
  });

  const { grades, isLoading: gradesAreLoading } = useGrades({ filters });
  const locale = useLocale();
  const localizations = useFinalScoresLocalization();
  const { mutateAsync: mutateScore } = useScoresMutation();

  const { data: programData } = useProgramDetail(filters.program, { enabled: !!filters.program });

  const { data: scores, isLoading: scoresAreLoading } = useScores({
    students: _.map(students, 'id'),
    classes: _.map(classes, 'id'),
    periods: [..._.map(periods, 'id'), 'final'],
    published: true,
  });

  const { data: courseScores, isLoading: courseScoresAreLoading } = useScores({
    students: _.map(students, 'id'),
    classes: [`${filters.program}.${filters.course}`],
    periods: ['course'],
  });

  const periodsWithFinal = React.useMemo(() => {
    if (!periods?.length) {
      return [];
    }

    const greatestDate = periods?.reduce((dates, period) =>
      period.endDate > dates.endDate ? period : dates
    )?.startDate;

    return [
      ..._.map(periods),
      {
        id: 'final',
        name: localizations?.final,
        startDate: greatestDate,
        endDate: greatestDate,
      },
    ];
  }, [periods, localizations?.final]);

  ({ students, classes, periods } = useLocalFilters({
    students,
    classes,
    periods: periodsWithFinal,
    filters: { ...localFilters, period: filters?.period },
  }));

  const isLoading =
    classesAreLoading ||
    studentsAreLoading ||
    periodsAreLoading ||
    gradesAreLoading ||
    scoresAreLoading ||
    courseScoresAreLoading;

  const {
    classes: classesForTable,
    students: studentsForTable,
    startDate,
    endDate,
  } = useParsedData({
    classes,
    periods,
    students,
    scores,
    courseScores,
  });

  useExcelDownloadHandler({
    classes: classesForTable,
    students: studentsForTable,
    filters: {
      startDate,
      endDate,
      program: programData,
      course: filters.course,
      group: filters.group,
      period: filters.period,
      periods,
    },
    grades,
  });

  if (isLoading) {
    return (
      <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
        <Loader />
      </Box>
    );
  }

  if (
    !Array.isArray(grades) ||
    !classesForTable?.length ||
    !studentsForTable?.length ||
    !periodsWithFinal?.length
  ) {
    return <EmptyState />;
  }

  return (
    <ScoresReviewerTable
      key={`${_.map(classesForTable, 'id')?.join('.')}-${_.map(periods, 'id')?.join('.')}`}
      grades={grades}
      locale={locale}
      subjects={classesForTable}
      value={studentsForTable}
      labels={localizations}
      from={startDate}
      to={endDate}
      onDataChange={onDataChange({
        mutateScore,
        periods: periodsWithFinal,
        classes,
        students,
        filters,
        localizations: localizations?.update,
      })}
    />
  );
}

export default FinalScores;
