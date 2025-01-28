import { useMemo } from 'react';

import useTranslateLoader from '@multilanguage/useTranslateLoader';

import NameRenderer from '../components/NameRenderer';
import TotalWeightRenderer from '../components/TotalWeightRenderer';
import WeightRenderer from '../components/WeightRenderer';

import { prefixPN } from '@scores/helpers';

export default function useColumns({ type, lockable }) {
  const [t] = useTranslateLoader(prefixPN('weightingDrawer.table'));


  return useMemo(
    () => [
      {
        Header: t(type),
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
