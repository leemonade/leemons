import React, { useEffect, useState } from 'react';

import { useIsTeacher } from '@academic-portfolio/hooks';
import { Box, FileIcon, Stack, Button, TotalLayoutContainer } from '@bubbles-ui/components';
import {
  AssetBookmarkIcon,
  AssetPathIcon,
  AssetTaskIcon,
  PluginCurriculumIcon,
} from '@bubbles-ui/icons/solid';
import { categoryChecker } from '@leebrary/helpers/categoryChecker';
import prefixPN from '@leebrary/helpers/prefixPN';
import useCategories from '@leebrary/request/hooks/queries/useCategories';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isFunction } from 'lodash';

import { LibraryDetailContent } from '../LibraryDetailContent';
import { LibraryDetailPlayer } from '../LibraryDetailPlayer';
import { LibraryDetailToolbar } from '../LibraryDetailToolbar';
import { EditIcon } from '../LibraryDetailToolbar/icons/EditIcon';

import { LIBRARY_DETAIL_DEFAULT_PROPS, LIBRARY_DETAIL_PROP_TYPES } from './LibraryDetail.constants';
import { LibraryDetailStyles } from './LibraryDetail.styles';

const LibraryDetail = ({
  asset,
  variant,
  variantIcon,
  variantTitle,
  toolbar,
  toolbarItems,
  drawer,
  open,
  labels,
  titleActionButton,
  style,
  excludeMetadatas,
  onCloseDrawer,
  metadataComponent,
  isEmbedded,
  ...events
}) => {
  const [showDrawer, setShowDrawer] = useState(open);
  const [activeTab, setActiveTab] = useState('tab1');
  const isTeacher = useIsTeacher();
  const [t] = useTranslateLoader(prefixPN('list'));
  const { data: categories } = useCategories();
  const handleShare = () => {
    if (isFunction(events?.onShare)) {
      events?.onShare(asset);
    }
  };
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  useEffect(() => {
    if (open) {
      setTimeout(() => setShowDrawer(true), 100);
    } else {
      setTimeout(() => setShowDrawer(false), 100);
    }
  }, [open]);

  const { classes, cx } = LibraryDetailStyles({ drawer, open }, { name: 'LibraryDetail' });
  const fileExtension = asset?.fileExtension;

  const canShowPermissionsButton = categoryChecker(categories, asset);
  return (
    <Box
      style={{ position: 'absolute', height: '100%', width: '100%' }}
      data-cypress-id="library-detail-drawer"
    >
      <Stack
        direction="column"
        fullHeight
        className={cx(classes.root, classes.wrapper, { [classes.show]: showDrawer })}
        style={style}
      >
        <TotalLayoutContainer
          Header={
            <>
              {toolbar && (
                <LibraryDetailToolbar
                  {...events}
                  item={asset}
                  toolbarItems={toolbarItems}
                  open={open}
                  labels={labels}
                  onCloseDrawer={onCloseDrawer}
                  variant={variant}
                  isEmbedded={isEmbedded}
                />
              )}
            </>
          }
        >
          <Stack direction="column" fullHeight className={classes.layoutContainer}>
            <LibraryDetailPlayer
              {...{ ...asset, fileExtension }}
              labels={labels}
              variant={variant}
              variantTitle={variantTitle}
              titleActionButton={titleActionButton}
              isEmbedded={isEmbedded}
              fileIcon={
                {
                  bookmark: (
                    <Box style={{ fontSize: 64, lineHeight: 1, color: '#B9BEC4' }}>
                      <AssetBookmarkIcon />
                    </Box>
                  ),
                  path: (
                    <Box style={{ fontSize: 64, lineHeight: 1, color: '#B9BEC4' }}>
                      <AssetPathIcon />
                    </Box>
                  ),
                  task: (
                    <Box style={{ fontSize: 64, lineHeight: 1, color: '#B9BEC4' }}>
                      <AssetTaskIcon />
                    </Box>
                  ),
                  curriculum: (
                    <Box style={{ fontSize: 64, lineHeight: 1, color: '#B9BEC4' }}>
                      <PluginCurriculumIcon />
                    </Box>
                  ),
                }[variant] || (
                  <FileIcon
                    size={64}
                    fileExtension={asset?.fileExtension}
                    fileType={asset?.fileType || variant}
                    color={'#B9BEC4'}
                    hideExtension
                  />
                )
              }
            />
            <LibraryDetailContent
              {...asset}
              asset={asset}
              excludeMetadatas={excludeMetadatas}
              variantIcon={variantIcon}
              variantTitle={variantTitle}
              variant={variant}
              labels={labels}
              metadataComponent={metadataComponent}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleTabChange={handleTabChange}
              isEmbedded={isEmbedded}
            />
          </Stack>
        </TotalLayoutContainer>
      </Stack>
      {activeTab === 'tab2' && isTeacher && canShowPermissionsButton && (
        <Box className={classes.canAccessFooter}>
          <Button
            variant="outline"
            size="md"
            label={t('editPermissions')}
            className={classes.canAccessButton}
            leftIcon={<EditIcon width={18} height={18} />}
            onClick={handleShare}
          >
            {t('editPermissions')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

LibraryDetail.defaultProps = LIBRARY_DETAIL_DEFAULT_PROPS;
LibraryDetail.propTypes = LIBRARY_DETAIL_PROP_TYPES;

export default LibraryDetail;
export { LibraryDetail };
