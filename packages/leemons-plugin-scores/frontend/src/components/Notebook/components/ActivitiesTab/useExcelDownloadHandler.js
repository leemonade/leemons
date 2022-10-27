import React, { useMemo } from 'react';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { addAction, fireEvent, removeAction } from 'leemons-hooks';
import generateExcel from '@scores/components/ExcelExport/evaluationWB';
import { getFile } from '@scores/components/ExcelExport/helpers/workbook';

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
  }, [activitiesData, grades]);
}

export default useExcelDownloadHandler;
