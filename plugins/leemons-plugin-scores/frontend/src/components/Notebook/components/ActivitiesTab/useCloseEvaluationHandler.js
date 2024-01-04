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

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return _.get(res, prefixPN('excel'));
    }

    return {};
  }, [translations]);
}
export function useCloseEvaluationHandler({
  activitiesData,
  grades,
  filters,
  programData,
  subjectData,
}) {
  React.useEffect(() => {
    const onDownload = ({ args: [format] }) => {
      fireEvent('scores::downloaded-intercepted');

      try {
        const scores = getStudentsScores({
          activitiesData,
          grades,
          isLoading,
          period: filters?.period,
          class: filters?.class,
          labels: labels?.periodSubmission,
        });

        mutateAsync({ scores })
          .then(() =>
            addSuccessAlert(
              labels?.periodSubmission?.success?.replace(
                '{{period}}',
                filters?.period?.period?.name
              )
            )
          )
          .catch((e) =>
            addErrorAlert(
              labels?.periodSubmission?.error
                ?.replace('{{period}}', filters?.period?.period?.name)
                ?.replace('{{error}}', e.message || e.error)
            )
          );
        fireEvent('scores::downloaded');
      } catch (e) {
        fireEvent('scores::download-scores-error', e);
      }
    };

    addAction('scores::download-scores', onDownload);
    return () => removeAction('scores::download-scores', onDownload);
  }, [activitiesData, grades, roleNames]);
}

export default useExcelDownloadHandler;
