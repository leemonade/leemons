import { isNumber } from 'lodash';
import { htmlToText } from '@common';

import { ActivityItem } from '@assignables/components/Ongoing/AssignmentList/hooks/useParseAssignations/parseAssignationForCommon';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import { useMemo } from 'react';

export default function useColumns({ weights, setModulesOpened, modulesOpened }) {
  const [t] = useTranslateLoader(prefixPN('evaluationTable.columns'));

  return useMemo(
    () =>
      [
        {
          Header: weights?.type === 'modules' ? t('module') : t('activity'),
          accessor: 'instance',
          Cell: ({ value: instance }) =>
            ActivityItem({
              instance,
              flattened: weights?.type !== 'modules',
              modulesOpened,
              onModuleClick: (moduleId) => {
                setModulesOpened((opened) => {
                  if (opened.includes(moduleId)) {
                    return opened.filter((id) => id !== moduleId);
                  }
                  return [...opened, moduleId];
                });
              },
            }),
        },
        weights?.type === 'modules' && {
          Header: t('activities'),
          accessor: 'instance.metadata.module.activities.length',
          Cell: ({ value: count }) => count ?? '-',
        },
        {
          Header: t('weight'),
          accessor: 'weight',
          Cell: ({ value: weight, row }) =>
            [
              !row?.original?.instance?.gradable ? '-' : `${weight * 100}%`,
              row?.original?.totalWeight ? `(${row.original.totalWeight * 100}%)` : null,
            ]
              .filter(Boolean)
              .join(' '),
        },
        {
          Header: t('evaluation'),
          accessor: 'mainGrade',
          Cell: ({ value: mainGrade }) =>
            !isNumber(mainGrade) ? '-' : parseFloat(mainGrade?.toFixed(2)),
        },
        {
          Header: t('feedback'),
          accessor: 'feedback',
          Cell: ({ value: feedback }) => (!feedback ? '-' : htmlToText(feedback)),
        },
      ].filter(Boolean),
    [t, modulesOpened, setModulesOpened, weights]
  );
}
