import React, { useRef, memo } from 'react';
import {
  AssetAudioIcon,
  AssetVideoIcon,
  AssetImageIcon,
  AssetBookmarkIcon,
  Box,
} from '@bubbles-ui/components';
import { useHTMLToCanvas } from '../../hooks/useHTMLToCanvas';
import { LibraryCardEmptyCoverStyles } from './LibraryCardEmptyCover.styles';
import {
  LIBRARY_CARD_EMPTY_COVER_DEFAULT_PROPS,
  LIBRARY_CARD_EMPTY_COVER_PROP_TYPES,
} from './LibraryCardEmptyCover.constants';

const LibraryCardEmptyCover = memo(({ icon, fileType }) => {
  const pairColumnRef = useRef(null);

  const { canvasImage } = useHTMLToCanvas(pairColumnRef);

  const FileTypeIcon = [
    { key: 'video', value: <AssetVideoIcon height={24} width={24} color={'#878D96'} /> },
    { key: 'audio', value: <AssetAudioIcon height={24} width={24} color={'#878D96'} /> },
    { key: 'image', value: <AssetImageIcon height={24} width={24} color={'#878D96'} /> },
    { key: 'bookmark', value: <AssetBookmarkIcon height={24} width={24} color={'#878D96'} /> },
  ];

  const fileIcon = FileTypeIcon.find(({ key }) => key === fileType);

  const iconToShow = fileIcon?.value || icon;

  const { classes } = LibraryCardEmptyCoverStyles();

  const pairCol = (
    <Box style={{ opacity: 0 }}>
      <Box className={classes.mosaicItem} ref={pairColumnRef}>
        <Box className={classes.oddContainer}>
          <Box className={classes.evenIcon}>{iconToShow}</Box>
        </Box>
        <Box className={classes.evenContainer}>
          <Box className={classes.oddIcon}>{iconToShow}</Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box className={classes.emptyStateRoot}>
      {!canvasImage && <Box>{pairCol}</Box>}
      {canvasImage && (
        <Box
          className={classes.emptyStateWrapper}
          style={{ backgroundImage: `url(${canvasImage})` }}
        ></Box>
      )}
    </Box>
  );
});

LibraryCardEmptyCover.propTypes = LIBRARY_CARD_EMPTY_COVER_DEFAULT_PROPS;
LibraryCardEmptyCover.propTypes = LIBRARY_CARD_EMPTY_COVER_PROP_TYPES;

LibraryCardEmptyCover.displayName = 'LibraryCardEmptyCover';

export default LibraryCardEmptyCover;
export { LibraryCardEmptyCover };
