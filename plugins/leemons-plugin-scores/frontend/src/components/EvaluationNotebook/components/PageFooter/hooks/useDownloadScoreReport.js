import { useCallback, useMemo } from 'react';

import { unflatten } from '@common';
import { get } from 'lodash';

import { useRoles } from '@assignables/components/Ongoing/AssignmentList/components/Filters/components/Type/Type';
import { addErrorAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import generateExcel from '@scores/components/ExcelExport/evaluationWB';
import { getFile } from '@scores/components/ExcelExport/helpers/workbook';
import { prefixPN } from '@scores/helpers';

function useExcelLabels() {
  const [, translations] = useTranslateLoader(prefixPN('excel'));

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return get(res, prefixPN('excel'));
    }

    return {};
  }, [translations]);
}

export default function useDownloadScoreReport() {
  const excelLabels = useExcelLabels();

  const roles = useRoles();

  const roleNames = useMemo(() => {
    const names = {};

    roles.forEach((role) => {
      names[role.value] = role.label;
    });

    return names;
  }, [roles]);

  return useCallback(
    (tableData, format = 'xlsx') => {
      try {
        const params = [tableData]
          .flat()
          .map(({ activitiesData, grades, filters, programData, subjectData }) => {
            const { activities, ...activitiesDataWithoutActivities } = activitiesData;

            return {
              headerShown: format === 'xlsx',
              tableData: {
                ...activitiesDataWithoutActivities,
                activities: activities.map((activity) => ({
                  ...activity,
                  activity: activity?.activity ?? activity?.instance,
                })),
                grades,
              },
              period: {
                period: filters.period?.period?.name ?? filters.period?.name ?? '-',
                startDate: new Date(filters.startDate),
                endDate: new Date(filters.endDate),
                program: programData?.name,
                subject: subjectData?.name,
              },
              types: roleNames,
              labels: excelLabels,
            };
          });

        const wb = generateExcel(params);
        getFile(wb, format);
      } catch (e) {
        addErrorAlert(excelLabels.alerts.error, e.message);
      }
    },
    [excelLabels, roleNames]
  );
}
