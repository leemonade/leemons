import React from 'react';
import { useWatch } from 'react-hook-form';

import { useCache } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import _ from 'lodash';

import useAcademicCalendarDates from './useAcademicCalendarDates';

import { prefixPN } from '@scores/helpers';

export default function useSelectedPeriod({
  periods,
  control,
  selectedClass,
  finalLabel,
  setValue,
}) {
  const [t] = useTranslateLoader(prefixPN('scoresPage.filters.period'));

  const cache = useCache();
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

  const { startDate: classStartDate, endDate: classEndDate } = useAcademicCalendarDates({
    control,
    selectedClass,
  });

  React.useEffect(() => {
    if (currentPeriod) {
      setValue('period', currentPeriod.id);
    }
  }, [setValue, currentPeriod]);

  const period = Array.isArray(periodSelected) ? periodSelected[0] : periodSelected;

  if (period === 'custom') {
    return cache('response', {
      selected: period,
      isCustom: true,
      isComplete: startDate && endDate,
      startDate,
      endDate,
      _id: 'custom',
    });
  }

  if (period === 'fullCourse') {
    return cache('response', {
      period: {
        id: 'fullCourse',
        name: t('fullCourse'),
      },
      selected: period,
      isComplete: true,
      startDate: classStartDate,
      endDate: classEndDate,
      _id: 'fullCourse',
    });
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
        program: selectedPeriod.program ?? null,
        course: selectedPeriod.course ?? null,
        type: 'scores',
      };
    }
  }

  return cache('response', {
    selected: period,
    period: selectedPeriod,
    isComplete: !!selectedPeriod,
    startDate: selectedPeriod?.startDate,
    endDate: selectedPeriod?.endDate,
    _id: periodSelected,
  });
}
