import { useProgramDetail } from '@academic-portfolio/hooks';
import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';
import { Box, createStyles, DatePicker, Select } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { getSessionConfig } from '@users/session';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useMatchingAcademicCalendarPeriods } from '../FinalNotebook/FinalScores';
import usePeriodTypes from '../ScoresPage/Filters/hooks/usePeriodTypes';
import useSelectedPeriod from '../ScoresPage/Filters/hooks/useSelectedPeriod';
import PickDate from '../ScoresPage/Filters/components/PickDate';
import useAcademicCalendarDates from '../ScoresPage/Filters/hooks/useAcademicCalendarDates';

const useFiltersStyles = createStyles((theme) => ({
  root: {
    paddingInline: 48,
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing[5],
  },
  inputs: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing[1],
    gap: theme.spacing[5],
    alignItems: 'center',
    minWidth: 200,
    '& > *': {
      flexGrow: 1,
    },
  },
}));

function useFiltersLocalizations() {
  const key = prefixPN('studentScoresPage.filters');
  const [, translations] = useTranslateLoader(key);

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return _.get(res, key);
    }

    return {};
  }, [translations]);
}

export function Filters({ onChange, setKlasses }) {
  const { classes } = useFiltersStyles();
  const [t] = useTranslateLoader(prefixPN('studentScoresPage.filters'));
  const { program } = getSessionConfig();
  const { data: programDetails } = useProgramDetail(program, {
    enabled: !!program,
  });
  const { data: classesData } = useProgramClasses(program, { enabled: !!program });

  const courses = React.useMemo(
    () => programDetails?.courses.map((course) => ({ value: course.id, label: course.name })),
    [programDetails]
  );

  const { control, watch, setValue } = useForm({});

  useEffect(() => {
    if (courses?.length === 1) {
      setValue('class', courses[0].value);
    }
  }, [courses?.[0]?.value]);

  const selectedCourse = watch('class');

  const { startDate, endDate } = useAcademicCalendarDates({
    control,
    selectedClass: { program, courses: { id: selectedCourse } },
  });

  const { periods } = useMatchingAcademicCalendarPeriods({
    classes: classesData,
    filters: { program, course: selectedCourse },
  });
  const periodTypes = usePeriodTypes();
  const selectedPeriod = useSelectedPeriod({
    periods,
    control,
    program,
    selectedCourse,
    finalLabel: t('period.final'),
  });

  // Emit onChange
  React.useEffect(() => {
    if (selectedCourse && selectedPeriod.isComplete) {
      onChange({
        period: selectedPeriod,
        program,
        control,
        startDate: selectedPeriod.startDate,
        endDate: selectedPeriod.endDate,
        isCustom: selectedPeriod.isCustom,
      });
    }
  }, [JSON.stringify(selectedCourse), JSON.stringify(selectedPeriod)]);

  React.useEffect(() => {
    if (classesData)
      setKlasses(
        classesData.filter((klass) =>
          Array.isArray(klass.courses)
            ? klass.courses.some((course) => course.id === selectedCourse)
            : klass.courses.id === selectedCourse
        )
      );
  }, [JSON.stringify(classesData), selectedCourse]);

  return (
    <Box className={classes.root}>
      <Box className={classes.inputsContainer}>
        <Box className={classes.inputs}>
          {courses?.length > 1 && (
            <Controller
              control={control}
              name="class"
              render={({ field }) => (
                <Select
                  placeholder={t('course.placeholder')}
                  data={courses}
                  autoSelectOneOption
                  {...field}
                />
              )}
            />
          )}
          <Controller
            control={control}
            name="period"
            render={({ field }) => {
              const data = [
                ...periods.map((period) => ({
                  value: period.id,
                  label: period.name,
                  group: period.group,
                })),
                {
                  value: 'custom',
                  label: t('period.custom'),
                },
              ];

              if (data.some((period) => period.group === periodTypes?.academicCalendar)) {
                data.push({
                  value: 'final',
                  label: t('period.final'),
                  group: periodTypes?.academicCalendar,
                });
              }

              const valueExists =
                !field.value ||
                field.value === 'custom' ||
                // eslint-disable-next-line
                !!data.find((d) => d.value == field.value);

              if (!valueExists) {
                field.onChange(null);
              }

              return (
                <Select
                  // label={localizations.period?.label}
                  placeholder={t('period.placeholder')}
                  data={data}
                  {...field}
                />
              );
            }}
          />
        </Box>
        {selectedPeriod.selected === 'custom' && (
          <Box className={classes.inputs}>
            <PickDate control={control} name="startDate" defaultValue={startDate} />
            <PickDate control={control} name="endDate" defaultValue={endDate} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Filters;
