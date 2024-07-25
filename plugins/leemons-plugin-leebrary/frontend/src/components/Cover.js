import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, isString } from 'lodash';
import { Box, ImageLoader } from '@bubbles-ui/components';
import useFileCopyright from '@leebrary/request/hooks/queries/useFileCopyright';
import { isLRN as stringIsLRN } from '@leebrary/helpers/isLRN';
import CoverCopyright from './Copyright/CoverCopyright';

const Cover = ({
  height = 'auto',
  src,
  alt,
  asset = {},
  copyrightAlign,
  bottomOffset: copyrightBottomOffset,
  inlineStyles = {},
  hideCopyright,
  ...imageProps
}) => {
  const { cover: processedCover, file, fileType, url, coverId } = asset;
  const cover = useMemo(() => asset?.original?.cover || processedCover, [asset, processedCover]);

  // If needed get the copyright and external url (same function)
  const fileIdToFetchCopyrightData = useMemo(() => {
    if (!isString(cover)) return null;
    if (file?.copyright) return null;
    if (coverId?.length) return coverId;

    const isLRN = stringIsLRN(cover);

    if (isLRN) {
      return cover;
    }

    const isUrlToFile = cover.startsWith('http') && cover.includes('lrn');
    if (isUrlToFile) {
      let decodedCover = decodeURIComponent(cover.match(/lrn[^?]+/)[0]);
      decodedCover = decodedCover.replace(/\.[^/.]+$/, '');
      return decodedCover;
    }

    return null;
  }, [cover, coverId]);

  const { data: coverCopyrightDataFetched } = useFileCopyright({
    id: fileIdToFetchCopyrightData,
    enabled: !!fileIdToFetchCopyrightData,
  });

  // ·······················································
  // SOURCE

  const coverSource = useMemo(() => {
    if (src) return src;

    const fileIsAnImage = fileType === 'image';
    const urlLeadsToSourceFile = url && url.startsWith('http') && url.includes('unsplash');
    const hasCopyright = !isEmpty(file?.copyright);

    if (fileIsAnImage && urlLeadsToSourceFile && hasCopyright) {
      return url;
    }

    if (cover?.externalUrl) {
      return cover.externalUrl;
    }

    if (coverCopyrightDataFetched?.externalUrl) {
      return coverCopyrightDataFetched.externalUrl;
    }

    // No cover or cover does not come from external source
    return asset.cover;
  }, [cover, url, fileType, file, cover, coverCopyrightDataFetched]);

  // ·······················································
  // COPYRIGHT

  const getCoverCopyright = useCallback(() => {
    if (hideCopyright) return null;
    const fileIsAnImage = fileType === 'image';

    if (fileIsAnImage && !isEmpty(file)) {
      if (!file.copyright) return null; // It does not come form an external source
      const { author, authorProfileUrl, providerUrl, provider } = file.copyright;

      return (
        <CoverCopyright
          author={author}
          authorUrl={authorProfileUrl}
          source={provider}
          sourceUrl={providerUrl}
          align={copyrightAlign}
          bottomOffset={copyrightBottomOffset}
        />
      );
    }

    if (cover?.copyright) {
      const { author, authorProfileUrl, providerUrl, provider } = cover.copyright;
      return (
        <CoverCopyright
          author={author}
          authorUrl={authorProfileUrl}
          source={provider}
          sourceUrl={providerUrl}
          align={copyrightAlign}
          bottomOffset={copyrightBottomOffset}
        />
      );
    }

    if (coverCopyrightDataFetched?.copyright) {
      const { author, authorProfileUrl, providerUrl, provider } =
        coverCopyrightDataFetched.copyright;
      return (
        <CoverCopyright
          author={author}
          authorUrl={authorProfileUrl}
          source={provider}
          sourceUrl={providerUrl}
          align={copyrightAlign}
          bottomOffset={copyrightBottomOffset}
        />
      );
    }
    return null;
  }, [cover, file, coverCopyrightDataFetched, copyrightAlign, copyrightBottomOffset]);

  return (
    <Box sx={{ position: 'relative', ...inlineStyles }}>
      <ImageLoader {...imageProps} height={height} src={coverSource} alt={alt} />
      {getCoverCopyright()}
    </Box>
  );
};

Cover.propTypes = {
  height: PropTypes.string,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  asset: PropTypes.object,
  copyrightAlign: PropTypes.string,
  bottomOffset: PropTypes.number,
  inlineStyles: PropTypes.object,
  hideCopyright: PropTypes.bool,
  imageStyles: PropTypes.object,
};

export default Cover;
