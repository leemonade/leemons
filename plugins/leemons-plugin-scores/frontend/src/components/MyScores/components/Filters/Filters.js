import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Stack } from '@bubbles-ui/components';
import { noop } from 'lodash';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { SelectCourse } from '@academic-portfolio/components';
import PickDate from '@scores/components/ScoresPage/Filters/components/PickDate';
import SelectPeriod from '@scores/components/ScoresPage/Filters/components/SelectPeriod';
import useSelectedPeriod from '@scores/components/ScoresPage/Filters/hooks/useSelectedPeriod';
import { getSessionConfig } from '@users/session';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useStudentPeriods from './hooks/useStudentPeriods';

export default function Filters({ onChange = noop }) {
  const [t] = useTranslateLoader(prefixPN('myScores.filters'));
  const { program } = getSessionConfig();
  const form = useForm();

  const { periods, startDate, endDate } = useStudentPeriods(form);

  const selectedCourse = useWatch({ name: 'course', control: form.control });
  const selectedPeriod = useSelectedPeriod({
    periods,
    control: form.control,
    program,
    selectedCourse,
    // finalLabel: t('period.final'),
    setValue: form.setValue,
  });

  useEffect(() => {
    if (selectedCourse && selectedPeriod.isComplete) {
      onChange({
        program,
        period: selectedPeriod,
        course: selectedCourse,

        startDate: selectedPeriod.startDate,
        endDate: selectedPeriod.endDate,
        isCustom: selectedPeriod.selected === 'custom',
      });
    }
  }, [onChange, selectedPeriod, selectedCourse, startDate, endDate, program]);

  return (
    <Stack spacing={4}>
      <Controller
        name="course"
        control={form.control}
        render={({ field }) => (
          <SelectCourse {...field} program={program} placeholder={t('course')} />
        )}
      />
      <Controller
        control={form.control}
        name="period"
        render={({ field }) => (
          <SelectPeriod {...field} periods={periods} disabled={!selectedCourse} />
        )}
      />
      {selectedPeriod.selected === 'custom' && startDate !== undefined && endDate !== undefined && (
        <>
          <PickDate form={form} name="startDate" defaultValue={startDate} />
          <PickDate form={form} name="endDate" defaultValue={endDate} />
        </>
      )}
    </Stack>
  );
}

Filters.propTypes = {
  onChange: PropTypes.func,
};
