import { useEffect, useState } from 'react';

import { Button } from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import useCloseEvaluation from './hooks/useCloseEvaluation';
import useDownloadScoreReport from './hooks/useDownloadScoreReport';

import { prefixPN } from '@scores/helpers';
import useEvaluationNotebookStore from '@scores/stores/evaluationNotebookStore';

export default function Footer({ isCustom }) {
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook.footer'));
  const tableData = useEvaluationNotebookStore((state) => state.tableData);
  const isPeriodPublished = useEvaluationNotebookStore((state) => state.isPeriodPublished);
  const setIsPeriodPublished = useEvaluationNotebookStore((state) => state.setIsPeriodPublished);

  const [isLoading, setIsLoading] = useState(false);

  const downloadScoreReport = useDownloadScoreReport();
  const onCloseEvaluation = useCloseEvaluation();

  useEffect(() => {
    const isPublished = tableData?.activitiesData?.value?.every(
      (student) => !student.allowCustomChange
    );

    if (isPublished !== isPeriodPublished) {
      setIsPeriodPublished(isPublished);
    }
  }, [tableData?.activitiesData?.value, isPeriodPublished, setIsPeriodPublished]);

  if (!tableData?.activitiesData?.activities?.length || !tableData?.activitiesData?.value?.length) {
    return null;
  }

  return (
    <>
      {!isCustom && (
        <Button
          loading={isLoading}
          disabled={isPeriodPublished}
          onClick={() => {
            setIsLoading(true);
            onCloseEvaluation(tableData).finally(() => setIsLoading(false));
          }}
        >
          {t('closeEvaluation')}
        </Button>
      )}
      <Button
        variant="outline"
        onClick={() => downloadScoreReport(tableData, 'xlsx')}
        leftIcon={<DownloadIcon />}
      >
        Excel
      </Button>
      <Button
        variant="outline"
        onClick={() => downloadScoreReport(tableData, 'csv')}
        leftIcon={<DownloadIcon />}
      >
        CSV
      </Button>
    </>
  );
}

Footer.propTypes = {
  isCustom: PropTypes.bool,
};
