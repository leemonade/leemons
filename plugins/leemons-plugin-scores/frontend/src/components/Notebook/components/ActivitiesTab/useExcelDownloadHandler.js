import React, { useMemo } from 'react';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { addAction, fireEvent, removeAction } from 'leemons-hooks';
import generateExcel from '@scores/components/ExcelExport/evaluationWB';
import { getFile } from '@scores/components/ExcelExport/helpers/workbook';
import { useRoles } from '@assignables/components/Ongoing/AssignmentList/components/Filters/components/Type/Type';

function useExcelLabels() {
  const [, translations] = useTranslateLoader(prefixPN('excel'));

  const excelLabels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return _.get(res, prefixPN('excel'));
    }

    return {};
  }, [translations]);
  return excelLabels;
}
export function useExcelDownloadHandler({
  activitiesData,
  grades,
  filters,
  programData,
  subjectData,
}) {
  const excelLabels = useExcelLabels();

  const roles = useRoles();

  const roleNames = React.useMemo(() => {
    const names = {};

    roles.forEach((role) => {
      names[role.value] = role.label;
    });

    return names;
  }, [roles]);

  React.useEffect(() => {
    const onDownload = ({ args: [format] }) => {
      fireEvent('plugins.scores::downloaded-intercepted');

      try {
        const wb = generateExcel({
          headerShown: format === 'xlsx',
          tableData: { ...activitiesData, grades },
          period: {
            period: filters.period?.period?.name ?? filters.period?.name ?? '-',
            startDate: new Date(filters.startDate),
            endDate: new Date(filters.endDate),
            program: programData.name,
            subject: subjectData.name,
          },
          types: roleNames,
          labels: excelLabels,
        });
        getFile(wb, format);
        fireEvent('plugins.scores::downloaded');
      } catch (e) {
        fireEvent('plugins.scores::download-scores-error', e);
      }
    };

    addAction('plugins.scores::download-scores', onDownload);
    return () => removeAction('plugins.scores::download-scores', onDownload);
  }, [activitiesData, grades, roleNames]);
}

export default useExcelDownloadHandler;
