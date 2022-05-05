import React from 'react';
import { ContextContainer, Paper, TabPanel, Tabs } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { useHistory } from 'react-router-dom';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import AssetList from '@leebrary/components/AssetList';

export default function List() {
  const [t] = useTranslateLoader(prefixPN('testsList'));
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
    const { permissions } = await getPermissionsWithActionsIfIHaveRequest(['plugins.tests.tests']);
    if (permissions[0]) {
      store.canAdd =
        permissions[0].actionNames.includes('create') ||
        permissions[0].actionNames.includes('admin');
      render();
    }
  }

  function goCreatePage() {
    history.push('/private/tests/new');
  }

  function goDetailPage(asset) {
    history.push(`/private/tests/${asset.id}`);
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

      <Tabs usePageLayout={true} panelColor="solid" fullHeight>
        <TabPanel label={t('published')}>
          <Paper padding={2} mt={20} mb={20} fullWidth color="solid" shadow="none">
            <AssetList
              canShowPublicToggle={false}
              published={true}
              showPublic
              variant="embedded"
              category="assignables.tests"
              onSelectItem={goDetailPage}
            />
          </Paper>
        </TabPanel>
        <TabPanel label={t('draft')}>
          <Paper padding={2} mt={20} mb={20} fullWidth color="solid" shadow="none">
            <AssetList
              canShowPublicToggle={false}
              published={false}
              showPublic
              variant="embedded"
              category="assignables.tests"
              onSelectItem={goDetailPage}
            />
          </Paper>
        </TabPanel>
      </Tabs>
    </ContextContainer>
  );
}
