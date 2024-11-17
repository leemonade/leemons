import React, { useMemo } from 'react';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import WeightRenderer from '../components/WeightRenderer';
import TotalWeightRenderer from '../components/TotalWeightRenderer';
import NameRenderer from '../components/NameRenderer';

export default function useColumns({ type, lockable }) {
  const [t] = useTranslateLoader(prefixPN('weightingDrawer.table'));

  return useMemo(
    () => [
      {
        Header: type === 'modules' ? t('modules') : t('roles'),
        accessor: 'name',
        tdStyle: {
          maxWidth: 410,
        },
        Cell: NameRenderer,
      },
      {
        Header: t('weight'),
        accessor: 'weight',
        tdStyle: {
          width: 80,
        },
        Cell: (props) =>
          props.row.original.id === 'total' ? (
            <TotalWeightRenderer lockable={lockable} />
          ) : (
            <WeightRenderer {...props} lockable={lockable} />
          ),
      },
    ],
    [lockable, t, type]
  );
}
