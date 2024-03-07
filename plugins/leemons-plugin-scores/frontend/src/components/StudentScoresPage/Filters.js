import { useProgramDetail } from '@academic-portfolio/hooks';
import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';
import { Box, createStyles, Select } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { getSessionConfig } from '@users/session';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMatchingAcademicCalendarPeriods } from '../FinalNotebook/FinalScores';
import useSelectedPeriod from '../ScoresPage/Filters/hooks/useSelectedPeriod';
import PickDate from '../ScoresPage/Filters/components/PickDate';
import useAcademicCalendarDates from '../ScoresPage/Filters/hooks/useAcademicCalendarDates';
import SelectPeriod from '../ScoresPage/Filters/components/SelectPeriod';

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

  const form = useForm({});
  const { control, watch } = form;

  const selectedCourse = watch('class');

  const { periods } = useMatchingAcademicCalendarPeriods({
    classes: classesData,
    filters: { program, course: selectedCourse },
  });
  const selectedPeriod = useSelectedPeriod({
    periods,
    control,
    program,
    selectedCourse,
    finalLabel: t('period.final'),
  });

  const { startDate, endDate } = useAcademicCalendarDates({
    control,
    selectedClass: { program, courses: { id: selectedCourse } },
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
          <Controller
            control={control}
            name="class"
            render={({ field }) => {
              if (!courses?.length) {
                return null;
              }

              if (courses?.length === 1) {
                if (!field.value) {
                  field.onChange(courses[0].value);
                }
                return null;
              }

              return (
                <Select
                  placeholder={t('course.placeholder')}
                  data={courses}
                  autoSelectOneOption
                  {...field}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="period"
            render={({ field }) => (
              <SelectPeriod {...field} periods={periods} t={t} disabled={!selectedCourse} />
            )}
          />
        </Box>
        {selectedPeriod.selected === 'custom' &&
          startDate !== undefined &&
          endDate !== undefined && (
            <Box className={classes.inputs}>
              <PickDate form={form} name="startDate" defaultValue={startDate} />
              <PickDate form={form} name="endDate" defaultValue={endDate} />
            </Box>
          )}
      </Box>
    </Box>
  );
}

export default Filters;
