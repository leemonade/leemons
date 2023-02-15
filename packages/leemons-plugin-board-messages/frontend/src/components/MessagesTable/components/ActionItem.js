import React from 'react';
import PropTypes from 'prop-types';
import { Box, ActionButton } from '@bubbles-ui/components';
import { EditWriteIcon, ArchiveIcon } from '@bubbles-ui/icons/solid';

const ActionItem = ({ labels, onEdit, onArchive, message }) => (
  <Box style={{ display: 'flex' }}>
    <ActionButton
      icon={<EditWriteIcon />}
      variant="transparent"
      tooltip={labels.edit}
      onClick={() => onEdit(message)}
    />

    <ActionButton
      icon={<ArchiveIcon />}
      variant="transparent"
      tooltip={labels.archive}
      onClick={() => onArchive(message)}
    />
  </Box>
);

ActionItem.propTypes = {
  labels: PropTypes.object,
  onEdit: PropTypes.func,
  onArchive: PropTypes.func,
  message: PropTypes.object,
};

// eslint-disable-next-line import/prefer-default-export
export { ActionItem };
