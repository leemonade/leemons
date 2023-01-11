import React, { useMemo } from 'react';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { addAction, fireEvent, removeAction } from 'leemons-hooks';
import generateExcel from '@scores/components/ExcelExport/finalEvaluationWB';
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
export function useExcelDownloadHandler({ classes, students, filters, grades, periods }) {
  const excelLabels = useExcelLabels();

  const programName = React.useMemo(() => filters?.program?.name, [filters?.program]);
  const courseName = React.useMemo(() => {
    const course = filters?.program?.courses?.find((c) => c.id === filters.course);

    return course?.isAlone ? null : course?.name;
  }, [filters?.program, filters?.course]);

  const groupName = React.useMemo(() => {
    const group = filters?.program?.groups?.find((c) => c.id === filters.group);

    return group?.isAlone ? null : group?.name;
  }, [filters?.program, filters?.group]);

  const periodName = React.useMemo(() => {
    if (!filters?.period) {
      return null;
    }

    return filters?.periods?.find((period) => period.id === filters?.period)?.name;
  }, [filters?.period, filters?.periods]);

  React.useEffect(() => {
    const onDownload = ({ args: [format] }) => {
      fireEvent('plugins.scores::downloaded-intercepted');

      try {
        const wb = generateExcel({
          headerShown: format === 'xlsx',
          tableData: { classes, students },
          filters: {
            startDate: filters.startDate,
            endDate: filters.endDate,
            program: programName,
            course: courseName,
            group: groupName,
            period: periodName,
          },
          labels: excelLabels,
        });
        getFile(wb, format);
        fireEvent('plugins.scores::downloaded');
      } catch (e) {
        console.error(e);
        fireEvent('plugins.scores::download-scores-error', e);
        // removeAction('plugins.scores::download-scores', onDownload);
      }
    };

    addAction('plugins.scores::download-scores', onDownload);
    return () => removeAction('plugins.scores::download-scores', onDownload);
  }, [classes, students, grades, programName, courseName, groupName, periodName]);
}

export default useExcelDownloadHandler;
