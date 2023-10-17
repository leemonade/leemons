import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Stack, UnstyledButton } from '@bubbles-ui/components';
import { FolderIcon } from '@bubbles-ui/icons/outline';
import { ProgramItemStyles } from '@academic-portfolio/components/ProgramItem/ProgramItem.styles';

const ProgramItem = ({ node, isSelected, onSelect }) => {
  const { program } = node;
  const { classes } = ProgramItemStyles({ isSelected }, { name: 'ProgramItem' });

  return (
    <UnstyledButton className={classes.root} onClick={onSelect}>
      <Stack spacing={2} alignItems="center">
        <Box>
          <FolderIcon className={classes.icon} />
        </Box>
        <Box>
          <Stack spacing={2}>
            <Text strong className={classes.label}>
              {program.name}
            </Text>
            <Text className={classes.label}>[{program.abbreviation}]</Text>
          </Stack>
        </Box>
      </Stack>
    </UnstyledButton>
  );
};

ProgramItem.propTypes = {
  node: PropTypes.object,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { ProgramItem };
