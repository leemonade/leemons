import React from 'react';
import ReactPlayer from 'react-player';
import { Box, ImageLoader } from '@bubbles-ui/components';
import {
  AUDIO_CARD_PLAYER_DEFAULT_PROPS,
  AUDIO_CARD_PLAYER_PROP_TYPES,
} from './AudioCardPlayer.constants';
import { AudioCardPlayerStyles } from './AudioCardPlayer.styles';
import { AudioProgressBar } from '../AudioProgressBar';

const AudioCardPlayer = ({
  url,
  loop,
  cover,
  title,
  muted,
  onPlay,
  onReady,
  onStart,
  onPause,
  onEnded,
  onError,
  seconds,
  subtitle,
  seekValue,
  isPlaying,
  playerRef,
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
}) => {
  // ··································································
  // COMPONENT

  const { classes } = AudioCardPlayerStyles({}, { name: 'AudioProgressBar' });
  return (
    <Box className={classes.audioCardRoot}>
      <Box className={classes.audioCardCover}>
        {cover && <ImageLoader height="100%" src={cover} alt={title} />}
      </Box>
      <AudioProgressBar
        {...{
          title,
          subtitle,
          seconds,
          playerRef,
          seekValue,
          isPlaying,
          getDuration,
          setIsPlaying,
          getTotalDuration,
          playedPercentage,
          handleSeekChange,
          handleSeekMouseUp,
          handleSeekMouseDown,
        }}
      />
      <ReactPlayer
        url={url}
        width="0"
        height="0"
        progressInterval={progressInterval}
        muted={muted}
        volume={mediaVolume}
        loop={loop}
        controls={nativeControls}
        playing={isPlaying}
        className={classes.reactPlayer}
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
    </Box>
  );
};

AudioCardPlayer.defaultProps = AUDIO_CARD_PLAYER_DEFAULT_PROPS;
AudioCardPlayer.propTypes = AUDIO_CARD_PLAYER_PROP_TYPES;

export { AudioCardPlayer };
