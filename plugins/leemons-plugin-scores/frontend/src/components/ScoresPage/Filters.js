/* eslint-disable prettier/prettier */
import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import {
  Box,
  createStyles,
  DatePicker,
  ImageLoader,
  Select,
  Text,
  TextClamp,
  Title,
} from '@bubbles-ui/components';
import { unflatten, useCache } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { usePeriods as usePeriodsRequest } from '@scores/requests/hooks/queries';
import _ from 'lodash';
import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { SelectProgram } from '@academic-portfolio/components';
import { getCentersWithToken } from '@users/session';
import { useAcademicCalendarPeriods } from './useAcademicCalendarPeriods';

function ClassItem({ class: klass, dropdown = false, ...props }) {
  return (
    <Box {...props}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing[2],
          alignItems: 'center',
        })}
      >
        <Box
          sx={() => ({
            position: dropdown ? 'static' : 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 26,
            minHeight: 26,
            maxWidth: 26,
            maxHeight: 26,
            borderRadius: '50%',
            backgroundColor: klass?.color,
          })}
        >
          <ImageLoader
            sx={() => ({
              borderRadius: 0,
              filter: 'brightness(0) invert(1)',
            })}
            forceImage
            width={16}
            height={16}
            src={getClassIcon(klass)}
          />
        </Box>
        <Box
          sx={(theme) => ({
            marginLeft: dropdown ? 0 : 26 + theme.spacing[2],
          })}
        >
          <TextClamp lines={dropdown ? 3 : 1}>
            {!klass.groups.isAlone && klass.groups?.name ? (
              <Text>{`${klass.subject.name} - ${klass.groups.name}`}</Text>
            ) : (
              <Text>{klass.subject.name}</Text>
            )}
          </TextClamp>
        </Box>
      </Box>
    </Box>
  );
}

const useFiltersStyles = createStyles((theme, { classID }) => ({
  title: {
    fontSize: theme.fontSizes[2],
    fontWeight: 500,
  },
  widthContainer: {
    width: classID ? 375 : 750,
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
      maxWidth: classID ? '100%' : `calc(50% - ${theme.spacing[5] / 2}px)`, // 50% - inputs.gap
      flexGrow: 1,
    },
  },
}));

function useFiltersLocalizations() {
  const key = prefixPN('scoresPage.filters');
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

function useSelectedClass({ classes, control, classID }) {
  const selectedClass = useWatch({
    control,
    name: 'class',
    defaultValue: null,
  });

  const selectedClassId = classID || selectedClass?.[0];

  return React.useMemo(() => {
    if (!selectedClassId || !classes?.length) {
      return null;
    }

    return classes.find((klass) => klass.id === selectedClassId);
  }, [selectedClassId, classes]);
}

function useSelectedPeriod({ periods, control, selectedClass, finalLabel, setValue }) {
  const currentDate = new Date();
  const currentPeriod = periods.find((p) => {
    const periodStartDate = new Date(p.startDate);
    const periodEndDate = new Date(p.endDate);
    return periodStartDate <= currentDate && currentDate <= periodEndDate;
  });
  const [periodSelected, startDate, endDate] = useWatch({
    control,
    name: ['period', 'startDate', 'endDate'],
  });
  React.useEffect(() => {
    if (currentPeriod) {
      setValue('period', currentPeriod.id);
    }
  }, [setValue, currentPeriod]);


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

  // eslint-disable-next-line
  let selectedPeriod = periods.find((p) => p.id == period);

  if (period === 'final') {
    const academicPeriods = periods.filter((p) => p?.periods);

    const { program } = selectedClass;
    const course = selectedClass.courses.id;

    const periodsInFinal = academicPeriods.map((p) => p?.periods?.[program]?.[course]);

    selectedPeriod = {
      startDate: academicPeriods[0]?.startDate,
      endDate: academicPeriods[academicPeriods.length - 1]?.endDate,
      id: 'final',
      name: finalLabel,
      program,
      course,
      type: 'academic-calendar',
      realPeriods: periodsInFinal,
      periods: academicPeriods,
    };
  } else if (selectedPeriod) {
    if (selectedPeriod.periods && selectedClass) {
      selectedPeriod = {
        ..._.omit(selectedPeriod, ['id', 'programs', 'courses', 'periods']),
        program: selectedClass.program,
        course: selectedClass.courses.id,
        id: selectedPeriod.periods[selectedClass.program][selectedClass.courses.id],
        type: 'academic-calendar',
      };
    } else {
      selectedPeriod = {
        ..._.omit(selectedPeriod, ['programs', 'courses']),
        program: selectedPeriod.programs[0],
        course: selectedPeriod.courses[0] || null,
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

function usePeriods({ selectedClass, classes }) {
  const periodTypes = usePeriodTypes();

  const cache = useCache();
  const { data: periodsResponse, isLoading } = usePeriodsRequest({
    page: 0,
    size: 9999,
  });

  const adminPeriods = React.useMemo(
    () =>
      cache(
        'adminPeriods',
        periodsResponse?.items?.map((period) => ({
          ..._.omit(period, ['program', 'course']),
          programs: [period.program].filter(Boolean),
          courses: [period.course].filter(Boolean),
        })) || []
      ),
    [periodsResponse]
  );

  const academicCalendarPeriods = useAcademicCalendarPeriods({ classes });

  const periods = React.useMemo(() => {
    const allPeriods = [
      ...(adminPeriods?.map((p) => ({ ...p, group: periodTypes?.custom })) || []),
      ...(academicCalendarPeriods?.map((p) => ({ ...p, group: periodTypes?.academicCalendar })) ||
        []),
    ];

    if (!allPeriods.length) {
      return [];
    }

    return allPeriods
      ?.filter((period) => {
        if (!selectedClass) {
          return false;
        }

        if (period.courses?.length) {
          return (
            period.programs.includes(selectedClass.program) &&
            period.courses.includes(selectedClass.courses?.id)
          );
        }

        if (period.programs?.length) {
          return period.programs.includes(selectedClass.program);
        }

        return true;
      })
      ?.sort((a, b) => {
        if (a.group !== b.group) {
          if (a.group === periodTypes?.academicCalendar) {
            return -1;
          }

          return 1;
        }

        return (
          (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) * 100 +
          (new Date(a.endDate).getTime() - new Date(b.endDate).getTime()) * 10 +
          a.name.localeCompare(b.name)
        );
      });
  }, [adminPeriods, academicCalendarPeriods, selectedClass, periodTypes]);

  return {
    periods,
    isLoading,
  };
}

function PickDate({ control, name }) {
  const opposite = name === 'endDate' ? 'startDate' : 'endDate';

  const localizations = useFiltersLocalizations();
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
            ariaLabel={localizations?.[name]?.label}
            placeholder={localizations?.[name]?.placeholder}
          />
        );
      }}
    />
  );
}

export function Filters({ hideTitle, showProgramSelect, classID, onChange }) {
  const centers = getCentersWithToken();
  const { classes, cx } = useFiltersStyles({ classID, showProgramSelect });
  const localizations = useFiltersLocalizations();
  const { control, watch, setValue } = useForm();
  const programId = watch('program');
  const { data: classesData, isLoading: dataIsLoading } = useSessionClasses({
    program: programId,
  });
  const selectedClass = useSelectedClass({ classes: classesData, control, classID });
  const { periods } = usePeriods({ selectedClass, classes: classesData });
  const periodTypes = usePeriodTypes();
  const selectedPeriod = useSelectedPeriod({
    periods,
    control,
    selectedClass,
    finalLabel: localizations?.period?.final,
    setValue,
  });

  // Emit onChange
  React.useEffect(() => {
    if (selectedClass && selectedPeriod.isComplete) {
      onChange({
        period: selectedPeriod,
        program: selectedClass?.program,
        subject: selectedClass?.subject?.id,
        group: selectedClass?.groups?.id,
        startDate: selectedPeriod.startDate,
        endDate: selectedPeriod.endDate,
        class: selectedClass,
        isCustom: selectedPeriod.isCustom,
      });
    }

  }, [JSON.stringify(selectedClass), JSON.stringify(selectedPeriod)]);

  return (
    <Box>
      {!hideTitle ? (
        <Title order={2} className={classes.title} color="soft" transform="uppercase">
          {localizations.title}
        </Title>
      ) : null}

      <Box className={classes.inputsContainer}>
        <Box className={cx(classes.inputs, classes.widthContainer)}>
          {showProgramSelect ? (
            <Controller
              control={control}
              name="program"
              render={({ field }) => (
                <SelectProgram {...field} firstSelected center={_.map(centers, 'id')} />
              )}
            />
          ) : null}
          {!classID ? (
            <Controller
              control={control}
              name="class"
              render={({ field }) => (
                <Select
                  ariaLabel={localizations.class?.label}
                  placeholder={localizations.class?.placeholder}
                  data={classesData?.map((klass) => ({
                    value: klass.id,
                    c: klass,
                  }))}
                  itemComponent={({ c, ...item }) => <ClassItem class={c} dropdown {...item} />}
                  valueComponent={({ c, ...item }) => <ClassItem class={c} {...item} />}
                  disabled={dataIsLoading || !programId}
                  autoSelectOneOption
                  {...field}
                />
              )}
            />
          ) : null}

          <Controller
            control={control}
            name="period"
            render={({ field }) => {
              const data = [
                ...(periods?.map((period) => ({
                  value: period.id,
                  label: period.name,
                  group: period.group,
                })) || []),
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
                  ariaLabel={localizations.period?.label}
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
            <PickDate control={control} name="startDate" />
            <PickDate control={control} name="endDate" />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Filters;
