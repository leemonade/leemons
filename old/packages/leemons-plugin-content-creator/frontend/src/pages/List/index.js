import React from 'react';
import { Box, PageHeader, createStyles, TabPanel, Tabs } from '@bubbles-ui/components';
// import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@content-creator/helpers/prefixPN';
import { useStore, useQuery } from '@common';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { useHistory } from 'react-router-dom';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import AssetList from '@leebrary/components/AssetList';
import { prepareAsset } from '@leebrary/helpers/prepareAsset';
import { DocumentIcon } from '@content-creator/components';

const ListPageStyles = createStyles((theme) => ({
  tabPane: {
    display: 'flex',
    flex: 1,
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[5],
  },
}));

export default function List() {
  const [t] = useTranslateLoader(prefixPN('documentList'));
  const { t: tCommon } = useCommonTranslate('page_header');
  const [currentAsset, setCurrentAsset] = React.useState(null);
  const { fromDraft } = useQuery();

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
      'plugins.content-creator.creator',
    ]);
    if (permissions[0]) {
      store.canAdd =
        permissions[0].actionNames.includes('create') ||
        permissions[0].actionNames.includes('admin');
      render();
    }
  }

  function goCreatePage() {
    history.push('/private/content-creator/new');
  }

  function goDetailPage(asset) {
    if (currentAsset?.id !== asset?.id) {
      setCurrentAsset(prepareAsset(asset));
    }
  }

  React.useEffect(() => {
    getPermissions();
  }, []);

  const { classes } = ListPageStyles({});

  return (
    <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        values={{
          title: t('pageTitle'),
        }}
        icon={<DocumentIcon />}
        buttons={store.canAdd ? { new: tCommon('new') } : {}}
        onNew={() => goCreatePage()}
        fullWidth
      />
      <Tabs
        defaultActiveKey={fromDraft ? '1' : '0'}
        panelColor="solid"
        usePageLayout
        fullWidth
        fullHeight
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
              category="assignables.content-creator"
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
              category="assignables.content-creator"
              onSelectItem={goDetailPage}
              roles={['owner']}
            />
          </Box>
        </TabPanel>
      </Tabs>
    </Box>
  );
}
