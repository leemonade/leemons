import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Stack } from '@bubbles-ui/components';
import { map, noop } from 'lodash';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { SelectCourse, SelectProgram } from '@academic-portfolio/components';
import PickDate from '@scores/components/__DEPRECATED__/ScoresPage/Filters/components/PickDate';
import SelectPeriod from '@scores/components/__DEPRECATED__/ScoresPage/Filters/components/SelectPeriod';
import useSelectedPeriod from '@scores/components/__DEPRECATED__/ScoresPage/Filters/hooks/useSelectedPeriod';
import { getCentersWithToken } from '@users/session';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useStudentPeriods from './hooks/useStudentPeriods';

export default function Filters({ onChange = noop, value }) {
  const [t] = useTranslateLoader(prefixPN('myScores.filters'));
  const form = useForm();
  const { getValues, setValue } = form;

  const { periods, startDate, endDate } = useStudentPeriods(form);
  const centers = getCentersWithToken();

  const selectedCourse = useWatch({ name: 'course', control: form.control });
  const program = useWatch({ name: 'program', control: form.control });
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

  useEffect(() => {
    if (value) {
      if (value.program && getValues('program') !== value.program) {
        setValue('program', value.program);
      }

      if (value.period && getValues('period') !== value.period?._id) {
        setValue('period', value.period._id);
      }

      if (value.course && getValues('course') !== value.course) {
        setValue('course', value.course);
      }
    }
  }, [value, form, getValues, setValue]);

  return (
    <Stack spacing={4}>
      <Controller
        name="program"
        control={form.control}
        render={({ field }) => (
          <SelectProgram {...field} firstSelected center={map(centers, 'id')} />
        )}
      />
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
  value: PropTypes.object,
};
