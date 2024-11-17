import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  ActionButton,
  ImageLoader,
  Stack,
  Text,
  CardEmptyCover,
  TextClamp,
  Badge,
} from '@bubbles-ui/components';
import { SortDragIcon, DeleteBinIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';
import { isEmpty } from 'lodash';
import { AttachmentsStyles } from './Attachments.styles';

const AttachmentItem = React.forwardRef(
  ({ provided, item, removeItem, classes, useAria, removeLabel }, ref) => {
    const { classes: styles } = AttachmentsStyles();
    const [, translations] = useTranslateLoader(prefixPN('task_setup_page'));

    const getAssetBadgeType = () => {
      const typeMappings = {
        image: 'Image',
        bookmark: ['video'].includes(item.mediaType) ? 'Video' : 'Bookmark',
        'content-creator': 'Content creator',
        file: item?.fileExtension === 'pdf' ? 'PDF' : 'File',
        video: 'Video',
        audio: 'Audio',
        document: item?.fileExtension === 'pdf' ? 'PDF' : 'Document',
      };

      return typeMappings[item.fileType] || 'Media';
    };

    const badgeCategory = getAssetBadgeType();
    if (isEmpty(translations?.items)) return null;
    return (
      <Box
        ref={(e) => {
          provided.innerRef(e);
          if (ref) ref(e);
        }}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={styles.root}
      >
        <Stack fullWidth fullHeight alignItems="center" justifyContent="center">
          <Box className={styles.dragIcon}>
            <SortDragIcon className={classes.sortableIcon} />
          </Box>
          <Box id="box-image" className={styles.image}>
            {item.cover ? (
              <ImageLoader src={item.cover || null} alt={item.name} />
            ) : (
              <CardEmptyCover icon={''} fileType={item.fileType} height={48} />
            )}
          </Box>
          <Stack direction="column" fullHeight className={styles.bodyContainer}>
            <TextClamp lines={1}>
              <Text size="md" className={styles.title}>
                {item.name}
              </Text>
            </TextClamp>
            <Badge size="xs" label={badgeCategory} closable={false} radius={'default'} />
          </Stack>
          <Box className={styles.actionButton}>
            <ActionButton
              icon={<DeleteBinIcon width={24} height={24} color="#2F463F" />}
              onClick={removeItem}
              tooltip={removeLabel}
              useAria={useAria}
            />
          </Box>
        </Stack>
      </Box>
    );
  }
);
AttachmentItem.displayName = 'AttachmentItem';
AttachmentItem.propTypes = {
  item: PropTypes.object,
  removeItem: PropTypes.func,
  classes: PropTypes.object,
  useAria: PropTypes.bool,
  removeLabel: PropTypes.string,
  provided: PropTypes.object,
  ref: PropTypes.func,
};

export { AttachmentItem };
export default AttachmentItem;
