import React from 'react';
import { ContextContainer, Paper, TabPanel, Tabs } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { useHistory } from 'react-router-dom';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import ListByPublished from './components/ListByPublished';

export default function List() {
  const [t] = useTranslateLoader(prefixPN('questionsBanksList'));
  const { t: tCommon } = useCommonTranslate('page_header');

  const history = useHistory();

  // ----------------------------------------------------------------------
  // SETTINGS
  const [store, render] = useStore({
    loading: true,
    page: 0,
    size: 10,
  });

  async function getPermissions() {
    const { permissions } = await getPermissionsWithActionsIfIHaveRequest([
      'plugins.tests.questionsBanks',
    ]);
    if (permissions[0]) {
      store.canAdd =
        permissions[0].actionNames.includes('create') ||
        permissions[0].actionNames.includes('admin');
      render();
    }
  }

  function goCreatePage() {
    history.push('/private/tests/questions-banks/new');
  }

  React.useEffect(() => {
    getPermissions();
  }, []);

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{
          title: t('pageTitle'),
        }}
        buttons={store.canAdd ? { new: tCommon('new') } : {}}
        onNew={() => goCreatePage()}
      />
      <Paper color="solid" shadow="none" padding="none">
        <Tabs usePageLayout={true} panelColor="solid" fullHeight>
          <TabPanel label={t('published')}>
            <ListByPublished t={t} published={true} />
          </TabPanel>
          <TabPanel label={t('draft')}>
            <ListByPublished t={t} published={false} />
          </TabPanel>
        </Tabs>
      </Paper>
    </ContextContainer>
  );
}
