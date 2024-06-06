import React from 'react';
import { Box } from '@bubbles-ui/components';
import { LibraryCardSkeleton } from '../LibraryCardSkeleton';
import { LibraryCardCCStyles } from './LibraryCardCC.styles';
import LibraryCardCCCover from './components/LibraryCardCCCover/LibraryCardCCCover';
import { LibraryCardCCBody } from './components/LibraryCardCCBody/LibraryCardCCBody';
import { LibraryCardCCFooter } from './components/LibraryCardCCFooter/LibraryCardCCFooter';
import { LIBRARY_CARD_CC_PROPTYPES, LIBRARY_CARD_CC_DEFAULTPROPS } from './LibraryCardCC.constants';

const LibraryCardCC = ({ asset, canPlay }) => {
  const isPDF = asset?.fileExtension === 'pdf';
  const { classes } = LibraryCardCCStyles({ canPlay });
  function handleOpenAsset() {
    if (!canPlay) return;
    const url = isPDF ? `/protected/leebrary/play/${asset.id}` : asset?.url;
    const windowFeatures = isPDF ? '_blank,noopener,noreferrer' : '_blank';
    window.open(url, windowFeatures);
  }
  if (!asset) return <LibraryCardSkeleton />;
  return (
    <Box
      data-cypress-id={`libraryCardCC-${asset.id}`}
      className={classes.root}
      onClick={handleOpenAsset}
    >
      <LibraryCardCCCover {...asset} />
      <LibraryCardCCBody {...asset} />
      <LibraryCardCCFooter {...asset} />
    </Box>
  );
};

LibraryCardCC.propTypes = LIBRARY_CARD_CC_PROPTYPES;
LibraryCardCC.defaultProps = LIBRARY_CARD_CC_DEFAULTPROPS;

export { LibraryCardCC };
