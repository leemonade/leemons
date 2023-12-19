import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import {
  ActionButton,
  Badge,
  Box,
  ImageLoader,
  Paper,
  Stack,
  Text,
  useClipboard,
  Tabs,
  TabPanel,
} from '@bubbles-ui/components';
import { DuplicateIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { getDomain, LibraryCardContent } from '../LibraryCardContent';
import { LibraryCardFooter } from '../LibraryCardFooter';
import { LibraryDetailContentStyles } from './LibraryDetailContent.styles';
import {
  LIBRARY_DETAIL_CONTENT_DEFAULT_PROPS,
  LIBRARY_DETAIL_CONTENT_PROP_TYPES,
} from './LibraryDetailContent.constants';
import prefixPN from '../../helpers/prefixPN';

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
  onCopy = () => {},
  ...props
}) => {
  const { classes } = LibraryDetailContentStyles({}, { name: 'LibraryDetailContent' });
  const clipboard = useClipboard({ timeout: 2000 });
  const [, translations] = useTranslateLoader(prefixPN('list'));
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

  return (
    <Box className={classes.root}>
      <Tabs
        panelColor="default"
        fullHeight
        fullWidth
        centerGrow
        className={classes.tab}
        // onTabClick={() => setCurrentAsset(null)}
        onTabClick={() => console.log('onTabClick')}
      >
        <TabPanel label={detailLabels?.detail}>
          <Box className={classes.tabPanel}>
            <Text className={classes.title}>{name}</Text>
          </Box>
        </TabPanel>
        <TabPanel label={detailLabels?.permissions}>
          <Box className={classes.tabPane}>hello 2</Box>
        </TabPanel>
        <TabPanel label={detailLabels?.instructions}>
          <Box className={classes.tabPane}>hello 2</Box>
        </TabPanel>
      </Tabs>
      <LibraryCardContent description={description} truncated={false} />
      <LibraryCardFooter
        variantIcon={variantIcon}
        variantTitle={variantTitle}
        variant={variant}
        fileType={fileType}
        fileExtension={fileExtension}
      />
      {variant === 'bookmark' && (
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
      )}
      <Stack direction="column" className={classes.lowerContent}>
        {!isEmpty(metadata) && (
          <LibraryCardContent
            metadata={metadata.filter(
              (item) =>
                !excludeMetadatas.map((e) => e.toLowerCase()).includes(item.label.toLowerCase())
            )}
          />
        )}
        {tags?.length > 0 && (
          <Box className={classes.tags}>
            <Box className={classes.tagsContainer}>
              {tags.map((tag, index) => (
                <Box key={`${tag} ${index}`}>
                  <Badge
                    label={tag}
                    size="md"
                    closable={false}
                    radius={'default'}
                    color={'stroke'}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

LibraryDetailContent.defaultProps = LIBRARY_DETAIL_CONTENT_DEFAULT_PROPS;
LibraryDetailContent.propTypes = LIBRARY_DETAIL_CONTENT_PROP_TYPES;

export default LibraryDetailContent;
export { LibraryDetailContent };
