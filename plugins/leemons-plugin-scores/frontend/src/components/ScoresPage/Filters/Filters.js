import React from 'react';
import PropTypes from 'prop-types';

import { Box, Title } from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';

import { SelectProgram } from '@academic-portfolio/components';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { getCentersWithToken } from '@users/session';

import { SelectSubject } from '@academic-portfolio/components/SelectSubject';
import useFiltersStyles from './Filerts.styles';
import PickDate from './components/PickDate';
import SelectPeriod from './components/SelectPeriod';
import usePeriods from './hooks/usePeriods';
import useSelectedClass from './hooks/useSelectedClass';
import useSelectedPeriod from './hooks/useSelectedPeriod';
import useOnChange from './hooks/useOnChange';
import useAcademicCalendarDates from './hooks/useAcademicCalendarDates';

export function Filters({ hideTitle, showProgramSelect, classID, onChange }) {
  const [t] = useTranslateLoader(prefixPN('scoresPage.filters'));
  const { control, watch, setValue } = useForm();
  const { classes, cx } = useFiltersStyles({ classID, showProgramSelect });

  const centers = getCentersWithToken();
  const programId = watch('program');
  const { data: classesData, isLoading: dataIsLoading } = useSessionClasses({
    program: programId,
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

  const { startDate, endDate } = useAcademicCalendarDates({ control, selectedClass });

  useOnChange(selectedClass, selectedPeriod, onChange);

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
                <SelectProgram {...field} firstSelected center={_.map(centers, 'id')} />
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
                      const isGroupAlone = !klass.groups || klass.groups.isAlone;

                      return {
                        ...klass.subject,
                        value: klass.id,
                        label: isGroupAlone
                          ? klass.subject?.name
                          : `${klass.subject.name} - ${klass.groups.name}`,
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

Filters.propTypes = {
  hideTitle: PropTypes.bool,
  showProgramSelect: PropTypes.bool,
  classID: PropTypes.string,
  onChange: PropTypes.func,
};

export default Filters;
