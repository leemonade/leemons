export function getOperators(t) {
  return [
    {
      label: t('operatorGT'),
      value: 'gt',
    },
    {
      label: t('operatorGTE'),
      value: 'gte',
    },
    {
      label: t('operatorEQ'),
      value: 'eq',
    },
    {
      label: t('operatorLTE'),
      value: 'lte',
    },
    {
      label: t('operatorLT'),
      value: 'lt',
    },
    {
      label: t('operatorNEQ'),
      value: 'neq',
    },
    {
      label: t('operatorContains'),
      value: 'contains',
    },
  ];
}
