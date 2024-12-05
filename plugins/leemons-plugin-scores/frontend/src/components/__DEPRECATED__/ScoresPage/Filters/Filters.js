import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { SelectProgram } from '@academic-portfolio/components';
import { SelectSubject } from '@academic-portfolio/components/SelectSubject';
import getSubjectGroupCourseNamesFromClassData from '@academic-portfolio/helpers/getSubjectGroupCourseNamesFromClassData';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import { Box, Title } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getCentersWithToken } from '@users/session';
import { map, noop } from 'lodash';
import PropTypes from 'prop-types';

import useFiltersStyles from './Filerts.styles';
import PickDate from './components/PickDate';
import SelectPeriod from './components/SelectPeriod';
import useAcademicCalendarDates from './hooks/useAcademicCalendarDates';
import useOnChange from './hooks/useOnChange';
import usePeriods from './hooks/usePeriods';
import useSelectedClass from './hooks/useSelectedClass';
import useSelectedPeriod from './hooks/useSelectedPeriod';

import { prefixPN } from '@scores/helpers';

export function Filters({
  hideTitle,
  showProgramSelect,
  classID,
  onChange = noop,
  value,
  teacherTypeFilter,
}) {
  const [t] = useTranslateLoader(prefixPN('scoresPage.filters'));
  const form = useForm();
  const { control, watch, setValue, getValues } = form;
  const { classes, cx } = useFiltersStyles({ classID, showProgramSelect });

  const centers = getCentersWithToken();
  const programId = watch('program');
  const { data: classesData, isLoading: dataIsLoading } = useSessionClasses({
    program: programId,
    type: teacherTypeFilter,
  });

  const selectedClass = useSelectedClass({ classes: classesData, control, classID });
  const { periods } = usePeriods({ selectedClass, classes: classesData });

  const selectedPeriod = useSelectedPeriod({
    periods,
    control,
    selectedClass,
    finalLabel: t('period.final'),
    setValue,
  });

  const { startDate, endDate } = useAcademicCalendarDates({ selectedClass });

  useOnChange(selectedClass, selectedPeriod, onChange);

  useEffect(() => {
    if (value) {
      const values = getValues();

      if (value.program && value.program !== values.program) {
        setValue('program', value.program.id);
      }

      if (value.class && value.class.id !== values.class) {
        setValue('class', value.class.id);
      }

      // if (value.period && value.period._id !== values.period) {
      //   setValue('period', value.period._id);
      // }
    }
  }, [value, setValue, getValues]);

  return (
    <Box>
      {!hideTitle ? (
        <Title order={2} className={classes.title} color="soft" transform="uppercase">
          {t('title')}
        </Title>
      ) : null}

      <Box className={classes.inputsContainer}>
        <Box className={cx(classes.inputs, classes.widthContainer)}>
          {showProgramSelect ? (
            <Controller
              control={control}
              name="program"
              render={({ field }) => (
                <SelectProgram {...field} firstSelected center={map(centers, 'id')} />
              )}
            />
          ) : null}
          {!classID ? (
            <Controller
              control={control}
              name="class"
              render={({ field }) => (
                <SelectSubject
                  ariaLabel={t('class.label')}
                  placeholder={t('class.placeholder')}
                  data={
                    classesData?.map((klass) => {
                      // const isGroupAlone = !klass.groups || klass.groups.isAlone;
                      const parsedGroupName = getSubjectGroupCourseNamesFromClassData(klass);
                      return {
                        ...klass.subject,
                        value: klass.id,
                        label: parsedGroupName.subject,
                        subLabel: parsedGroupName.courseAndGroupParsed,
                      };
                    }) ?? []
                  }
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
            render={({ field }) => (
              <SelectPeriod {...field} periods={periods} t={t} disabled={!selectedClass} />
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

Filters.propTypes = {
  hideTitle: PropTypes.bool,
  showProgramSelect: PropTypes.bool,
  classID: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.object,
  teacherTypeFilter: PropTypes.string,
};

export default Filters;
