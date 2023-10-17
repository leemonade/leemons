import React from 'react';
import PropTypes from 'prop-types';
import { Box, FileIcon, Text, Stack } from '@bubbles-ui/components';
import { LibraryItemStyles } from './LibraryItem.styles';
import { LIBRARY_ITEM_DEFAULT_PROPS, LIBRARY_ITEM_PROP_TYPES } from './LibraryItem.constants';
import { LibraryItemCover } from './LibraryItemCover/LibraryItemCover';

const LibraryItem = ({ asset, size, label, ...props }) => {
  const { classes, cx } = LibraryItemStyles({}, { name: 'LibraryItem' });

  return (
    <Box className={classes.root}>
      <Stack spacing={4} alignItems="center" fullWidth>
        <LibraryItemCover
          color={asset.color}
          cover={asset.cover}
          size={size}
          fileIcon={
            <FileIcon fileExtension={asset.fileExtension} fileType={asset.fileType} hideExtension />
          }
        />
        <Text role="productive" color="primary" truncated>
          {label || asset.name}
        </Text>
      </Stack>
    </Box>
  );
};

LibraryItem.defaultProps = LIBRARY_ITEM_DEFAULT_PROPS;
LibraryItem.propTypes = LIBRARY_ITEM_PROP_TYPES;

export { LibraryItem };
