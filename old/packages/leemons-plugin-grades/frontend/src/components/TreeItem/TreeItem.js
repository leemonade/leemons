import React from 'react';
import PropTypes from 'prop-types';
import { ActionButton, Box, Stack, Text, UnstyledButton } from '@bubbles-ui/components';
import { FolderIcon } from '@bubbles-ui/icons/outline';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';

import { TreeItemStyles } from './TreeItem.styles';

const TreeItem = ({ node, isSelected, onSelect, onDelete }) => {
  const { classes } = TreeItemStyles({ isSelected }, { name: 'TreeItem' });

  return (
    <UnstyledButton className={classes.root} onClick={onSelect}>
      <Stack fullWidth spacing={2} alignItems="center">
        <Box>
          <FolderIcon className={classes.icon} />
        </Box>
        <Box>
          <Stack spacing={2}>
            <Text strong className={classes.label}>
              {node.text}
            </Text>
          </Stack>
        </Box>
        <Box style={{ marginLeft: 'auto' }}>
          <ActionButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(node);
            }}
            icon={<DeleteBinIcon />}
          />
        </Box>
      </Stack>
    </UnstyledButton>
  );
};

TreeItem.propTypes = {
  node: PropTypes.object,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeItem };
