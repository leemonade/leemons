import React from 'react';
import PropTypes from 'prop-types';
import { Box, ActionButton } from '@bubbles-ui/components';
import { EditWriteIcon, ArchiveIcon } from '@bubbles-ui/icons/solid';

const ActionItem = ({ labels, status, onEdit, onArchive, message, isOwner }) => (
  <Box style={{ display: 'flex', gap: 4 }}>
    <ActionButton
      icon={<EditWriteIcon />}
      variant="transparent"
      tooltip={labels.edit}
      onClick={() => onEdit(message)}
      disabled={!isOwner}
    />
    <ActionButton
      icon={<ArchiveIcon />}
      variant="transparent"
      tooltip={status === 'archived' ? labels.unarchive : labels.archive}
      onClick={() => onArchive(message)}
      disabled={status !== 'unpublished' && status !== 'completed' && status !== 'archived'}
    />
  </Box>
);

ActionItem.propTypes = {
  labels: PropTypes.object,
  status: PropTypes.string,
  onEdit: PropTypes.func,
  onArchive: PropTypes.func,
  message: PropTypes.object,
  isOwner: PropTypes.bool,
};

// eslint-disable-next-line import/prefer-default-export
export { ActionItem };
