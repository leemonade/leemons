import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Box, Text, TextClamp, Loader } from '@bubbles-ui/components';
import { ControlsPlayIcon, ControlsPauseIcon } from '@bubbles-ui/icons/solid';
import { WaveSurfer, WaveForm } from 'wavesurfer-react';
import {
  AUDIO_PROGRESS_BAR_DEFAULT_PROPS,
  AUDIO_PROGRESS_BAR_PROP_TYPES,
} from './AudioProgressBar.constants';
import { AudioProgressBarStyles } from './AudioProgressBar.styles';

const Back15Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.85059 1.53617C8.81295 1.55019 8.7522 1.58248 8.71559 1.6079C8.67898 1.63331 8.28744 2.01686 7.84549 2.4602C7.29883 3.00859 7.02876 3.29218 7.0007 3.34727C6.9697 3.40811 6.95922 3.45963 6.95861 3.55427C6.95715 3.78093 6.94419 3.76477 7.87137 4.69193C8.78505 5.60563 8.78147 5.60269 8.99103 5.60413C9.13393 5.6051 9.22283 5.57227 9.32073 5.4824C9.42924 5.38279 9.48567 5.25889 9.48567 5.12027C9.48567 4.92895 9.44313 4.86692 9.01333 4.43181L8.63103 4.04477L9.06303 4.05489C9.78569 4.07181 10.3424 4.16046 10.953 4.35589C13.1976 5.07418 14.8837 6.99098 15.3066 9.30528C15.3838 9.72757 15.3975 9.90014 15.3979 10.4573C15.3984 11.0111 15.391 11.1122 15.317 11.5553C14.9878 13.528 13.6832 15.2881 11.8817 16.1897C10.882 16.6901 9.83553 16.9112 8.69772 16.8624C7.18172 16.7974 5.73531 16.1893 4.63663 15.155C3.80678 14.3737 3.24266 13.4894 2.8999 12.4326C2.70429 11.8295 2.61622 11.3082 2.59809 10.6463C2.5674 9.52561 2.78355 8.55626 3.28393 7.57058C3.61513 6.91813 3.96415 6.43599 4.47177 5.92965C4.83252 5.56979 5.19434 5.28109 5.59803 5.03099C5.84549 4.87767 5.91292 4.81847 5.96778 4.70635C6.00978 4.62051 6.01505 4.59095 6.00875 4.47704C6.0004 4.32581 5.96388 4.23854 5.87139 4.14871C5.78422 4.06403 5.69924 4.02607 5.57614 4.01678C5.41545 4.00467 5.36797 4.02157 5.10566 4.18427C4.28826 4.69121 3.57648 5.35195 3.02075 6.11973C2.02253 7.4988 1.54038 9.10936 1.62068 10.7964C1.6637 11.7004 1.83171 12.4616 2.17106 13.2902C2.85 14.9479 4.17817 16.3512 5.80191 17.1264C7.10551 17.7488 8.51934 17.975 9.9577 17.7912C12.0343 17.5259 13.9156 16.3687 15.106 14.6243C16.1298 13.1242 16.564 11.2974 16.326 9.49176C15.9316 6.49994 13.7286 4.02577 10.809 3.29569C10.2312 3.15118 9.80326 3.0963 9.14853 3.08273C8.86884 3.07693 8.64003 3.06718 8.64003 3.06107C8.64003 3.05495 8.81069 2.87992 9.01927 2.67211C9.22785 2.4643 9.41597 2.26187 9.43728 2.22227C9.49035 2.12372 9.49296 1.89437 9.44216 1.79202C9.39718 1.70135 9.30678 1.61157 9.21158 1.56301C9.11625 1.51437 8.94349 1.50152 8.85059 1.53617ZM6.78653 7.52457C6.66724 7.5787 6.59476 7.6404 6.53892 7.73539C6.49023 7.81822 6.48881 7.82857 6.48003 8.16228C6.47168 8.47938 6.46802 8.50912 6.42963 8.57088C6.34758 8.7028 6.29661 8.71905 5.93103 8.7298C5.65539 8.73792 5.5949 8.74486 5.52583 8.7764C5.22861 8.91203 5.14238 9.31363 5.36059 9.54581C5.50031 9.69447 5.65143 9.73026 6.06603 9.71281C6.21948 9.70637 6.37541 9.69388 6.41253 9.68508L6.48003 9.66907V11.061V12.453L6.03453 12.4586C5.61232 12.464 5.58505 12.4664 5.51301 12.5049C5.34522 12.5946 5.2539 12.734 5.24137 12.9195C5.22766 13.123 5.3409 13.3099 5.52612 13.3896C5.61461 13.4277 5.62712 13.428 6.96682 13.428C8.29495 13.428 8.31974 13.4273 8.40264 13.3907C8.57499 13.3145 8.67612 13.1691 8.6898 12.978C8.69721 12.8743 8.69176 12.8405 8.6543 12.7587C8.60298 12.6466 8.52279 12.5604 8.41744 12.5041C8.34738 12.4666 8.31695 12.464 7.8978 12.4586L7.45257 12.453L7.4478 10.1338L7.44303 7.81464L7.37103 7.70997C7.23538 7.51278 6.98655 7.43385 6.78653 7.52457ZM10.7607 7.50542C10.4589 7.55341 10.1526 7.68612 9.92955 7.86556C9.7091 8.0429 9.50684 8.31945 9.4163 8.56728C9.3097 8.85902 9.31503 8.75862 9.31503 10.4753V12.0503L9.36465 12.2085C9.56046 12.8327 10.0404 13.2766 10.6538 13.4009C10.8687 13.4445 11.3462 13.4302 11.538 13.3745C12.1102 13.2083 12.5267 12.7853 12.7114 12.1828C12.752 12.0504 12.752 12.0488 12.7577 10.5316C12.7626 9.21616 12.7596 8.99287 12.7354 8.86329C12.614 8.21543 12.1243 7.69851 11.483 7.5411C11.3094 7.49847 10.924 7.47945 10.7607 7.50542ZM10.7541 8.50993C10.5663 8.5759 10.406 8.7321 10.3279 8.92526L10.287 9.02628L10.2818 10.385C10.2785 11.2172 10.2834 11.7879 10.2943 11.8577C10.337 12.1324 10.5392 12.359 10.8043 12.4296C10.9954 12.4805 11.2543 12.4552 11.4225 12.3692C11.5299 12.3143 11.6893 12.1336 11.739 12.0104L11.781 11.9063L11.7863 10.5328C11.7897 9.64141 11.785 9.12409 11.7729 9.05875C11.7309 8.8317 11.5851 8.63757 11.3814 8.53754C11.2865 8.49092 11.2575 8.4859 11.061 8.48214C10.8923 8.4789 10.8251 8.48498 10.7541 8.50993Z"
      fill="#4D5358"
    />
  </svg>
);

const Forward15Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.85059 1.53578C8.63657 1.61557 8.51381 1.78974 8.51421 2.01306C8.51451 2.19015 8.55847 2.2523 8.98015 2.67172C9.18908 2.87953 9.36003 3.05456 9.36003 3.06068C9.36003 3.06678 9.13121 3.07654 8.85153 3.08233C8.32897 3.09317 8.02844 3.12237 7.6047 3.20346C5.65602 3.57634 3.94257 4.72114 2.83692 6.38888C2.61188 6.72832 2.50186 6.92074 2.34066 7.25682C1.90119 8.17299 1.67124 9.08638 1.62111 10.1149C1.54743 11.6261 1.92934 13.0905 2.73361 14.3809C3.46531 15.5548 4.55734 16.5318 5.80191 17.126C7.84102 18.0996 10.176 18.0969 12.213 17.1185C14.3099 16.1115 15.8425 14.1122 16.2622 11.8364C16.4385 10.88 16.4289 9.86621 16.2345 8.93152C15.8681 7.16938 14.819 5.55577 13.3425 4.48331C13.064 4.28094 12.6614 4.03391 12.5878 4.02008C12.4957 4.00282 12.329 4.02033 12.2572 4.05484C12.1724 4.09557 12.0717 4.19524 12.0313 4.27849C12.0123 4.3176 11.9955 4.40076 11.9913 4.47665C11.985 4.59055 11.9903 4.62011 12.0323 4.70595C12.0871 4.81807 12.1546 4.87728 12.402 5.0306C13.0664 5.44221 13.6809 6.01128 14.1611 6.65969C14.5623 7.20138 14.9242 7.91645 15.1265 8.56688C15.4213 9.51454 15.486 10.5905 15.3094 11.6062C15.2464 11.9686 15.1047 12.462 14.9545 12.8419C14.3902 14.2689 13.2612 15.4989 11.8817 16.1893C10.882 16.6897 9.83553 16.9108 8.69772 16.862C6.68305 16.7756 4.83846 15.7399 3.68592 14.0479C3.18738 13.316 2.8277 12.4219 2.68303 11.5549C2.60909 11.1118 2.60164 11.0107 2.60211 10.4569C2.60257 9.89974 2.61625 9.72718 2.69344 9.30488C3.05997 7.29943 4.40151 5.54608 6.23184 4.68034C7.11021 4.26488 7.91626 4.0784 8.93703 4.0545L9.36903 4.04438L8.98672 4.43142C8.55692 4.86653 8.51439 4.92856 8.51439 5.11988C8.51439 5.2585 8.57082 5.38239 8.67932 5.482C8.77722 5.57188 8.86612 5.60471 9.00903 5.60374C9.21858 5.6023 9.215 5.60523 10.1287 4.69153C11.0492 3.77101 11.0418 3.78019 11.0418 3.56288C11.0418 3.34526 11.0495 3.35478 10.1288 2.43516C9.55219 1.85933 9.27233 1.59213 9.21655 1.56429C9.11589 1.51401 8.94471 1.50068 8.85059 1.53578ZM6.78653 7.52418C6.66724 7.5783 6.59476 7.64001 6.53892 7.73499C6.49023 7.81783 6.48881 7.82818 6.48003 8.16188C6.47167 8.47899 6.46802 8.50872 6.42963 8.57048C6.34758 8.7024 6.29661 8.71866 5.93103 8.7294C5.65539 8.73752 5.59489 8.74447 5.52583 8.776C5.22861 8.91163 5.14237 9.31323 5.36059 9.54541C5.5003 9.69408 5.65143 9.72986 6.06603 9.71242C6.21948 9.70597 6.37541 9.69348 6.41253 9.68468L6.48003 9.66868V11.0606V12.4526L6.03452 12.4582C5.61232 12.4636 5.58505 12.466 5.51301 12.5045C5.34522 12.5942 5.2539 12.7336 5.24137 12.9192C5.22766 13.1226 5.3409 13.3095 5.52612 13.3892C5.6146 13.4273 5.62711 13.4276 6.96682 13.4276C8.29495 13.4276 8.31973 13.4269 8.40264 13.3903C8.57499 13.3141 8.67612 13.1687 8.6898 12.9776C8.69721 12.8739 8.69176 12.8402 8.6543 12.7583C8.60298 12.6462 8.52279 12.56 8.41744 12.5037C8.34738 12.4662 8.31694 12.4636 7.8978 12.4582L7.45257 12.4526L7.4478 10.1334L7.44303 7.81425L7.37103 7.70958C7.23538 7.51239 6.98655 7.43346 6.78653 7.52418ZM10.7607 7.50502C10.4589 7.55301 10.1526 7.68573 9.92955 7.86517C9.7091 8.0425 9.50683 8.31906 9.41629 8.56688C9.3097 8.85862 9.31503 8.75822 9.31503 10.4749V12.0499L9.36465 12.2081C9.56046 12.8323 10.0404 13.2762 10.6538 13.4005C10.8687 13.4441 11.3462 13.4298 11.538 13.3741C12.1102 13.2079 12.5267 12.7849 12.7114 12.1824C12.752 12.05 12.752 12.0484 12.7577 10.5312C12.7626 9.21576 12.7596 8.99247 12.7353 8.86289C12.614 8.21503 12.1243 7.69811 11.483 7.5407C11.3094 7.49808 10.924 7.47905 10.7607 7.50502ZM10.7541 8.50953C10.5663 8.5755 10.406 8.73171 10.3279 8.92486L10.287 9.02588L10.2818 10.3846C10.2785 11.2168 10.2834 11.7875 10.2943 11.8573C10.337 12.132 10.5392 12.3587 10.8043 12.4292C10.9954 12.4801 11.2543 12.4548 11.4225 12.3688C11.5299 12.3139 11.6893 12.1332 11.739 12.01L11.781 11.9059L11.7863 10.5324C11.7897 9.64101 11.785 9.12369 11.7729 9.05835C11.7309 8.8313 11.5851 8.63717 11.3814 8.53714C11.2865 8.49052 11.2575 8.4855 11.061 8.48174C10.8923 8.4785 10.8251 8.48458 10.7541 8.50953Z"
      fill="#4D5358"
    />
  </svg>
);

const AudioProgressBar = ({
  title,
  subtitle,
  // seconds,
  // playerRef,
  // seekValue,
  // isPlaying,
  // getDuration,
  // setIsPlaying,
  // getTotalDuration,
  // playedPercentage,
  // handleSeekChange,
  // handleSeekMouseUp,
  // handleSeekMouseDown,
  url,
}) => {
  const [handlePlay, setHandlePlay] = useState(false);
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [playedPercentage, setPlayedPercentage] = useState(0);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  const wavesurferRef = useRef(null);
  const getDuration = () => {
    const currentTimeInSeconds = wavesurferRef?.current?.getCurrentTime();
    const minutes = Math.floor(currentTimeInSeconds / 60);
    const seconds = Math.floor(currentTimeInSeconds % 60);

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const getTotalDuration = () => {
    const durationInSeconds = wavesurferRef?.current?.getDuration();
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleWSMount = useCallback(
    (waveSurfer) => {
      wavesurferRef.current = waveSurfer;

      if (wavesurferRef.current) {
        wavesurferRef.current.load(url);
        wavesurferRef.current.on('ready', () => {
          setIsAudioLoaded(true);
        });

        if (window) {
          window.surferidze = wavesurferRef.current;
        }
      }
    },
    [url, isAudioLoaded]
  );

  const handlePlayPause = () => {
    setHandlePlay(!handlePlay);
    return handlePlay ? wavesurferRef.current.pause() : wavesurferRef.current.play();
  };

  // ··································································
  // HANDLERS

  const handleGoForward = () => {
    if (wavesurferRef.current) {
      const currentTime = wavesurferRef.current.getCurrentTime();
      const duration = wavesurferRef.current.getDuration();
      const newTime = currentTime + 10;
      const newPercentage = newTime / duration;
      wavesurferRef.current.seekTo(newPercentage);
    }
  };

  const handleGoBackward = () => {
    if (wavesurferRef.current) {
      const currentTime = wavesurferRef.current.getCurrentTime();
      const duration = wavesurferRef.current.getDuration();
      const newTime = Math.max(0, currentTime - 10);
      const newPercentage = newTime / duration;
      wavesurferRef.current.seekTo(newPercentage);
    }
  };
  const handleSeekChange = (event) => {
    const newPercentage = parseFloat(event.target.value);

    wavesurferRef.current.seekTo(newPercentage);
  };
  const handleSeekMouseDown = () => {
    setHandlePlay(false);
  };

  const handleSeekMouseUp = () => {
    setHandlePlay(true);
  };

  const updatePlayedPercentage = () => {
    if (wavesurferRef.current) {
      const duration = wavesurferRef.current.getDuration();
      const currentTime = wavesurferRef.current.getCurrentTime();
      const percentage = (currentTime / duration) * 100;
      setPlayedPercentage(percentage);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updatePlayedPercentage();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateCurrentPercentage = () => {
      const duration = wavesurferRef?.current?.getDuration();
      const currentTime = wavesurferRef?.current?.getCurrentTime();
      const newPercentage = currentTime / duration;
      setCurrentPercentage(newPercentage);
    };

    const interval = setInterval(updateCurrentPercentage, 1000);

    return () => clearInterval(interval);
  }, [wavesurferRef?.current]);

  // ··································································
  // COMPONENT

  const { classes } = AudioProgressBarStyles(
    { useSpaceBetween: title || subtitle },
    { name: 'AudioProgressBar' }
  );

  return (
    <Box className={classes.progressBarWrapper}>
      {(title || subtitle) && isAudioLoaded && (
        <Box className={classes.titleWrapper}>
          {title && (
            <TextClamp lines={1}>
              <Box className={classes.title}>{title}</Box>
            </TextClamp>
          )}
        </Box>
      )}
      {!isAudioLoaded && <Loader />}
      <WaveSurfer
        onMount={handleWSMount}
        container="#waveform"
        height={52}
        splitChannels={false}
        normalize={true}
        waveColor="#929292"
        progressColor="#77bb41"
        cursorColor="#000000"
        cursorWidth={2}
        barWidth={3}
        barGap={4}
        barRadius={30}
        barHeight={1.3}
        barAlign="bottom"
        minPxPerSec={1}
        fillParent={true}
        url={url}
        autoplay={false}
        interact={true}
        dragToSeek={false}
        hideScrollbar={false}
        audioRate={1}
        autoScroll={true}
        autoCenter={true}
        sampleRate={8000}
      >
        <WaveForm />
      </WaveSurfer>
      {isAudioLoaded && (
        <Box className={classes.controlsWrapper}>
          <Box>
            <Text size={'xs'} role={'productive'} className={classes.duration}>
              {getDuration()}
            </Text>
          </Box>
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
              value={currentPercentage}
              onChange={handleSeekChange}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
            />
          </Box>
          <Box>
            <Text size={'xs'} role={'productive'} className={classes.duration}>
              {getTotalDuration()}
            </Text>
          </Box>
          <Box>
            <Box className={classes.buttonDurationWrapper}>
              <Box className={classes.buttonWrapper}>
                <Box onClick={handleGoBackward} className={classes.iconWrapper}>
                  <Back15Icon className={classes.controlIcon} />
                </Box>
                <Box onClick={() => handlePlayPause()} className={classes.iconWrapper}>
                  {handlePlay ? (
                    <ControlsPauseIcon height={20} width={20} className={classes.controlIcon} />
                  ) : (
                    <ControlsPlayIcon
                      height={18}
                      width={18}
                      className={classes.controlIcon}
                      style={{ marginLeft: 2 }}
                    />
                  )}
                </Box>
                <Box onClick={handleGoForward} className={classes.iconWrapper}>
                  <Forward15Icon className={classes.controlIcon} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

AudioProgressBar.defaultProps = AUDIO_PROGRESS_BAR_DEFAULT_PROPS;
AudioProgressBar.propTypes = AUDIO_PROGRESS_BAR_PROP_TYPES;

export { AudioProgressBar };
