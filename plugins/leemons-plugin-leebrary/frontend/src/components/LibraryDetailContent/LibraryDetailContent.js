import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty, isFunction } from 'lodash';
import {
  Button,
  Badge,
  Box,
  Stack,
  Text,
  TextClamp,
  useClipboard,
  Tabs,
  TabPanel,
  pxToRem,
  Avatar,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { SubjectItemDisplay } from '@academic-portfolio/components';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { LibraryDetailContentStyles } from './LibraryDetailContent.styles';
import {
  LIBRARY_DETAIL_CONTENT_DEFAULT_PROPS,
  LIBRARY_DETAIL_CONTENT_PROP_TYPES,
} from './LibraryDetailContent.constants';
import prefixPN from '../../helpers/prefixPN';
import { MetadataDisplay } from './components/MetadataDisplay';
import { EditIcon } from '../LibraryDetailToolbar/icons/EditIcon';

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
  onShare = () => {},
  onCopy = () => {},
  ...props
}) => {
  const isTeacher = useIsTeacher();
  const { classes } = LibraryDetailContentStyles({}, { name: 'LibraryDetailContent' });
  const clipboard = useClipboard({ timeout: 2000 });
  const [t, translations] = useTranslateLoader(prefixPN('list'));
  const [subjectsIds, setSubjectsIds] = useState([]);
  const [canAccessData, setCanAccessData] = useState([]);
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

  const handleShare = () => {
    if (isFunction(onShare)) {
      onShare(asset);
    }
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

  return (
    <Box className={classes.root}>
      <Tabs panelColor="default" fullHeight fullWidth centerGrow className={classes.tab}>
        <TabPanel label={detailLabels?.detail}>
          <Box className={classes.tabPanel}>
            {name && <Text className={classes.title}>{name}</Text>}
            {description && <Text className={classes.description}>{description}</Text>}
            <Box style={{ marginTop: 24, marginBottom: 24 }}>
              {Array.isArray(subjectsIds) &&
                subjectsIds.length > 0 &&
                subjectsIds?.map((subject, index) => (
                  <Box key={index} className={classes.subjectItem}>
                    <SubjectItemDisplay subjectsIds={[subject.subject]} programId={program} />
                  </Box>
                ))}
            </Box>
            <Stack
              direction="column"
              className={classes.lowerContent}
              styles={{ marginTop: !name || !description ? pxToRem(24) : 0 }}
            >
              {metadataComponent || (
                <MetadataDisplay
                  metadata={{
                    metadata,
                    icon,
                    fileType,
                    fileExtension,
                    variant,
                    variantIcon,
                    variantTitle,
                    file,
                  }}
                />
              )}
            </Stack>
            {tags?.length > 0 && (
              <Box className={classes.tags}>
                <Box className={classes.tagsContainer}>
                  {tags.map((tag, index) => (
                    <Box key={`${tag} ${index}`}>
                      <Badge
                        label={tag}
                        size="md"
                        closable={false}
                        className={classes.labelBadge}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </TabPanel>
        <TabPanel label={detailLabels?.permissions}>
          <Box className={classes.tabPanel}>
            <Box>
              <Text
                className={classes.title}
              >{`${detailLabels?.permissions} (${canAccess?.length})`}</Text>
              <Box>
                {canAccessData?.length > 0 && (
                  <Box className={classes.canAccessContainer}>
                    {canAccessData.map((user, index) => (
                      <Box key={index} className={classes.canAccessItem}>
                        <Box className={classes.avatarWrapper}>
                          <Avatar alt={user?.name} name={user?.name} image={user?.avatar} />
                          <TextClamp lines={1}>
                            <Text className={classes.canAccessText}> {user?.name}</Text>
                          </TextClamp>
                        </Box>
                        <Box>
                          {Array.isArray(user.permissions) &&
                            user?.permissions.map((permission) => t(`${permission}`))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
            <Box className={classes.canAccessFooter}>
              <Button
                variant="outline"
                size="md"
                label={'Editar Permisos'}
                className={classes.canAccessButton}
                leftIcon={<EditIcon width={18} height={18} />}
                onClick={handleShare}
              >
                {'Editar Permisos'}
              </Button>
            </Box>
          </Box>
        </TabPanel>
        {isTeacher && (
          <TabPanel label={detailLabels?.instructions}>
            <Box className={classes.tabPanel}>hello 2</Box>
          </TabPanel>
        )}
      </Tabs>
      {/* {variant === 'bookmark' && (
        <Box
          sx={(theme) => ({ padding: theme.spacing[2], backgroundColor: theme.colors.mainWhite })}
        >
          <Paper bordered padding={2} radius="sm" shadow="none" fullWidth>
            <Stack fullWidth spacing={2}>
              <Box skipFlex>
                <ImageLoader src={icon} height={20} width={20} radius={4} />
              </Box>
              <Box>
                <Stack direction="column" display="grid">
                  <Text size="xs" strong>
                    {getDomain(url)}
                  </Text>
                  <Text size="xs" role="productive" truncated>
                    {url}
                  </Text>
                </Stack>
              </Box>
              <Box skipFlex>
                <ActionButton
                  icon={<DuplicateIcon height={16} width={16} onClick={handleCopy} />}
                  tooltip={
                    clipboard.copied
                      ? props.labels?.copied || 'Copied'
                      : props.labels?.copy || 'Copy'
                  }
                />
              </Box>
            </Stack>
          </Paper>
        </Box>
      )} */}
    </Box>
  );
};

LibraryDetailContent.defaultProps = LIBRARY_DETAIL_CONTENT_DEFAULT_PROPS;
LibraryDetailContent.propTypes = LIBRARY_DETAIL_CONTENT_PROP_TYPES;

export default LibraryDetailContent;
export { LibraryDetailContent };
