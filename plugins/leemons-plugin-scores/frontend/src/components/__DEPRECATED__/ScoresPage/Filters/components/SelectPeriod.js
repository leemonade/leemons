import { Select } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import usePeriodTypes from '../hooks/usePeriodTypes';

import { prefixPN } from '@scores/helpers';

function usePeriodsData({ periods, t }) {
  const periodTypes = usePeriodTypes();

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

  return data;
}

export default function SelectPeriod({ periods, ...field }) {
  const [t] = useTranslateLoader(prefixPN('scoresPage.filters.period'));
  const data = usePeriodsData({ periods, t });

  return (
    <Select
      {...field}
      ariaLabel={t('label')}
      placeholder={t('placeholder')}
      data={data}
      autoSelectOneOption={!field.disabled && data.length === 1}
      cleanOnMissingValue
    />
  );
}

SelectPeriod.propTypes = {
  periods: PropTypes.array,
  t: PropTypes.func,
};
