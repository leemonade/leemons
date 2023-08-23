import React from 'react';
import { ContextContainer, Box, TabPanel, Tabs, createStyles } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { useHistory } from 'react-router-dom';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import AssetList from '@leebrary/components/AssetList';
import { prepareAsset } from '@leebrary/helpers/prepareAsset';

const ListPageStyles = createStyles((theme) => ({
  tabPane: {
    display: 'flex',
    flex: 1,
    height: '100%',
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[5],
  },
}));

export default function List() {
  const [t] = useTranslateLoader(prefixPN('questionsBanksList'));
  const { t: tCommon } = useCommonTranslate('page_header');
  const [currentAsset, setCurrentAsset] = React.useState(null);

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

  function goDetailPage(asset) {
    // history.push(`/private/tests/questions-banks/${asset.id}`);
    if (currentAsset?.id !== asset?.id) {
      setCurrentAsset(prepareAsset(asset));
    }
  }

  React.useEffect(() => {
    getPermissions();
  }, []);

  const { classes } = ListPageStyles({});

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{
          title: t('pageTitle'),
        }}
        buttons={store.canAdd ? { new: tCommon('new') } : {}}
        onNew={() => goCreatePage()}
        fullWidth
      />

      <Tabs
        usePageLayout
        panelColor="solid"
        fullHeight
        fullWidth
        onTabClick={() => setCurrentAsset(null)}
      >
        <TabPanel label={t('published')}>
          <Box className={classes.tabPane}>
            <AssetList
              canShowPublicToggle={false}
              published={true}
              asset={currentAsset}
              showPublic
              variant="embedded"
              category="tests-questions-banks"
              onSelectItem={goDetailPage}
              roles={['owner']}
            />
          </Box>
        </TabPanel>
        <TabPanel label={t('draft')}>
          <Box className={classes.tabPane}>
            <AssetList
              canShowPublicToggle={false}
              published={false}
              asset={currentAsset}
              showPublic
              variant="embedded"
              category="tests-questions-banks"
              onSelectItem={goDetailPage}
              roles={['owner']}
            />
          </Box>
        </TabPanel>
      </Tabs>
    </ContextContainer>
  );
}
