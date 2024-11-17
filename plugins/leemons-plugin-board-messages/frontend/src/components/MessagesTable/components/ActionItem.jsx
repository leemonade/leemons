import React from 'react';
import PropTypes from 'prop-types';
import { Stack, ActionButton } from '@bubbles-ui/components';
import { EditWriteIcon, ArchiveIcon } from '@bubbles-ui/icons/solid';

const ActionItem = ({ labels, status, onEdit, onArchive, message, isOwner }) => (
  <Stack spacing={2}>
    <ActionButton
      icon={<EditWriteIcon width={18} height={18} />}
      tooltip={labels.edit}
      onClick={() => onEdit(message)}
      disabled={!isOwner}
    />
    <ActionButton
      icon={<ArchiveIcon width={18} height={18} />}
      tooltip={status === 'archived' ? labels.unarchive : labels.archive}
      onClick={() => onArchive(message)}
      disabled={status !== 'unpublished' && status !== 'completed' && status !== 'archived'}
    />
  </Stack>
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
