import React from 'react';
import { Box, Text } from '@bubbles-ui/components';
import {
  ExpandIcon,
  ControlsPlayIcon,
  ControlsPauseIcon,
  VolumeControlLowIcon,
  VolumeControlOffIcon,
} from '@bubbles-ui/icons/solid';
import { ShrinkIcon } from '@bubbles-ui/icons/outline';
import { ProgressBarStyles } from './ProgressBar.styles';
import { PROGRESS_BAR_DEFAULT_PROPS, PROGRESS_BAR_PROP_TYPES } from './ProgressBar.constants';

const ProgressBar = ({
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
}) => {
  // ··································································
  // HANDLERS

  const handleVolumeChange = () => {
    if (mediaVolume <= 1 && mediaVolume !== 0) {
      setMediaVolume(0);
      return;
    }
    if (mediaVolume === 0) setMediaVolume(1);
  };

  const handleFullscreenChange = () => {
    setFullScreenMode(!fullScreenMode);
  };

  // ··································································
  // COMPONENT

  const { classes } = ProgressBarStyles({}, { name: 'ProgressBar' });
  return (
    <Box className={classes.progressBarWrapper}>
      <Box className={classes.controlBar}>
        <Box onClick={() => setIsPlaying(!isPlaying)} className={classes.iconWrapper}>
          {isPlaying ? (
            <ControlsPauseIcon height={20} width={20} className={classes.whiteIcon} />
          ) : (
            <ControlsPlayIcon
              height={18}
              width={18}
              className={classes.whiteIcon}
              style={{ marginLeft: 2 }}
            />
          )}
        </Box>
        <Box className={classes.iconWrapper} onClick={handleVolumeChange}>
          {mediaVolume > 0 ? (
            <VolumeControlLowIcon height={20} width={20} className={classes.whiteIcon} />
          ) : (
            <VolumeControlOffIcon height={20} width={20} className={classes.whiteIcon} />
          )}
        </Box>
        <Text size={'xs'} role={'productive'} className={classes.duration}>
          {getDuration()} / {getTotalDuration()}
        </Text>
        <Box
          className={classes.iconWrapper}
          style={{ flex: 1, justifyContent: 'right', marginRight: 2 }}
          onClick={handleFullscreenChange}
        >
          <Box className={classes.progressBar}>
            <Box
              className={classes.progressBarValue}
              style={{
                width: `${playedPercentage}%`,
              }}
            />
            <input
              className={classes.progressBarSeekSlider}
              type={'range'}
              min={0}
              max={0.999999}
              step={'any'}
              value={seekValue}
              onChange={handleSeekChange}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
            />
          </Box>
          {fullScreenMode ? (
            <ShrinkIcon height={20} width={20} className={classes.whiteIcon} />
          ) : (
            <ExpandIcon height={20} width={20} className={classes.whiteIcon} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

ProgressBar.defaultProps = PROGRESS_BAR_DEFAULT_PROPS;
ProgressBar.propTypes = PROGRESS_BAR_PROP_TYPES;

export { ProgressBar };
