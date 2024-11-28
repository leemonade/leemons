import { Box, FileIcon, Text } from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/outline';

import {
  LIBRARY_CARD_CC_FOOTER_PROPTYPES,
  LIBRARY_CARD_CC_FOOTER_DEFAULTPROPS,
} from './LibraryCardCCFooter.constants';
import { LibraryCardCCFooterStyles } from './LibraryCardCCFooter.styles';

const LibraryCardCCFooter = ({ fileType, fileExtension, variant }) => {
  const { classes } = LibraryCardCCFooterStyles();
  const variantIconLabel = fileType?.charAt(0)?.toUpperCase() + fileType?.slice(1);

  return (
    <Box className={classes.root}>
      <Box className={classes.fileIconContainer}>
        {fileType !== 'file' && fileType !== 'application' ? (
          <FileIcon
            size={18}
            fileType={fileType === 'file' ? fileExtension : fileType || variant}
            fileExtension={fileExtension}
            color={'#878D96'}
            hideExtension
          />
        ) : (
          <DownloadIcon width={18} height={18} color={'#878D96'} />
        )}
        <Text className={classes.fileLabel}>
          {fileType === 'document' || fileType === 'file' || fileType === 'application'
            ? fileExtension?.toUpperCase()
            : variantIconLabel}
        </Text>
      </Box>
    </Box>
  );
};

LibraryCardCCFooter.propTypes = LIBRARY_CARD_CC_FOOTER_PROPTYPES;
LibraryCardCCFooter.defaultProps = LIBRARY_CARD_CC_FOOTER_DEFAULTPROPS;

export { LibraryCardCCFooter };
