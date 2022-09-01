import React from 'react';
import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';
import { unflatten, useCache, useLocale } from '@common';
import _ from 'lodash';
import { useUserAgentsInfo } from '@users/hooks';
import useScores from '@scores/hooks/scores/useScores';
import { ScoresReviewerTable } from '@bubbles-ui/leemons';
import { Loader } from '@bubbles-ui/components';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import useScoresUpdateMutation from '@scores/hooks/scores/useScoresUpdateMutation';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { useAcademicCalendarPeriods } from '../ScoresPage/useAcademicCalendarPeriods';
import { filterStudentsByLocalFilters } from '../Notebook/components/ActivitiesTab/useParsedActivities';
import { onDataChange } from './onDataChange';
import { useLocalFilters } from './useLocalFilters';
import { useParsedData } from './useParsedData';

function useMatchingClasses({ filters }) {
  const cache = useCache();

  let { data: programClasses } = useProgramClasses(filters?.program, {
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
    if (!filters?.group || filters?.group === 'all') {
      return courseClasses;
    }

    return courseClasses?.filter((klass) => klass.groups.id === filters?.group);
  }, [courseClasses, filters?.group]);

  return groupClasses;
}

function useStudents({ classes, filters }) {
  const cache = useCache();

  const students = React.useMemo(
    () => cache('students', _.uniq(_.flatMap(classes, 'students'))),
    [classes]
  );

  const { data } = useUserAgentsInfo(students);

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

  return filteredStudents;
}

function useMatchingAcademicCalendarPeriods({ classes, filters }) {
  const cache = useCache();
  const periods = useAcademicCalendarPeriods({ classes });

  return React.useMemo(() => {
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
}

function useGrades({ filters }) {
  const cache = useCache();

  const evaluationSystem = useProgramEvaluationSystem(filters?.program);
  const scales = evaluationSystem?.scales;

  const grades = cache(
    'grades',
    React.useMemo(() => scales?.sort((a, b) => a.number - b.number), [scales])
  );

  return grades;
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
  let classes = useMatchingClasses({ filters });
  let students = useStudents({ classes, filters: localFilters });
  let periods = useMatchingAcademicCalendarPeriods({ classes, filters });
  const grades = useGrades({ filters });
  const locale = useLocale();
  const localizations = useFinalScoresLocalization();
  const { mutateAsync: mutateScore } = useScoresUpdateMutation();

  const { data: scores } = useScores({
    students: _.map(students, 'id'),
    classes: _.map(classes, 'id'),
    periods: [..._.map(periods, 'id'), 'final'],
    published: true,
  });

  const { data: courseScores } = useScores({
    students: _.map(students, 'id'),
    classes: [`${filters.program}.${filters.course}`],
    periods: ['course'],
  });

  ({ students, classes, periods } = useLocalFilters({
    students,
    classes,
    periods,
    filters: localFilters,
  }));

  const periodsWithFinal = [..._.map(periods), { id: 'final', name: localizations?.final }];

  const {
    classes: classesForTable,
    students: studentsForTable,
    startDate,
    endDate,
  } = useParsedData({
    classes,
    periods: periodsWithFinal,
    students,
    scores,
    courseScores,
  });

  if (!Array.isArray(grades) || !classesForTable?.length || !studentsForTable?.length) {
    return <Loader />;
  }

  return (
    <ScoresReviewerTable
      key={`${classesForTable?.length}-${periodsWithFinal?.length}`}
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
