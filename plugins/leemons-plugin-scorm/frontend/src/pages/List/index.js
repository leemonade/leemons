import React, { useEffect, useState } from 'react';
import { Box, PageHeader, createStyles, TabPanel, Tabs } from '@bubbles-ui/components';
import { useHistory } from 'react-router-dom';
import { useStore, useQuery } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import AssetList from '@leebrary/components/AssetList';
import { prepareAsset } from '@leebrary/helpers/prepareAsset';
import { prefixPN } from '@scorm/helpers';
import { DocumentIcon } from '@scorm/components/icons';

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
  const [t] = useTranslateLoader(prefixPN('scormList'));
  const { t: tCommon } = useCommonTranslate('page_header');
  const [currentAsset, setCurrentAsset] = useState(null);
  const { fromDraft } = useQuery();

  const history = useHistory();

  // ----------------------------------------------------------------------
  // SETTINGS

  const [store, render] = useStore({
    loading: true,
    page: 0,
    size: 10,
  });

  // ----------------------------------------------------------------------
  // INIT DATA LOADING

  async function getPermissions() {
    const { permissions } = await getPermissionsWithActionsIfIHaveRequest([
      'plugins.scorm.creator',
    ]);
    if (permissions[0]) {
      store.canAdd =
        permissions[0].actionNames.includes('create') ||
        permissions[0].actionNames.includes('admin');
      render();
    }
  }

  useEffect(() => {
    getPermissions();
  }, []);

  // ----------------------------------------------------------------------
  // METHODS

  function goCreatePage() {
    history.push('/private/scorm/new');
  }

  function goDetailPage(asset) {
    if (currentAsset?.id !== asset?.id) {
      setCurrentAsset(prepareAsset(asset));
    }
  }

  // ----------------------------------------------------------------------
  // COMPONENT

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
              category="assignables.scorm"
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
              category="assignables.scorm"
              onSelectItem={goDetailPage}
              roles={['owner']}
            />
          </Box>
        </TabPanel>
      </Tabs>
    </Box>
  );
}
