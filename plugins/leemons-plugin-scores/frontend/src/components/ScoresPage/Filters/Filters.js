import React from 'react';
import PropTypes from 'prop-types';

import { Box, Select, Title } from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';

import { SelectProgram } from '@academic-portfolio/components';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { getCentersWithToken } from '@users/session';

import useFiltersStyles from './Filerts.styles';
import ClassItem from './components/ClassItem';
import PickDate from './components/PickDate';
import usePeriods from './hooks/usePeriods';
import useSelectedClass from './hooks/useSelectedClass';
import useSelectedPeriod from './hooks/useSelectedPeriod';
import SelectPeriod from './components/SelectPeriod';

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
                <Select
                  ariaLabel={t('class.label')}
                  placeholder={t('class.placeholder')}
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
            render={({ field }) => <SelectPeriod {...field} periods={periods} t={t} />}
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

Filters.propTypes = {
  hideTitle: PropTypes.bool,
  showProgramSelect: PropTypes.bool,
  classID: PropTypes.string,
  onChange: PropTypes.func,
};

export default Filters;
