import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, ContextContainer, createStyles, TabPanel, Tabs } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import AssetList from '@leebrary/components/AssetList';
import { prepareAsset } from '@leebrary/helpers/prepareAsset';
import useAcademicFiltersForAssetList from '@assignables/hooks/useAcademicFiltersForAssetList';
import { prefixPN } from '../../../helpers';

const LibraryPageStyles = createStyles((theme) => ({
  pageContainer: {
    display: 'flex',
  },
  tabs: {
    display: 'flex',
    flex: 1,
  },
  tabPane: {
    display: 'flex',
    flex: 1,
    height: '100%',
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[5],
  },
}));

export default function LibraryPage() {
  const [t] = useTranslateLoader(prefixPN('library_page'));
  const { t: tCommonHeader } = useCommonTranslate('page_header');
  const [currentAsset, setCurrentAsset] = React.useState(null);
  const academicFilters = useAcademicFiltersForAssetList();

  const history = useHistory();

  // ·········································································
  // HANDLERS

  const handleOnNewTask = () => {
    history.push('/private/tasks/library/create');
  };

  const handleOnSelectTask = (item) => {
    // history.push(`/private/tasks/library/edit/${item.providerData?.id}`);
    if (currentAsset?.id !== item?.id) {
      setCurrentAsset(prepareAsset(item));
    }
  };

  // ·········································································
  // INIT VALUES

  const headerLabels = useMemo(
    () => ({
      title: t('page_title'),
      published: t('published'),
      draft: t('draft'),
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

  const { classes } = LibraryPageStyles({}, { name: 'LibraryPage' });

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={headerLabels}
        buttons={headerButtons}
        onNew={handleOnNewTask}
        fullWidth
      />
      <Tabs
        usePageLayout
        panelColor="solid"
        fullHeight
        fullWidth
        onTabClick={() => setCurrentAsset(null)}
      >
        {/* TRANSLATE: Published tab */}
        <TabPanel label={headerLabels.published}>
          <Box className={classes.tabPane}>
            <AssetList
              {...academicFilters}
              canShowPublicToggle={false}
              published
              showPublic
              asset={currentAsset}
              variant="embedded"
              category="assignables.task"
              onSelectItem={handleOnSelectTask}
              roles={['owner', 'assigner']}
            />
          </Box>
        </TabPanel>
        {/* TRANSLATE: Draft tab */}
        <TabPanel label={headerLabels.draft}>
          <Box className={classes.tabPane}>
            <AssetList
              {...academicFilters}
              canShowPublicToggle={false}
              published={false}
              showPublic
              asset={currentAsset}
              variant="embedded"
              category="assignables.task"
              onSelectItem={handleOnSelectTask}
              roles={['owner', 'assigner']}
            />
          </Box>
        </TabPanel>
      </Tabs>
    </ContextContainer>
  );
}
