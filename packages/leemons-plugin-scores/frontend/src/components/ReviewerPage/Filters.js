import React from 'react';
import { Box, createStyles, Select, Title } from '@bubbles-ui/components';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useCenterPrograms, useProgramDetail } from '@academic-portfolio/hooks';
import _ from 'lodash';
import { unflatten, useCache } from '@common';
import { getCentersWithToken } from '@users/session';
import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';
import { prefixPN } from '@scores/helpers';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useMatchingAcademicCalendarPeriods } from '../FinalNotebook/FinalScores';

const useFiltersStyles = createStyles((theme) => ({
  root: {
    marginLeft: theme.spacing[5],
  },
  title: {
    fontSize: theme.fontSizes[2],
    fontWeight: 500,
  },
  inputs: {
    width: 750,
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing[1],
    gap: theme.spacing[5],
    alignItems: 'center',
    '& > *': {
      maxWidth: `calc(50% - ${theme.spacing[5] / 2}px)`, // 50% - inputs.gap
      flexGrow: 1,
    },
  },
}));

function useFiltersLocalizations() {
  const [, translations] = useTranslateLoader([
    prefixPN('reviewPage.filters'),
    prefixPN('scoresPage.filters.period.final'),
  ]);

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = {
        ..._.get(res, prefixPN('reviewPage.filters')),
        finalPeriod: _.get(res, prefixPN('scoresPage.filters.period.final')),
      };

      return data;
    }

    return {};
  }, [translations]);
}

function useFiltersData({ control }) {
  const selectedProgram = useWatch({
    name: 'program',
    control,
    defaultValue: null,
  });

  const selectedCourse = useWatch({
    name: 'course',
    control,
    defaultValue: null,
  });

  const cache = useCache();
  const centersData = getCentersWithToken();
  const centers = React.useMemo(() => cache('centers', _.map(centersData, 'id')), [centersData]);

  const programsQueries = useCenterPrograms(centers);

  const programs = React.useMemo(() => {
    const isLoadingProgramsQueries = programsQueries.some((query) => query.isLoading);

    if (isLoadingProgramsQueries) {
      return cache('programs', []);
    }

    return cache('programs', _.flatMap(programsQueries, 'data'));
  }, [programsQueries]);

  const { data: selectedProgramDetails } = useProgramDetail(selectedProgram, {
    enabled: !!selectedProgram,
  });
  const { data: classes } = useProgramClasses(selectedProgram, { enabled: !!selectedProgram });

  const courses = React.useMemo(() => selectedProgramDetails?.courses, [selectedProgramDetails]);
  const groups = React.useMemo(() => {
    if (!selectedCourse || !classes?.length) {
      return cache('groups', []);
    }

    return cache(
      'groups',
      _.uniqBy(
        classes
          .map((klass) => ({ ...klass.groups, course: klass.courses.id }))
          .filter((group) => group.course === selectedCourse),
        'id'
      )
    );
  }, [classes, selectedCourse]);

  const { periods } = useMatchingAcademicCalendarPeriods({
    classes,
    filters: { program: selectedProgram, course: selectedCourse },
  });

  return {
    programs,
    courses,
    groups,
    periods,
  };
}

function useParsedData({ programs, courses, groups, periods, localizations }) {
  const _programs = React.useMemo(
    () =>
      programs
        ?.map((program) => ({
          value: program.id,
          label: program.name,
        }))
        ?.filter((program) => program.value && program.label) || [],
    [programs]
  );

  const _courses = React.useMemo(
    () =>
      courses
        ?.map((course) => ({
          value: course.id,
          label: course.name,
        }))
        ?.filter((course) => course.value && course.label) || [],
    [courses]
  );

  const _groups = React.useMemo(() => {
    if (!groups?.length) {
      return [];
    }

    return [
      {
        value: 'all',
        label: localizations?.group?.all,
      },
      ...groups
        ?.map((group) => ({
          value: group.id,
          label: group.name || group.abbreviation,
        }))
        ?.filter((group) => group.value && group.label),
    ];
  }, [groups]);

  const _periods = React.useMemo(() => {
    if (!periods?.length) {
      return [];
    }

    return [
      {
        label: localizations?.period?.all,
        value: 'all',
      },
      ...periods
        .map((period) => ({
          label: period.name,
          value: period.id,
        }))
        .filter((period) => period.value && period.label),
      { label: localizations?.finalPeriod, value: 'final' },
    ];
  });

  return {
    programs: _programs,
    courses: _courses,
    groups: _groups,
    periods: _periods,
  };
}

function useEmitOnChange({ control, onChange }) {
  const { program, course, group, period } = useWatch({ control });

  React.useEffect(() => {
    if (program && course && typeof onChange === 'function') {
      onChange({
        program,
        course,
        group: group === 'all' ? undefined : group,
        period: period === 'all' ? undefined : period,
      });
    }
  }, [program, course, group, period]);
}

export default function Filters({ onChange }) {
  const localizations = useFiltersLocalizations();

  const { classes } = useFiltersStyles();

  const { control } = useForm();

  const filtersData = useFiltersData({ control });
  const { programs, courses, groups, periods } = useParsedData({ ...filtersData, localizations });

  useEmitOnChange({ control, onChange });

  return (
    <Box className={classes.root}>
      <Title order={2} color="soft" transform="uppercase" className={classes.title}>
        {localizations?.title}
      </Title>

      <Box className={classes.inputs}>
        <Controller
          control={control}
          name={'program'}
          render={({ field }) => (
            <Select
              {...field}
              data={programs}
              searchable
              disabled={!programs.length}
              placeholder={localizations?.program?.placeholder}
              ariaLabel={localizations?.program?.label}
            />
          )}
        />
        <Controller
          control={control}
          name={'course'}
          render={({ field }) => {
            if (field.value && !courses?.find((course) => course.value === field.value)) {
              field.onChange(null);
            }

            return (
              <Select
                {...field}
                data={courses}
                searchable
                disabled={!courses?.length}
                placeholder={localizations?.course?.placeholder}
                ariaLabel={localizations?.course?.label}
              />
            );
          }}
        />
        <Controller
          control={control}
          name={'group'}
          render={({ field }) => {
            if (field.value && !groups?.find((group) => group.value === field.value)) {
              field.onChange(null);
            }

            return (
              <Select
                {...field}
                data={groups}
                searchable
                disabled={!groups?.length}
                placeholder={localizations?.group?.placeholder}
                ariaLabel={localizations?.group?.label}
              />
            );
          }}
        />
        <Controller
          control={control}
          name={'period'}
          render={({ field }) => (
            <Select
              {...field}
              data={periods}
              disabled={!periods?.length}
              placeholder={localizations?.period?.placeholder}
              ariaLabel={localizations?.period?.label}
              searchable
            />
          )}
        />
      </Box>
    </Box>
  );
}
