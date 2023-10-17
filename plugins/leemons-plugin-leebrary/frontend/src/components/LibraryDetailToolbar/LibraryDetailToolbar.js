import React from 'react';
import { isFunction } from 'lodash';
import { ActionButton, Box, Stack } from '@bubbles-ui/components';
import {
  DeleteBinIcon,
  EditWriteIcon,
  PluginKimIcon as PluginKimSolidIcon,
} from '@bubbles-ui/icons/solid';
import {
  DownloadIcon,
  DuplicateIcon,
  PluginKimIcon,
  ViewOnIcon,
  ShareSocialIcon,
} from '@bubbles-ui/icons/outline';
import { LibraryDetailToolbarStyles } from './LibraryDetailToolbar.styles';
import {
  LIBRARY_DETAIL_TOOLBAR_DEFAULT_PROPS,
  LIBRARY_DETAIL_TOOLBAR_PROP_TYPES,
} from './LibraryDetailToolbar.constants';

const AssignIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.4722 4.04346H12.3889C12.551 4.04346 12.7064 4.10759 12.821 4.22174C12.9356 4.33589 13 4.49072 13 4.65215V11.363C13 12.3276 12.6153 13.2527 11.9305 13.9348C11.2458 14.6168 10.317 15 9.34861 15H2.61111C2.44903 15 2.2936 14.9359 2.17899 14.8217C2.06438 14.7076 2 14.5527 2 14.3913V4.65215C2 4.49072 2.06438 4.33589 2.17899 4.22174C2.2936 4.10759 2.44903 4.04346 2.61111 4.04346H8.11111"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7.5 6.47848L11.4349 2.55908"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.0837 2.82609C12.5899 2.82609 13.0003 2.41731 13.0003 1.91304C13.0003 1.40878 12.5899 1 12.0837 1C11.5774 1 11.167 1.40878 11.167 1.91304C11.167 2.41731 11.5774 2.82609 12.0837 2.82609Z"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.94434 14.9513V12.5652C9.94434 12.4038 10.0087 12.249 10.1233 12.1348C10.2379 12.0207 10.3934 11.9565 10.5554 11.9565H12.951"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3.83301 8.3042H10.5552"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3.83301 10.1304H10.5552"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3.83301 11.9565H7.19412"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

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
  toolbarItems,
  ...props
}) => {
  const { classes, cx } = LibraryDetailToolbarStyles({}, { name: 'LibraryDetailToolbar' });

  const handleView = () => {
    isFunction(onView) && onView(item);
  };

  const handleEdit = () => {
    isFunction(onEdit) && onEdit(item);
  };

  const handleDuplicate = () => {
    isFunction(onDuplicate) && onDuplicate(item);
  };

  const handleDownload = () => {
    isFunction(onDownload) && onDownload(item);
  };

  const handleDelete = () => {
    isFunction(onDelete) && onDelete(item);
  };

  const handleShare = () => {
    isFunction(onShare) && onShare(item);
  };

  const handleAssign = () => {
    isFunction(onAssign) && onAssign(item);
  };

  const handlePin = () => {
    isFunction(onPin) && onPin(item);
  };

  const handleUnpin = () => {
    isFunction(onUnpin) && onUnpin(item);
  };
  return (
    <Box className={classes.root}>
      <Stack>
        {toolbarItems.view && (
          <ActionButton
            icon={<ViewOnIcon height={20} width={20} />}
            onClick={handleView}
            tooltip={toolbarItems.view}
            className={classes.button}
          />
        )}
        {toolbarItems.edit && (
          <ActionButton
            icon={<EditWriteIcon height={20} width={20} />}
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
        {toolbarItems.download && (
          <ActionButton
            icon={<DownloadIcon height={20} width={20} />}
            onClick={handleDownload}
            tooltip={toolbarItems.download}
            className={classes.button}
          />
        )}
        {toolbarItems.assign && (
          <ActionButton
            icon={<AssignIcon height={20} width={20} />}
            onClick={handleAssign}
            tooltip={toolbarItems.assign}
            className={classes.button}
          />
        )}
        {toolbarItems.delete && (
          <ActionButton
            icon={<DeleteBinIcon height={20} width={20} />}
            onClick={handleDelete}
            tooltip={toolbarItems.delete}
            className={classes.button}
          />
        )}
        {toolbarItems.share && (
          <ActionButton
            icon={<ShareSocialIcon height={20} width={20} />}
            onClick={handleShare}
            tooltip={toolbarItems.share}
            className={classes.button}
          />
        )}
        {toolbarItems.pin && (
          <ActionButton
            icon={<PluginKimIcon height={20} width={20} />}
            onClick={handlePin}
            tooltip={toolbarItems.pin}
            className={classes.button}
          />
        )}
        {toolbarItems.unpin && (
          <ActionButton
            icon={<PluginKimSolidIcon height={20} width={20} />}
            active
            variant="solid"
            onClick={handleUnpin}
            tooltip={toolbarItems.unpin}
            className={classes.button}
          />
        )}
      </Stack>
    </Box>
  );
};

LibraryDetailToolbar.defaultProps = LIBRARY_DETAIL_TOOLBAR_DEFAULT_PROPS;
LibraryDetailToolbar.propTypes = LIBRARY_DETAIL_TOOLBAR_PROP_TYPES;

export { LibraryDetailToolbar };
