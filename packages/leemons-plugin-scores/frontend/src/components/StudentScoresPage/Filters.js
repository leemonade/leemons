import { useProgramDetail } from '@academic-portfolio/hooks';
import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';
import { Box, createStyles, DatePicker, Select } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { getSessionConfig } from '@users/session';
import _ from 'lodash';
import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useMatchingAcademicCalendarPeriods } from '../FinalNotebook/FinalScores';

const useFiltersStyles = createStyles((theme) => ({
  root: {
    paddingInline: 48,
  },
  widthContainer: {
    width: 750,
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
    '& > *': {
      maxWidth: `calc(50% - ${theme.spacing[5] / 2}px)`, // 50% - inputs.gap
      flexGrow: 1,
    },
  },
}));

function useFiltersLocalizations() {
  const key = prefixPN('studentScoresPage.filters');
  const [, translations] = useTranslateLoader(key);

  const localizations = React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, key);

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  return localizations;
}

function useSelectedPeriod({ periods, control, program, selectedCourse, finalLabel }) {
  const [periodSelected, startDate, endDate] = useWatch({
    control,
    name: ['period', 'startDate', 'endDate'],
  });

  const period = Array.isArray(periodSelected) ? periodSelected[0] : periodSelected;

  if (period === 'custom') {
    return {
      selected: period,
      isCustom: true,
      isComplete: startDate && endDate,
      startDate,
      endDate,
    };
  }

  // eslint-disable-next-line eqeqeq
  let selectedPeriod = periods.find((p) => p.id == period);

  if (period === 'final') {
    const academicPeriods = periods.filter((p) => p?.periods);

    const periodsInFinal = academicPeriods.map((p) => p?.periods?.[program]?.[selectedCourse]);

    selectedPeriod = {
      startDate: academicPeriods[0]?.startDate,
      endDate: academicPeriods[academicPeriods.length - 1]?.endDate,
      id: 'final',
      name: finalLabel,
      program,
      selectedCourse,
      type: 'academic-calendar',
      realPeriods: periodsInFinal,
      periods: academicPeriods,
    };
  } else if (selectedPeriod) {
    if (selectedPeriod.periods && selectedCourse) {
      selectedPeriod = {
        ..._.omit(selectedPeriod, ['id', 'programs', 'courses', 'periods']),
        program,
        course: selectedCourse,
        id: selectedPeriod.periods[program][selectedCourse],
        type: 'academic-calendar',
      };
    } else {
      selectedPeriod = {
        ..._.omit(selectedPeriod, ['programs', 'courses']),
        program,
        course: selectedCourse || null,
        type: 'scores',
      };
    }
  }

  return {
    selected: period,
    period: selectedPeriod,
    isComplete: !!selectedPeriod,
    startDate: selectedPeriod?.startDate,
    endDate: selectedPeriod?.endDate,
  };
}

function usePeriodTypes() {
  const [, translations] = useTranslateLoader(prefixPN('periodTypes'));

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return _.get(res, prefixPN('periodTypes'));
    }

    return {};
  }, [translations]);
}

function PickDate({ control, name, localizations }) {
  const opposite = name === 'endDate' ? 'startDate' : 'endDate';

  const savedDate = useWatch({ control, name: opposite });
  const date = new Date(savedDate);

  const minDate =
    name === 'endDate' && date.getTime() ? new Date(date.setDate(date.getDate() + 1)) : undefined;
  const maxDate =
    name === 'startDate' && date.getTime() ? new Date(date.setDate(date.getDate() - 1)) : undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        if (name === 'endDate' && field.value && !minDate) {
          field.onChange(null);
        }

        if (name === 'endDate' && !field.value && minDate) {
          const newDate = new Date();
          newDate.setDate(minDate.getDate() + 1);
          field.onChange(newDate);
        }

        return (
          <DatePicker
            {...field}
            minDate={minDate}
            maxDate={maxDate}
            disabled={name === 'endDate' && !minDate}
            label={localizations?.[name]?.label}
            placeholder={localizations?.[name]?.placeholder}
          />
        );
      }}
    />
  );
}

export function Filters({ onChange, setKlasses }) {
  const { classes, cx } = useFiltersStyles();
  const localizations = useFiltersLocalizations();
  const { control, watch } = useForm();
  const { program } = getSessionConfig();
  const { data: programDetails } = useProgramDetail(program, {
    enabled: !!program,
  });
  const { data: classesData } = useProgramClasses(program, { enabled: !!program });
  const courses = React.useMemo(
    () => programDetails?.courses.map((course) => ({ value: course.id, label: course.name })),
    [programDetails]
  );
  const selectedCourse = watch('class');
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
    finalLabel: localizations?.period?.final,
  });

  // Emit onChange
  React.useEffect(() => {
    if (selectedCourse && selectedPeriod.isComplete) {
      onChange({
        period: selectedPeriod,
        program,
        startDate: selectedPeriod.startDate,
        endDate: selectedPeriod.endDate,

        isCustom: selectedPeriod.isCustom,
      });
    }
  }, [JSON.stringify(selectedCourse), JSON.stringify(selectedPeriod)]);

  React.useEffect(() => {
    if (classesData) setKlasses(classesData.filter((klass) => klass.courses.id === selectedCourse));
  }, [JSON.stringify(classesData), selectedCourse]);

  return (
    <Box className={classes.root}>
      <Box className={classes.inputsContainer}>
        <Box className={cx(classes.inputs, classes.widthContainer)}>
          <Controller
            control={control}
            name="class"
            render={({ field }) => (
              <Select
                label={localizations.course?.label}
                placeholder={localizations.course?.placeholder}
                data={courses}
                autoSelectOneOption
                {...field}
              />
            )}
          />
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
                  label: localizations?.period?.custom,
                },
              ];

              if (data.some((period) => period.group === periodTypes?.academicCalendar)) {
                data.push({
                  value: 'final',
                  label: localizations?.period?.final,
                  group: periodTypes?.academicCalendar,
                });
              }

              const valueExists =
                !field.value ||
                field.value === 'custom' ||
                // eslint-disable-next-line eqeqeq
                !!data.find((d) => d.value == field.value);

              if (!valueExists) {
                field.onChange(null);
              }

              return (
                <Select
                  label={localizations.period?.label}
                  placeholder={localizations.period?.placeholder}
                  data={data}
                  {...field}
                />
              );
            }}
          />
        </Box>
        {selectedPeriod.selected === 'custom' && (
          <Box className={classes.inputs}>
            <PickDate control={control} name="startDate" localizations={localizations} />
            <PickDate control={control} name="endDate" localizations={localizations} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Filters;
