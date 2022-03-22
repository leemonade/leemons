import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { ContextContainer, PageContainer, Tabs, TabPanel } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { prefixPN } from '../../../helpers';
import ListTasks from '../../../components/Library/ListTasks';

export default function LibraryPage() {
  const [t] = useTranslateLoader(prefixPN('library_page'));
  const { t: tCommonHeader } = useCommonTranslate('page_header');

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
        <Tabs>
          {/* TRANSLATE: Published tab */}
          <TabPanel label="Published">
            <ListTasks />
          </TabPanel>
          {/* TRANSLATE: Draft tab */}
          <TabPanel label="Draft">
            <ListTasks draft />
          </TabPanel>
        </Tabs>
      </PageContainer>
    </ContextContainer>
  );
}
