import React from 'react';
import _ from 'lodash';
import { useCache } from '@common';
import { useAcademicCalendarConfig } from '@academic-calendar/hooks';
import { useProgramDetail } from '@academic-portfolio/hooks';

export function useAcademicCalendarPeriods({ classes }) {
  const cache = useCache();
  const programsIds = React.useMemo(() => _.uniq(_.map(classes, 'program')), [classes]);

  const programsQueries = useProgramDetail(programsIds);
  const configQueries = useAcademicCalendarConfig(programsIds);

  const programs = React.useMemo(
    () => cache('programs', _.map(programsQueries, 'data').filter(Boolean)),
    [programsQueries]
  );

  const courses = React.useMemo(
    () =>
      programs
        .map((p) =>
          p.courses.map((c) => ({
            id: c.id,
            program: p.id,
          }))
        )
        .flat()
        .reduce((acc, course) => ({ ...acc, [course.id]: course }), {}),
    [programs]
  );

  const substages = React.useMemo(
    () =>
      programs
        .map((p) =>
          p.substages.map((substage) => ({
            id: substage.id,
            name: substage.name,
            abbreviation: substage.abbreviation,
            program: p.id,
          }))
        )
        .flat()
        .reduce((acc, substage) => ({ ...acc, [substage.id]: substage }), {}),
    [programs]
  );

  const configs = React.useMemo(
    () => cache('config', _.map(configQueries, 'data.substagesDates').filter(Boolean)),
    [configQueries]
  );

  const periods = React.useMemo(
    () =>
      configs.flatMap((config) =>
        Object.entries(config).flatMap(([course, courseData]) =>
          Object.entries(courseData).map(([substage, substageData]) => ({
            course: courses[course],
            substage: substages[substage],
            ...substageData,
          }))
        )
      ),
    [configs, courses, substages]
  );

  const formattedPeriods = React.useMemo(
    () =>
      periods.map((period) => ({
        id: `${period?.startDate}.${period?.endDate}.${period?.substage?.name}`,
        periodId: period?.substage?.id,
        name: period?.substage?.name,
        program: period?.course?.program,
        course: period?.course?.id,
        startDate: period?.startDate,
        endDate: period?.endDate,
      })),
    [periods]
  );

  return React.useMemo(() => {
    const ids = _.map(formattedPeriods, 'id');

    return _.uniq(ids).map((id) => {
      const equalPeriods = formattedPeriods.filter((p) => p.id === id);
      const firstEqualPeriod = equalPeriods[0];

      return {
        ..._.omit(firstEqualPeriod, ['program', 'course', 'periodId']),
        programs: _.uniq(_.map(equalPeriods, 'program')),
        courses: _.uniq(_.map(equalPeriods, 'course')),
        periods: equalPeriods.reduce(
          (result, period) => ({
            ...result,
            [period.program]: {
              ...result[period.program],
              [period.course]: period.periodId,
            },
          }),
          {}
        ),
      };
    });
  }, [formattedPeriods]);
}

export default useAcademicCalendarPeriods;
