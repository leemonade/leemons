import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { SelectCourse, SelectProgram } from '@academic-portfolio/components';
import { Stack } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getCentersWithToken } from '@users/session';
import { map, noop } from 'lodash';
import PropTypes from 'prop-types';

import useStudentPeriods from './hooks/useStudentPeriods';

import PickDate from '@scores/components/__DEPRECATED__/ScoresPage/Filters/components/PickDate';
import SelectPeriod from '@scores/components/__DEPRECATED__/ScoresPage/Filters/components/SelectPeriod';
import { prefixPN } from '@scores/helpers';

function useSelectedPeriod({ periods, form, startDate, endDate }) {
  const { control, getValues, setValue } = form;

  const period = useWatch({
    control,
    name: 'period',
  });

  useEffect(() => {
    const currentDate = new Date();
    const currentPeriod = periods.find((p) => {
      const periodStartDate = new Date(p.startDate);
      const periodEndDate = new Date(p.endDate);
      return (
        (periodStartDate <= currentDate && currentDate <= periodEndDate) || p.id === 'fullCourse'
      );
    });

    if (currentPeriod && currentPeriod.id !== getValues('period')) {
      setValue('period', currentPeriod.id);
    }
  }, [periods, getValues, setValue]);

  return useMemo(() => {
    if (!period) {
      return {};
    }

    const selectedPeriod = periods.find((p) => p.id === period);

    if (!selectedPeriod) {
      return {};
    }

    return {
      selected: selectedPeriod,
      period: {
        name: selectedPeriod.name,
        id: selectedPeriod.id,
      },
      isCustom: period === 'custom',
      id: period,
      _id: period,
      isComplete: selectedPeriod.startDate && selectedPeriod.endDate,
      startDate: selectedPeriod.startDate,
      endDate: selectedPeriod.endDate,
    };
  }, [periods, period]);
}

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
    form,
    program,
    startDate,
    endDate,
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
          <SelectPeriod {...field} periods={periods} disabled={!selectedCourse} avoidCustomPeriod />
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
