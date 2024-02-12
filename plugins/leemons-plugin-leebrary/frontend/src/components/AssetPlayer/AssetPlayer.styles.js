import { createStyles, pxToRem } from '@bubbles-ui/components';

const getFramedProps = (framed, theme) => {
  if (framed) {
    return {
      borderRadius: 8,
      border: `2px solid ${theme.colors.ui02}`,
      overflow: 'hidden',
    };
  }
  return {};
};

const getUseMediaRatio = (useAspectRatio, media, useAudioCard) =>
  useAspectRatio &&
  !media.isURL &&
  !media.isImage &&
  !media.isPDF &&
  !(media.isAudio && useAudioCard);

const AssetPlayerStyles = createStyles(
  (
    theme,
    {
      width,
      height,
      media,
      styles,
      framed,
      viewPDF,
      mediaRatio,
      useAspectRatio,
      showPlayer,
      canPlay,
      useAudioCard,
      ccMode,
    }
  ) => {
    const framedProps = !media.isPDF ? getFramedProps(framed, theme) : {};
    const useMediaRatio = getUseMediaRatio(useAspectRatio, media, useAudioCard);
    const paddingBottom = useMediaRatio && `${mediaRatio * 100}%`; // 16/9 aspect ratio
    // console.log('paddingBottom:', paddingBottom);
    return {
      rootWrapper: {
        width,
        height: media.isPDF && viewPDF ? '100%' : !useAspectRatio && height,
        overflow: 'hidden',
      },
      root: {
        position: 'relative',
        height: (media.isPDF && viewPDF) || !useAspectRatio ? '100%' : useMediaRatio && 0,
        width: '100%',
        paddingBottom,
        ...styles,
        ...framedProps,
      },
      coverWrapper: {
        position: useAspectRatio ? 'relative' : 'absolute',
        cursor: canPlay && 'pointer',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        pointerEvents: showPlayer && 'none',
        userSelect: 'none',
        height: '100%',
      },
      reactPlayer: {
        backgroundColor: 'black',
      },
      buttonIcon: {
        position: 'absolute',
        zIndex: 10,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: ccMode && !canPlay ? 'auto' : 'none',
      },
      coverShadow: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 1000,
        background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))',
        display: canPlay ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: showPlayer ? 0 : 1,
        transition: 'opacity 200ms',
      },
      pdfCover: {
        background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(.jpg)',
        position: 'relative',
      },
      pdfDownloadIcon: {
        position: 'absolute',
        height: 24,
        width: 24,
        bottom: 10,
        right: 16,
        color: theme.other.global.content.color.icon['default--reverse'],
        cursor: 'pointer',
        '&:active': {
          transform: 'translateY(2px)',
        },
      },
      pdfContainer: {
        display: 'grid',
        overflow: 'hidden',
      },
      playIcon: {
        color: 'white',
      },
      playerWrapper: {
        position: 'absolute',
        height: '100%',
        width: '100%',
      },
      // ICONS ··································································
      audioIcon: {
        position: 'absolute',
        bottom: 30,
        left: 10,
      },
      fileIcon: {
        height: '100%',
        width: '100%',
        display: 'flex',
        position: 'absolute',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: theme.colors.interactive03h,
        padding: pxToRem(16),
        borderRadius: '4px 2px 0 0',
      },
      expandIcon: {
        backgroundColor: 'transparent',
      },
    };
  }
);

export { AssetPlayerStyles };
