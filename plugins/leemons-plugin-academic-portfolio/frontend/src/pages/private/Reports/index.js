import { useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { PivotTable } from '@analytics/components/PivotTable';
import { Box, TLayout, Stack, ImageLoader, Button } from '@bubbles-ui/components';
import { ChevronLeftIcon } from '@bubbles-ui/icons/outline';
import { LocaleDate } from '@common/LocaleDate';
import { ChipsContainer } from '@common/components';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isEmpty } from 'lodash';

import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useReportColumns } from '@academic-portfolio/hooks/queries/useReportColumns';
import { useReportData } from '@academic-portfolio/hooks/queries/useReportData';

const PLUGIN_NAME = 'academic-portfolio';

export default function Reports() {
  const [hasReport, setHasReport] = useState(false);
  const [canGenerate, setCanGenerate] = useState(false);
  const tableRef = useRef(null);
  const [t] = useTranslateLoader(prefixPN('reportsPage'));
  const history = useHistory();
  const { openConfirmationModal } = useLayout();
  const { data: columnsData } = useReportColumns({});
  const { data: reportData, isLoading: isReportDataLoading } = useReportData({
    options: {
      enabled: canGenerate,
    },
  });

  const columns = useMemo(() => {
    return (
      columnsData?.map((column) => ({
        header: t(`columns.${column}`),
        id: column,
        accessorKey: column,
        cell: ({ getValue }) => {
          const value = getValue();
          if (column.toLowerCase().endsWith('date')) {
            return isEmpty(value) ? '-' : <LocaleDate date={value} />;
          } else if (column === 'dataset') {
            return <ChipsContainer items={value.map((item) => `${item.label}: ${item.value}`)} />;
          }
          return value;
        },
      })) ?? []
    );
  }, [columnsData, t]);

  const data = useMemo(() => {
    if (!canGenerate) return [];
    return (
      reportData?.map((session) => ({
        ...session,
        date: new Date(session.date),
      })) ?? []
    );
  }, [reportData, canGenerate]);

  // ······················································
  // HANDLERS

  function handleOnGenerateReport() {
    setCanGenerate(true);
    setHasReport(true);
  }

  function handleOnNewReport() {
    setCanGenerate(false);
    setHasReport(false);
  }

  function handleOnBack() {
    if (hasReport) {
      openConfirmationModal({
        title: t('backConfirmationModal.title'),
        description: t('backConfirmationModal.description'),
        onConfirm: () => {
          history.push(`/private/${PLUGIN_NAME}/programs`);
        },
      })();
    } else {
      history.push(`/private/${PLUGIN_NAME}/programs`);
    }
  }

  function handleOnDownload() {
    if (tableRef.current) {
      const table = tableRef.current;
      table.export();
    }
  }

  return (
    <TLayout>
      <TLayout.Header
        title={t('title')}
        cancelable={false}
        icon={
          <Stack justifyContent="center" alignItems="center">
            <ImageLoader
              style={{ position: 'relative' }}
              src={`/public/${PLUGIN_NAME}/menu-icon.svg`}
              width={18}
              height={18}
            />
          </Stack>
        }
      ></TLayout.Header>
      <TLayout.Content
        fullWidth
        title={t('reports')}
        TopZone={
          <Box sx={(theme) => ({ paddingBlock: theme.spacing[4] })}>
            <Button
              variant="link"
              leftIcon={<ChevronLeftIcon style={{ width: 12, height: 12 }} />}
              onClick={handleOnBack}
            >
              {t('back')}
            </Button>
          </Box>
        }
      >
        <PivotTable
          ref={tableRef}
          data={data}
          columns={columns}
          onGenerateReport={handleOnGenerateReport}
          onNewReport={handleOnNewReport}
          loading={canGenerate && isReportDataLoading}
        />

        <TLayout.Footer fullWidth>
          <TLayout.Footer.RightActions>
            <Button onClick={handleOnDownload} disabled={!tableRef.current || data.length === 0}>
              {t('downloadReport')}
            </Button>
          </TLayout.Footer.RightActions>
        </TLayout.Footer>
      </TLayout.Content>
    </TLayout>
  );
}
