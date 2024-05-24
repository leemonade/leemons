import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Box } from '@bubbles-ui/components';
import { NodeViewWrapper } from '@bubbles-ui/editors';
import { LibraryCardEmbed, LibraryCard } from '@leebrary/components';
import { AssetPlayerWrapperCCreator } from './AssetPlayerWrapperCCreator';
import { LibraryCardCC } from '../LibraryCardCC';

export const LIBRARY_PLAYER_DISPLAYS = ['card', 'player'];
export const LIBRARY_PLAYER_ALIGNS = ['left', 'center', 'right'];

export const LIBRARY_PLAYER_DEFAULT_PROPS = {
  node: {
    attrs: {
      asset: null,
      width: '100%',
      display: 'card',
      align: 'left',
    },
  },
};

export const LIBRARY_PLAYER_PROP_TYPES = {
  node: PropTypes.shape({
    attrs: PropTypes.shape({
      asset: PropTypes.any,
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      display: PropTypes.oneOf(LIBRARY_PLAYER_DISPLAYS),
      align: PropTypes.oneOf(LIBRARY_PLAYER_ALIGNS),
      readOnly: PropTypes.bool,
      isFloating: PropTypes.bool,
    }),
  }),
};

const LibraryPlayer = ({
  node: {
    attrs: { asset, width, display, align, isFloating, readOnly },
  },
}) => {
  const selfRef = useRef({});
  const isWidthNum = /^\d+$/.test(width);
  const widthProp = isWidthNum ? `${width}px` : width;
  const viewMode = useMemo(() => window.location.href.includes('view'), []); // TODO: review readOnly and check the reason that it is not working on view mode

  const getDisplay = () => {
    if (display === 'embed') {
      return (
        <Box style={{ width: isFloating ? '100%' : widthProp }}>
          <LibraryCardEmbed
            asset={asset}
            variant={asset.fileType === 'bookmark' ? 'bookmark' : 'media'}
            canPlay={viewMode}
            handleClickCCreator={() =>
              window.open(
                asset.fileType === 'image' ? asset.cover : asset.url,
                '_blank',
                'noopener'
              )
            }
            ccMode
            hasActionButton
          />
        </Box>
      );
    }

    if (display === 'player') {
      return (
        <AssetPlayerWrapperCCreator
          asset={asset}
          width={isFloating ? '100%' : width}
          framed={!['image'].includes(asset.fileType)}
          canPlay={readOnly || viewMode}
          showPlayButton={readOnly}
          useAudioCard
        />
      );
    }

    if (display === 'card') {
      return (
        <Box style={{ width: isFloating ? '100%' : widthProp }}>
          <LibraryCardCC asset={asset} canPlay={viewMode} />
        </Box>
      );
    }

    return (
      <Box style={{ width: isFloating ? '100%' : widthProp, userSelect: 'none' }}>
        <LibraryCard asset={asset} shadow={false} />
      </Box>
    );
  };

  useEffect(() => {
    if (!selfRef.current || !selfRef.current.parentNode) return;
    const { parentNode } = selfRef.current;

    parentNode.style.maxWidth = isFloating ? width : '100%';
    parentNode.style.float = isFloating && (align === 'left' || 'right') ? align : 'none';
  }, [width, align, isFloating]);

  return (
    <NodeViewWrapper className="library-extension" data-drag-handle ref={selfRef}>
      {!asset || isEmpty(asset) ? (
        <div>No Asset found</div>
      ) : (
        <Box
          style={{
            display: !isFloating && 'flex',
            justifyContent: !isFloating && align,
            marginTop: !isFloating && 20,
            marginBottom: !isFloating && 20,
            marginLeft: ['left'].includes(align) ? 0 : 20,
            marginRight: ['right'].includes(align) ? 0 : 20,
          }}
        >
          {getDisplay()}
        </Box>
      )}
    </NodeViewWrapper>
  );
};

LibraryPlayer.propTypes = LIBRARY_PLAYER_PROP_TYPES;
LibraryPlayer.defaultProps = LIBRARY_PLAYER_DEFAULT_PROPS;

export { LibraryPlayer };
