import React, { useEffect, useMemo, useState } from 'react';

import { useIsTeacher } from '@academic-portfolio/hooks';
import {
  Box,
  Text,
  useClipboard,
  Tabs,
  TabPanel,
  UserDisplayItem,
  HtmlText,
  ContextContainer,
  AvatarSubject,
} from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN as tasksPrefixPN } from '@tasks/helpers/prefixPN';
import { isEmpty } from 'lodash';

import prefixPN from '../../helpers/prefixPN';

import {
  LIBRARY_DETAIL_CONTENT_DEFAULT_PROPS,
  LIBRARY_DETAIL_CONTENT_PROP_TYPES,
} from './LibraryDetailContent.constants';
import { LibraryDetailContentStyles } from './LibraryDetailContent.styles';
import { DetailContent } from './components/DetailContent/DetailContent';

import { getFileUrl } from '@leebrary/helpers/prepareAsset';

const LibraryDetailContent = ({
  description,
  metadata,
  tags,
  url,
  icon,
  fileType,
  fileExtension,
  variant,
  variantIcon,
  variantTitle,
  excludeMetadatas,
  name,
  subjects,
  program,
  metadataComponent,
  file,
  canAccess,
  classesCanAccess,
  asset,
  activeTab,
  setActiveTab,
  isEmbedded,
  onCopy = () => {},
  // eslint-disable-next-line no-unused-vars
  ...props
}) => {
  const isTeacher = useIsTeacher();
  const { classes } = LibraryDetailContentStyles({}, { name: 'LibraryDetailContent' });
  const clipboard = useClipboard({ timeout: 2000 });
  const [t, translations] = useTranslateLoader(prefixPN('list'));
  const [tasksT] = useTranslateLoader(
    tasksPrefixPN('task_setup_page.setup.instructionData.labels')
  );

  const [subjectsIds, setSubjectsIds] = useState([]);
  const [canAccessData, setCanAccessData] = useState([]);
  const isAssetWithInstuctions =
    asset?.providerData?.instructionsForTeachers || asset?.providerData?.instructionsForStudents;
  const detailLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      return items.leebrary.list.labels;
    }
    return {};
  }, [JSON.stringify(translations)]);
  const handleCopy = () => {
    clipboard.copy(url);
    onCopy();
  };

  useEffect(() => {
    if (subjects) {
      setSubjectsIds(subjects);
    }
  }, [subjects]);

  useEffect(() => {
    if (canAccess && canAccess.length > 0) {
      setCanAccessData([...canAccess, ...classesCanAccess]);
    }
  }, [canAccess, classesCanAccess]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const DetailContentComponent = (
    <DetailContent
      asset={asset}
      name={name}
      description={description}
      subjectsIds={subjectsIds}
      program={program}
      metadataComponent={metadataComponent}
      handleCopy={handleCopy}
      tags={tags}
      metadata={metadata}
      icon={icon}
      fileType={fileType}
      fileExtension={fileExtension}
      variant={variant}
      variantIcon={variantIcon}
      variantTitle={variantTitle}
      file={file}
      url={url}
      classes={classes}
    />
  );
  if (variant === 'embedded' || isEmbedded) {
    return DetailContentComponent;
  }

  return (
    <Tabs
      fullHeight
      panelColor="default"
      centerGrow
      className={classes.tab}
      activeKey={activeTab}
      onChange={handleTabChange}
    >
      <TabPanel label={detailLabels?.detail} key="tab1">
        {DetailContentComponent}
      </TabPanel>
      <TabPanel label={detailLabels?.permissions} key="tab2">
        <Box className={classes.tabPanelPermissions}>
          <Box>
            <Text
              className={classes.title}
            >{`${detailLabels?.permissions} (${canAccess?.length})`}</Text>
            <Box styles={{ paddingBottom: 1000 }}>
              {canAccessData?.length > 0 && (
                <Box className={classes.canAccessContainer}>
                  {canAccessData.map((item) => {
                    if (item?.class) {
                      return (
                        <Box key={item.id} className={classes.canAccessItem}>
                          <Box className={classes.avatarWrapper}>
                            <AvatarSubject
                              key={item.id}
                              icon={getFileUrl(item?.icon?.cover?.id)}
                              color={item?.color}
                              name={item?.fullName}
                            />
                            <Box>
                              <Text strong>{item?.fullName}</Text>
                            </Box>
                          </Box>
                          <Box className={classes.canAccessTextContainer}>
                            <Text className={classes.canAccessText}>
                              {item?.role ? t(`${item?.role}`) : ''}
                            </Text>
                          </Box>
                        </Box>
                      );
                    } else {
                      return (
                        <Box key={item.id} className={classes.canAccessItem}>
                          <Box className={classes.avatarWrapper}>
                            <UserDisplayItem variant="inline" size="md" {...item} />
                          </Box>
                          <Box className={classes.canAccessTextContainer}>
                            <Text className={classes.canAccessText}>
                              {Array.isArray(item.permissions) && t(`${item?.permissions[0]}`)}
                            </Text>
                          </Box>
                        </Box>
                      );
                    }
                  })}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </TabPanel>
      {isTeacher && isAssetWithInstuctions && (
        <TabPanel label={detailLabels?.instructions} key="tab3">
          <Box className={classes.tabPanel}>
            <ContextContainer>
              {!!asset.providerData.instructionsForTeachers && (
                <ContextContainer title={tasksT('forTeacher')}>
                  <HtmlText>{asset.providerData.instructionsForTeachers}</HtmlText>
                </ContextContainer>
              )}
              {!!asset.providerData.instructionsForStudents && (
                <ContextContainer title={tasksT('forStudent')}>
                  <HtmlText>{asset.providerData.instructionsForStudents}</HtmlText>
                </ContextContainer>
              )}
            </ContextContainer>
            {!asset.providerData.instructionsForTeachers &&
              !asset.providerData.instructionsForStudents && (
                <Text>{detailLabels.emptyInstructions}</Text>
              )}
          </Box>
        </TabPanel>
      )}
    </Tabs>
  );
};

LibraryDetailContent.defaultProps = LIBRARY_DETAIL_CONTENT_DEFAULT_PROPS;
LibraryDetailContent.propTypes = LIBRARY_DETAIL_CONTENT_PROP_TYPES;

export default LibraryDetailContent;
export { LibraryDetailContent };
