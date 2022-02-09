import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { ContextContainer, PageContainer, Paragraph } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { useApi } from '@common';
import { prefixPN } from '../../../helpers';
import listTasks from '../../../request/task/listTasks';
import CardList from '../../../components/Library/CardList';

export default function LibraryPage() {
  const [t] = useTranslateLoader(prefixPN('library_page'));
  const { t: tCommonHeader } = useCommonTranslate('page_header');

  const [data, dataError, loadingData, refreshData] = useApi(listTasks, false, 30000);
  const [draft, draftError, loadingDraft, refreshDraft] = useApi(listTasks, true, 30000);

  const history = useHistory();
  // ·········································································
  // HANDLERS

  const handleOnNewTask = () => {
    history.push('/private/tasks/library/create');
  };

  // ·········································································
  // INIT VALUES

  const headerLabels = useMemo(
    () => ({
      title: t('page_title'),
    }),
    [t]
  );

  const headerButtons = useMemo(
    () => ({
      new: tCommonHeader('new'),
    }),
    [tCommonHeader]
  );

  // -------------------------------------------------------------------------
  // COMPONENT

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={headerLabels} buttons={headerButtons} onNew={handleOnNewTask} />

      <PageContainer>
        <ContextContainer title="Draft">
          {draftError ? (
            <Paragraph>Error {draftError.message}</Paragraph>
          ) : (
            <CardList data={draft?.items} loading={loadingDraft} refresh={refreshDraft} />
          )}
        </ContextContainer>

        <ContextContainer title="Published">
          {dataError ? (
            <Paragraph>Error {dataError.message}</Paragraph>
          ) : (
            <CardList data={data?.items} loading={loadingData} refresh={refreshData} />
          )}
        </ContextContainer>
      </PageContainer>
    </ContextContainer>
  );
}
