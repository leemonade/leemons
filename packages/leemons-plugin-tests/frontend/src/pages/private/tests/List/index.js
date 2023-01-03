import React from 'react';
import { ContextContainer, TabPanel, Tabs, Box, createStyles } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { useHistory } from 'react-router-dom';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import AssetList from '@leebrary/components/AssetList';
import { prepareAsset } from '@leebrary/helpers/prepareAsset';
import useAcademicFiltersForAssetList from '@assignables/hooks/useAcademicFiltersForAssetList';

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
  const [t] = useTranslateLoader(prefixPN('testsList'));
  const { t: tCommon } = useCommonTranslate('page_header');
  const [currentAsset, setCurrentAsset] = React.useState(null);
  const academicFilters = useAcademicFiltersForAssetList();

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
    // history.push(`/private/tests/${asset.id}`);
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
        panelColor="solid"
        usePageLayout
        fullHeight
        fullWidth
        onTabClick={() => setCurrentAsset(null)}
      >
        <TabPanel label={t('published')}>
          <Box className={classes.tabPane}>
            <AssetList
              {...academicFilters}
              canShowPublicToggle={false}
              published={true}
              asset={currentAsset}
              showPublic
              variant="embedded"
              category="assignables.tests"
              onSelectItem={goDetailPage}
              roles={['owner']}
            />
          </Box>
        </TabPanel>
        <TabPanel label={t('draft')}>
          <Box className={classes.tabPane}>
            <AssetList
              {...academicFilters}
              canShowPublicToggle={false}
              published={false}
              asset={currentAsset}
              showPublic
              variant="embedded"
              category="assignables.tests"
              onSelectItem={goDetailPage}
              roles={['owner']}
            />
          </Box>
        </TabPanel>
      </Tabs>
    </ContextContainer>
  );
}
