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

  const onData = useCallback((_data) => {
    setData({ loading: false, data: _data });
  }, []);

  const onError = useCallback((error) => {
    setData({ loading: false, error });
  }, []);

  useAsync(listTasks, onData, onError);

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
        {data.error ? (
          <Paragraph>Error {data.error}</Paragraph>
        ) : (
          <CardList data={data.data?.items} loading={data.loading} />
        )}
      </PageContainer>
    </ContextContainer>
  );
}
