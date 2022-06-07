import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  FileIcon,
  ImageLoader,
  createStyles,
  Text,
  COLORS,
} from '@bubbles-ui/components';
import { prepareAsset } from '../helpers/prepareAsset';

const AssetThumbnailStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderStyle: 'solid',
    borderColor: selected ? theme.colors.interactive01d : theme.colors.ui02,
    borderWidth: 1,
    boxShadow: selected && theme.shadows.shadow03,
    width: '100%',
    '&:hover': {
      boxShadow: theme.shadows.shadow03,
    },
  },
  fileIcon: {
    height: 170,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.interactive03h,
    padding: theme.spacing[3],
    borderRadius: 4,
  },
}));

const AssetThumbnail = ({ key, item, selected, headers, className, ...props }) => {
  const asset = prepareAsset(item.original || item);
  const { classes, cx } = AssetThumbnailStyles({ selected });

  return (
    <Box key={key} {...props}>
      <Box className={cx(classes.root, { [classes.fileIcon]: !asset.cover })}>
        {asset.cover ? (
          <ImageLoader src={asset.cover} height={170} />
        ) : (
          <Stack direction="column" spacing={2}>
            <FileIcon
              size={32}
              fileExtension={asset.fileExtension}
              fileType={asset.fileType}
              color={'#B9BEC4'}
              iconStyle={{ backgroundColor: COLORS.interactive03h }}
              hideExtension
            />
            <Box>
              <Text color="soft">{asset.name}</Text>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

AssetThumbnail.propTypes = {
  key: PropTypes.string,
  item: PropTypes.any,
  headers: PropTypes.any,
  selected: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export { AssetThumbnail };
export default AssetThumbnail;
