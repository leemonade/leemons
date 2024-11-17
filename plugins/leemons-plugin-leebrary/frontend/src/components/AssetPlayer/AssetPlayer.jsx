import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  Box,
  ImageLoader,
  Text,
  ModalZoom,
  TextClamp,
  CardEmptyCover,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isFunction } from 'lodash';
import ReactPlayer from 'react-player/lazy';

import prefixPN from '../../helpers/prefixPN';
import Cover from '../Cover';

import { ASSET_PLAYER_DEFAULT_PROPS, ASSET_PLAYER_PROP_TYPES } from './AssetPlayer.constants';
import { AssetPlayerStyles } from './AssetPlayer.styles';
import { AudioCardPlayer } from './components/AudioCardPlayer';
import { ButtonIcon } from './components/ButtonIcon';
import { PDFPlayer } from './components/PDFPlayer';
import { ProgressBar } from './components/ProgressBar';

const format = (seconds) => {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = String(date.getUTCSeconds()).padStart(2, '0');
  if (hh) {
    return `${hh}:${String(mm).padStart(2, '0')}:${ss}`;
  }
  return `${mm}:${ss}`;
};

const AssetPlayer = ({
  asset,
  width,
  height,
  styles,
  className,
  framed,
  playing,
  muted,
  volume,
  loop,
  fullScreen,
  nativeControls,
  progressInterval,
  onReady,
  onStart,
  onPlay,
  onProgress,
  onPause,
  onEnded,
  onError,
  canPlay,
  hideURLInfo,
  useAudioCard,
  useSchema,
  viewPDF,
  useAspectRatio,
  showPlayButton,
  ccMode,
  execMode,
}) => {
  const {
    name,
    description,
    cover,
    url: _url,
    fileType: _fileType,
    fileExtension,
    mediaType,
    metadata,
  } = asset;
  let url = _url;
  let fileType = _fileType;

  if (!url && cover) {
    url = cover;
    if (!fileType) {
      fileType = 'image';
    }
  }
  const playerRef = useRef(null);
  const rootRef = useRef(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [playedPercentage, setPlayedPercentage] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(playing);
  const [fullScreenMode, setFullScreenMode] = useState(fullScreen);
  const [openImageZoom, setOpenImageZoom] = useState(false);
  const [mediaVolume, setMediaVolume] = useState(volume || 1);
  const [assetHeight, setAssetHeight] = useState(0);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [t] = useTranslateLoader(prefixPN('pdfPlayer'));
  const pdfLabels = {
    pageLabel: t('pageLabel'),
    paginatorLabel: t('paginatorLabel'),
    schemaLabel: t('schemaLabel'),
  };
  const media = useMemo(() => {
    let result = {
      isPlayable: fileType === 'video' || fileType === 'audio',
      isVideo: fileType === 'video',
      isAudio: fileType === 'audio',
      isImage: fileType === 'image',
      isPDF: fileExtension === 'pdf',
      // isAFrame3D: ['gltf', 'glb', 'obj'].includes(fileExtension?.toLowerCase()),
      isURL: ['bookmark', 'url', 'link'].includes(fileType),
      isFile: !['video', 'audio', 'image', 'url'].includes(fileType),
    };
    if (result.isURL && mediaType === 'video') {
      result = {
        ...result,
        isPlayable: true,
        isVideo: true,
        isURL: false,
      };
    }
    setShowPlayer(false);
    return result;
  }, [fileType, mediaType]);

  const mediaRatio = useMemo(() => {
    if (fileType !== 'video') return 9 / 16;

    let mediaDimensions = {};
    (metadata || []).reduce((prev, curr) => {
      let data = {};
      if (curr.label.toLowerCase() === 'height') {
        data = { ...prev, height: parseInt(curr.value) };
      }
      if (curr.label.toLowerCase() === 'width') {
        data = { ...prev, width: parseInt(curr.value) };
      }
      mediaDimensions = data;
      return data;
    }, mediaDimensions);

    const { width: mWidth, height: mHeight } = mediaDimensions;

    if (!mWidth || !mHeight) return 9 / 16;

    return mHeight / mWidth;
  }, [metadata, fileType]);

  const fullScreenRatio = window.innerHeight / window.innerWidth;

  // ··································································
  // METHODS

  const getDuration = () => <time dateTime={`P${Math.round(seconds)}S`}>{format(seconds)}</time>;

  const getTotalDuration = () => {
    const totalDuration = playerRef.current ? playerRef.current.getDuration() : 0;
    return <time dateTime={`P${Math.round(totalDuration)}S`}>{format(totalDuration)}</time>;
  };

  // ··································································
  // HANDLERS

  const openPdfHandler = () => {
    window.open(url, '_blank', 'noreferrer');
  };

  const onEventHandler = (event, eventInfo) => {
    if (isFunction(event) && eventInfo) event(eventInfo);
  };

  const handleOnProgress = (played, playedSeconds) => {
    const elapsedSeconds = Math.floor(playedSeconds);
    if (elapsedSeconds !== seconds) {
      setSeconds(elapsedSeconds);
    }
    setPlayedPercentage(played * 100);
    if (!seeking) setSeekValue(played);
    onEventHandler(onProgress, {
      duration: getDuration(),
      totalDuration: getTotalDuration(),
    });
  };

  const handleSeekChange = (e) => {
    e.stopPropagation();
    setSeekValue(e.target.value);
  };

  const handleSeekMouseDown = (e) => {
    e.stopPropagation();
    setSeeking(true);
  };

  const handleSeekMouseUp = (e) => {
    e.stopPropagation();
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(seekValue));
  };

  const handleInitPlay = () => {
    if (!canPlay && !ccMode) return;
    setShowPlayer(true);
    setIsPlaying(true);
  };

  const toggleOnSpaceBar = (event) => {
    if (event.code === 'Space') {
      setIsPlaying(!isPlaying);
    }
  };

  async function handleFullScreen() {
    if (fullScreenMode) {
      try {
        rootRef.current.requestFullscreen();
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  // ··································································
  // EFFECTS

  useEffect(() => {
    if (!rootRef.current) return;
    handleFullScreen();
  }, [fullScreenMode]);

  useEffect(() => {
    if (!rootRef.current) return null;
    rootRef.current.addEventListener('fullscreenchange', (e) => {
      const isFullScreen = !!document.fullscreenElement;
      setFullScreenMode(isFullScreen);
    });
    setAssetHeight(rootRef.current.clientHeight);

    return () => {
      if (rootRef.current) rootRef.current.removeEventListener('fullscreenchange');
    };
  }, [rootRef]);

  useEffect(() => setFullScreenMode(fullScreen), [fullScreen]);
  useEffect(() => setIsPlaying(playing), [playing]);
  useEffect(() => setMediaVolume(volume), [volume, media]);

  useEffect(() => {
    document.body.addEventListener('keydown', toggleOnSpaceBar);
    return () => {
      document.body.removeEventListener('keydown', toggleOnSpaceBar);
    };
  }, [isPlaying]);

  // ··································································
  // COMPONENT

  const { classes, cx } = AssetPlayerStyles(
    {
      width,
      media,
      height,
      styles,
      viewPDF,
      canPlay,
      mediaRatio: fullScreenMode ? fullScreenRatio : mediaRatio,
      showPlayer,
      useAudioCard,
      fullScreenMode,
      useAspectRatio,
      framed,
      ccMode,
    },
    { name: 'AssetPlayer' }
  );

  return (
    <Box className={classes.rootWrapper}>
      <Box className={classes.root} ref={rootRef}>
        {media.isPlayable ? (
          <>
            {media.isAudio && useAudioCard ? (
              <AudioCardPlayer
                {...{
                  url,
                  loop,
                  cover,
                  muted,
                  onPlay,
                  onReady,
                  onStart,
                  onPause,
                  onEnded,
                  onError,
                  seconds,
                  seekValue,
                  isPlaying,
                  playerRef,
                  title: name,
                  mediaVolume,
                  getDuration,
                  setIsPlaying,
                  onEventHandler,
                  nativeControls,
                  handleOnProgress,
                  progressInterval,
                  getTotalDuration,
                  playedPercentage,
                  handleSeekChange,
                  handleSeekMouseUp,
                  handleSeekMouseDown,
                  subtitle: description,
                }}
              />
            ) : (
              <Box
                className={classes.playerWrapper}
                onMouseEnter={() => setIsVideoHovered(true)}
                onMouseLeave={() => setIsVideoHovered(false)}
              >
                {!nativeControls && showPlayer && (
                  <ProgressBar
                    {...{
                      seekValue,
                      isPlaying,
                      mediaVolume,
                      getDuration,
                      setIsPlaying,
                      fullScreenMode,
                      setMediaVolume,
                      getTotalDuration,
                      playedPercentage,
                      handleSeekChange,
                      handleSeekMouseUp,
                      setFullScreenMode,
                      handleSeekMouseDown,
                      isVideoHovered,
                    }}
                  />
                )}
                {showPlayer && (
                  <ReactPlayer
                    url={url}
                    width="100%"
                    height="100%"
                    progressInterval={progressInterval}
                    muted={muted}
                    volume={mediaVolume}
                    loop={loop}
                    controls={nativeControls}
                    playing={isPlaying}
                    className={cx(classes.reactPlayer, className)}
                    ref={playerRef}
                    onProgress={({ played, playedSeconds }) => {
                      handleOnProgress(played, playedSeconds);
                    }}
                    onReady={(eventInfo) => onEventHandler(onReady, eventInfo)}
                    onStart={(eventInfo) => onEventHandler(onStart, eventInfo)}
                    onPlay={(eventInfo) => onEventHandler(onPlay, eventInfo)}
                    onPause={(eventInfo) => onEventHandler(onPause, eventInfo)}
                    onEnded={(eventInfo) => onEventHandler(onEnded, eventInfo)}
                    onError={(eventInfo) => onEventHandler(onError, eventInfo)}
                  />
                )}
                {(!showPlayer || media.isAudio) && (
                  <Box
                    className={classes.coverWrapper}
                    onClick={() => (!ccMode || canPlay) && handleInitPlay()}
                  >
                    {showPlayButton && (
                      <Box className={classes.buttonIcon}>
                        {isPlaying ? null : (
                          <ButtonIcon
                            fileType={'video'}
                            onClick={(e) => {
                              if (ccMode && !canPlay) handleInitPlay();
                            }}
                          />
                        )}
                      </Box>
                    )}
                    {cover ? (
                      <Cover
                        height={ccMode || execMode ? '100%' : '200px'}
                        alt={name}
                        asset={asset}
                        copyrightAlign={'right'}
                        imageStyles={{ aspectRatio: '16/9' }}
                      />
                    ) : (
                      <CardEmptyCover
                        fileType={asset?.fileType}
                        icon={asset?.fileIcon}
                        height={assetHeight}
                      />
                    )}
                  </Box>
                )}
              </Box>
            )}
          </>
        ) : (
          <>
            {media.isImage && !canPlay && (
              <Box className={classes.coverWrapper}>
                {showPlayButton && (
                  <Box className={classes.buttonIcon}>
                    <ButtonIcon
                      fileType={'image'}
                      onClick={() => {
                        if (ccMode && !canPlay) setOpenImageZoom(true);
                      }}
                    />
                  </Box>
                )}
                <ModalZoom
                  canPlay={!ccMode || canPlay}
                  opened={openImageZoom}
                  onClose={() => setOpenImageZoom(false)}
                >
                  <Cover height="100%" alt={name} asset={asset} copyrightAlign="right" />
                </ModalZoom>
              </Box>
            )}
            {media.isImage && canPlay && (
              <Box
                className={classes.coverWrapper}
                onClick={() => setOpenImageZoom(!openImageZoom)}
              >
                {showPlayButton && (
                  <Box className={classes.buttonIcon}>
                    <ButtonIcon fileType={'image'} />
                  </Box>
                )}
                {!execMode && (
                  <Cover height={'200px'} alt={name} asset={asset} copyrightAlign={'right'} />
                )}
                <ModalZoom
                  canPlay={!ccMode || canPlay}
                  opened={openImageZoom}
                  onClose={() => setOpenImageZoom(false)}
                >
                  <Cover height={'100%'} alt={name} asset={asset} copyrightAlign={'right'} />
                </ModalZoom>
              </Box>
            )}
            {media.isURL && (
              <a
                href={asset.url}
                target="_blank"
                rel="noreferrer nofollow"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  pointerEvents: !canPlay && 'none',
                }}
              >
                <Box className={classes.buttonIcon}>
                  <ButtonIcon fileType={'document'} />
                </Box>
                <Cover
                  height={ccMode || execMode ? '100%' : '200px'}
                  alt={name}
                  asset={asset}
                  copyrightAlign={'right'}
                />
                {!hideURLInfo && (
                  <Box style={{ padding: 8 }}>
                    {!!(asset.name || asset.title) && (
                      <Box mb={5}>
                        <Text role="productive" color="primary" strong>
                          {asset.name || asset.title}
                        </Text>
                      </Box>
                    )}
                    {!!(asset.tagline || asset.description) && (
                      <Box mb={5}>
                        <TextClamp lines={2} maxLines={2}>
                          <Text size="xs" role="productive">
                            {asset.tagline || asset.description}
                          </Text>
                        </TextClamp>
                      </Box>
                    )}

                    <Text truncated size="xs" role="productive" color="soft">
                      {asset.url}
                    </Text>
                  </Box>
                )}
              </a>
            )}
            {media.isPDF ? (
              <>
                {viewPDF ? (
                  <Box className={classes.pdfContainer}>
                    <PDFPlayer pdf={url} labels={pdfLabels} useSchema={useSchema} />
                  </Box>
                ) : (
                  <Box className={classes.pdfCover}>
                    <Box className={classes.buttonIcon} onClick={openPdfHandler}>
                      <ButtonIcon fileType={'document'} />
                    </Box>
                    <ImageLoader height="auto" src={cover} alt={name} />
                  </Box>
                )}
              </>
            ) : null}
            {!media.isImage && !media.isURL && !media.isPDF && !media.isAFrame3D && (
              <Box className={classes.buttonIcon}>
                <ButtonIcon fileType={'file'} />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

AssetPlayer.defaultProps = ASSET_PLAYER_DEFAULT_PROPS;
AssetPlayer.propTypes = ASSET_PLAYER_PROP_TYPES;

export { AssetPlayer };
