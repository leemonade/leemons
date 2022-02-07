import React, { useMemo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ContextContainer, PageContainer, Paragraph } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { useAsync } from '@common';
import { prefixPN } from '../../../helpers';
import listTasks from '../../../request/task/listTasks';
import CardList from '../../../components/Library/CardList';

export default function LibraryPage() {
  const [t] = useTranslateLoader(prefixPN('library_page'));
  const { t: tCommonHeader } = useCommonTranslate('page_header');
  const [data, setData] = useState({ loading: true, data: [] });
  const [draft, setDraft] = useState({ loading: true, data: [] });

  const onData = (setter) =>
    useCallback((_data) => {
      setter({ loading: false, data: _data });
    }, []);

  const onError = (setter) =>
    useCallback((error) => {
      setter({ loading: false, error });
    }, []);

  useAsync(listTasks, onData(setData), onError(setData));
  useAsync(() => listTasks(true), onData(setDraft), onError(setDraft));

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
          {draft.error ? (
            <Paragraph>Error {draft.error}</Paragraph>
          ) : (
            <CardList data={draft.data?.items} loading={draft.loading} />
          )}
        </ContextContainer>

        <ContextContainer title="Published">
          {data.error ? (
            <Paragraph>Error {data.error}</Paragraph>
          ) : (
            <CardList data={data.data?.items} loading={data.loading} />
          )}
        </ContextContainer>
      </PageContainer>
    </ContextContainer>
  );
}
