import React from 'react';
import PropTypes from 'prop-types';
import { Select } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import usePeriodTypes from '../hooks/usePeriodTypes';

export default function SelectPeriod({ periods, ...field }) {
  const periodTypes = usePeriodTypes();
  const [t] = useTranslateLoader(prefixPN('scoresPage.filters.period'));

  const data = [
    ...(periods?.map((period) => ({
      value: period.id,
      label: period.name,
      group: period.group,
    })) || []),
    {
      value: 'custom',
      label: t('custom'),
    },
  ];

  if (data.some((period) => period.group === periodTypes?.academicCalendar)) {
    data.push({
      value: 'final',
      label: t('final'),
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

  return <Select ariaLabel={t('label')} placeholder={t('placeholder')} data={data} {...field} />;
}

SelectPeriod.propTypes = {
  periods: PropTypes.array,
  t: PropTypes.func,
};
