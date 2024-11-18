import { ActionButton, Box, Stack, Divider } from '@bubbles-ui/components';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import { PrintContentButton } from '@content-creator/components';
import { isFunction } from 'lodash';

import {
  LIBRARY_DETAIL_TOOLBAR_DEFAULT_PROPS,
  LIBRARY_DETAIL_TOOLBAR_PROP_TYPES,
} from './LibraryDetailToolbar.constants';
import { LibraryDetailToolbarStyles } from './LibraryDetailToolbar.styles';
import { AssignIcon } from './icons/AssignIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { DuplicateIcon } from './icons/DuplicateIcon';
import { EditIcon } from './icons/EditIcon';
import { LoveFullIcon } from './icons/LoveFullIcon';
import { LoveIcon } from './icons/LoveIcon';
import { ShareIcon } from './icons/ShareIcon';

const LibraryDetailToolbar = ({
  item,
  open,
  onView,
  onEdit,
  onDuplicate,
  onDownload,
  onDelete,
  onShare,
  onAssign,
  onToggle,
  onPin,
  onUnpin,
  onCloseDrawer,
  toolbarItems,
  variant,
  isEmbedded,
  ...props
}) => {
  const { classes } = LibraryDetailToolbarStyles({}, { name: 'LibraryDetailToolbar' });
  // const handleView = () => {
  //   if (isFunction(onView)) {
  //     onView(item);
  //   }
  // };

  const handleEdit = () => {
    if (isFunction(onEdit)) {
      onEdit(item);
    }
  };

  const handleDuplicate = () => {
    if (isFunction(onDuplicate)) {
      onDuplicate(item);
    }
  };

  const handleDownload = () => {
    if (isFunction(onDownload)) {
      onDownload(item);
    }
  };

  const handleDelete = () => {
    if (isFunction(onDelete)) {
      onDelete(item);
    }
  };

  const handleShare = () => {
    if (isFunction(onShare)) {
      onShare(item);
    }
  };

  const handleAssign = () => {
    if (isFunction(onAssign)) {
      onAssign(item);
    }
  };

  const handlePin = () => {
    if (isFunction(onPin)) {
      onPin(item);
    }
  };

  const handleUnpin = () => {
    if (isFunction(onUnpin)) {
      onUnpin(item);
    }
  };
  const canShowLoveIcon = toolbarItems.pin || toolbarItems.unpin;
  const canShowFirstSetOfIcons = toolbarItems.share || toolbarItems.assign || toolbarItems.download;
  const isEmbeddedVariant = variant === 'embedded' || isEmbedded;
  if (isEmbeddedVariant) {
    return (
      <Box className={classes.root} data-cypress-id="library-detail-toolbar">
        <Stack className={classes.buttons}>
          <Box className={classes.leftContainer}>
            {toolbarItems.download && (
              <ActionButton
                data-cypress-id="library-detail-toolbar-download"
                icon={<DownloadIcon height={20} width={20} />}
                onClick={handleDownload}
                tooltip={toolbarItems.download}
                className={classes.button}
              />
            )}
          </Box>
          <ActionButton icon={<RemoveIcon height={18} width={18} />} onClick={onCloseDrawer} />
        </Stack>
      </Box>
    );
  }
  return (
    <Box className={classes.root} data-cypress-id="library-detail-toolbar">
      <Stack className={classes.buttons}>
        <Box className={classes.leftContainer}>
          {toolbarItems.assign && (
            <ActionButton
              icon={<AssignIcon height={20} width={20} />}
              onClick={handleAssign}
              tooltip={toolbarItems.assign}
              className={classes.button}
            />
          )}
          {toolbarItems.share && (
            <ActionButton
              icon={<ShareIcon height={20} width={20} />}
              onClick={handleShare}
              tooltip={toolbarItems.share}
              className={classes.button}
            />
          )}
          {toolbarItems.printPDF && (
            <ActionButton
              icon={<PrintContentButton variant="icon" assetId={item.id} />}
              tooltip={toolbarItems.printPDF}
              className={classes.button}
            />
          )}
          {toolbarItems.download && (
            <ActionButton
              data-cypress-id="library-detail-toolbar-download"
              icon={<DownloadIcon height={20} width={20} />}
              onClick={handleDownload}
              tooltip={toolbarItems.download}
              className={classes.button}
            />
          )}
          {canShowFirstSetOfIcons && <Divider orientation="vertical" />}
          {toolbarItems.edit && (
            <ActionButton
              icon={<EditIcon height={20} width={20} />}
              onClick={handleEdit}
              tooltip={toolbarItems.edit}
              className={classes.button}
            />
          )}
          {toolbarItems.duplicate && (
            <ActionButton
              icon={<DuplicateIcon height={20} width={20} />}
              onClick={handleDuplicate}
              tooltip={toolbarItems.duplicate}
              className={classes.button}
            />
          )}
          {toolbarItems.delete && (
            <ActionButton
              icon={<DeleteIcon height={20} width={20} />}
              onClick={handleDelete}
              tooltip={toolbarItems.delete}
              className={classes.button}
            />
          )}
          {canShowLoveIcon && <Divider orientation="vertical" />}
          {toolbarItems.pin && (
            <ActionButton
              icon={<LoveIcon height={24} width={24} />}
              onClick={handlePin}
              tooltip={toolbarItems.pin}
              className={classes.button}
            />
          )}
          {toolbarItems.unpin && (
            <ActionButton
              icon={<LoveFullIcon height={20} width={20} active />}
              variant="solid"
              onClick={handleUnpin}
              tooltip={toolbarItems.unpin}
              className={classes.button}
            />
          )}
        </Box>
        {/*
        <Box className={classes.rightContainer}>
          <ActionButton icon={<SettingMenuVerticalIcon height={16} width={16} />} />
        </Box>
        */}
        <ActionButton icon={<RemoveIcon height={18} width={18} />} onClick={onCloseDrawer} />
      </Stack>
    </Box>
  );
};

LibraryDetailToolbar.defaultProps = LIBRARY_DETAIL_TOOLBAR_DEFAULT_PROPS;
LibraryDetailToolbar.propTypes = LIBRARY_DETAIL_TOOLBAR_PROP_TYPES;

export default LibraryDetailToolbar;
export { LibraryDetailToolbar };
