import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';

import {
  StatusBar,
  Keyboard,
  Platform,
  StyleSheet,
  View,
  Animated,
  Alert,
} from 'react-native';

import Video, { type OnLoadData } from 'react-native-video';
import { activate, deactivate } from '@thehale/react-native-keep-awake';
import Orientation from 'react-native-orientation-locker';
import { deviceWidth, deviceHeight } from './utils/utils';
import Controls from './components/Controls';

export interface PlayerRefType {
  seek: (time: number, tolerance?: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  exitFullScreen: () => void;
}

const VideoPlayer = forwardRef((props: any, ref) => {
  const {
    source,
    repeat,
    lockRatio,
    autoPlay = true,
    resizeMode = 'contain',
    rate = 1,
    controlsTimeout = 3,
    movingValue = 10,
    hideMovingValue = false,
    defaultMuted = false,
    showBackButton = true,
    onLoad = (_event: OnLoadData) => {},
    onEnd = () => {},
    onError = () => {},
    onPressOption = () => {},
    onChangeOrientation = () => {},
    onBack = () => {},
    backIcon,
    backIconStyle = {},
    fullscreenIcon,
    exit_fullscreenIcon,
    fullScreenIconStyle = {},
    muteIcon,
    unMuteIcon,
    muteIconStyle = {},
    playIcon,
    pauseIcon,
    playPauseIconStyle = {},
    forwardIcon,
    forwardIconStyle = {},
    backwardIcon,
    backwardIconStyle = {},
    optionIcon,
    optionIconStyle = {},
    showDuration = true,
    videoTitle = '',
    videoDescription = '',
    durationTextStyle,
    videoTitleStyle = {},
    videoDescriptionStyle = {},
    thumbTintColor,
    thumbStyle,
    trackStyle,
    minimumTrackTintColor,
    maximumTrackTintColor
  } = props;

  // Delay render until component is mounted to prevent
  // "Current Activity is null" crash on Android (ExoPlayer)
  const [isMounted, setIsMounted] = useState(false);

  const [state, setState] = useState({
    paused: false,
    muted: defaultMuted,
    inlineHeight: deviceWidth * 0.5625,
    loading: true,
    isBuffering: false,
    duration: 0,
    progress: 0,
    currentTime: 0,
    seeking: false,
    isFullScreen: false,
  });

  const {
    paused,
    muted,
    loading,
    isBuffering,
    progress,
    duration,
    currentTime,
    isFullScreen,
  } = state;

  const animInline = useRef(new Animated.Value(deviceWidth * 0.5625)).current;
  const playerRef = useRef<PlayerRefType | null>(null);
  const controlsRef = useRef(null);
  const current_time_ref = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    current_time_ref.current = currentTime;
  }, [currentTime]);

  useImperativeHandle(ref, () => ({
    ...playerRef.current,
    play: () => {
      setState(prev => ({ ...prev, paused: false }));
    },
    pause: () => {
      setState(prev => ({ ...prev, paused: true }));
      playerRef.current?.pause();
    },
    stop: () => {
      setState(prev => ({ ...prev, paused: true }));
    },
    exitFullScreen: () => {
      _onBack();
    },
    seek: (value: number) => {
      if (value > 0 && value < duration) {
        setState(prev => ({ ...prev, currentTime: value, seeking: false }));
        playerRef.current?.seek(value);
        current_time_ref.current = value;
      } else {
        console.error('Seek value must be between 0 and ' + duration);
      }
    },
  }));

  // Called when video metadata is loaded — sets duration, height ratio, clears loading
  const _onLoad = (videoData: any) => {
    onLoad(videoData);
    const { height, width } = videoData.naturalSize;
    const ratio =
      typeof height === 'undefined' || typeof width === 'undefined' || width === 0
        ? 9 / 16
        : height / width;
    const calculatedInlineHeight = lockRatio
      ? deviceWidth / lockRatio
      : deviceWidth * ratio;
    setState(prev => ({
      ...prev,
      paused: false,
      loading: false,
      inlineHeight: calculatedInlineHeight,
      duration: videoData.duration,
      seeking: false,
    }));
    Animated.timing(animInline, {
      toValue: calculatedInlineHeight,
      duration: 200,
      useNativeDriver: false,
    }).start();
    activate();
  };

  // Updates buffering state shown in MiddleBar
  const _onBuffer = ({ isBuffering }: any) => {
    setState(prev => ({ ...prev, isBuffering }));
  };

  // Updates scrubber progress and current time display
  const _onProgress = (time: any) => {
    const { currentTime } = time;
    current_time_ref.current = currentTime;
    const calculatedProgress = currentTime / duration;
    setState(prev => {
      if (prev.seeking) return prev;
      return { ...prev, progress: calculatedProgress, currentTime };
    });
  };

  // Clears loading on error and forwards sanitized error string to consumer
  // Strips newlines and non-printable characters to prevent log injection (CWE-117)
  const _onError = (error: any) => {
    const raw = JSON.stringify(error?.error, null, 2);
    const errorString = raw.replace(/[\r\n]/g, ' ').replace(/[^\x20-\x7E]/g, '');
    setState(prev => ({ ...prev, loading: false }));
    onError(errorString);
  };

  // Resets player to beginning when video ends
  const _onEnd = () => {
    Alert.alert("Video Ended")
    onEnd();
    if (!repeat) {
      onSeekRelease(0);
      setState(prev => ({
        ...prev,
        currentTime: 0,
        isFullScreen: false,
        paused: true,
        progress: 0,
      }));
      if (controlsRef.current) {
        (controlsRef.current as any).showControls();
      }
      Orientation.lockToPortrait();
      current_time_ref.current = 0;
    }
  };

  // Called while scrubber is being dragged
  const onSeek = (percent: any) => {
    const currentTimeSeconds = percent * duration;
    setState(prev => ({ ...prev, seeking: true, currentTime: currentTimeSeconds }));
    current_time_ref.current = currentTimeSeconds;
  };

  // Called when scrubber drag is released — seeks video to new position
  const onSeekRelease = (percent: any) => {
    const seconds = percent * duration;
    setState(prev => ({ ...prev, progress: percent, currentTime: seconds, seeking: false }));
    playerRef.current?.seek(seconds);
    current_time_ref.current = seconds;
  };

  // Toggles between fullscreen (landscape) and inline (portrait)
  const toggleFullScreen = () => {
    const { isFullScreen } = state;
    if (isFullScreen) {
      Orientation.lockToPortrait();
      onChangeOrientation('inline');
    } else {
      Orientation.lockToLandscape();
      onChangeOrientation('fullscreen');
    }
    setState(prev => ({ ...prev, isFullScreen: !prev.isFullScreen }));
    Keyboard.dismiss();
  };

  // Toggles play/pause and manages screen wake lock
  const togglePlay = () => {
    setState(prev => ({ ...prev, paused: !prev.paused }));
    Orientation.getOrientation(() => {
      if (!state.paused) {
        activate();
      } else {
        deactivate();
      }
    });
  };

  // Toggles audio mute/unmute
  const toggleMute = () => {
    setState(prev => ({ ...prev, muted: !prev.muted }));
  };

  // Seeks forward by movingValue seconds
  const onPressForward = () => {
    if (current_time_ref.current <= duration - movingValue) {
      const newTime = current_time_ref.current + movingValue;
      playerRef.current?.seek(newTime);
      setState(prev => ({ ...prev, currentTime: newTime }));
      current_time_ref.current = newTime;
    }
  };

  // Seeks backward by movingValue seconds
  const onPressBackward = () => {
    if (current_time_ref.current > movingValue) {
      const newTime = current_time_ref.current - movingValue;
      playerRef.current?.seek(newTime);
      setState(prev => ({ ...prev, currentTime: newTime }));
      current_time_ref.current = newTime;
    }
  };

  // Exits fullscreen if active, otherwise calls consumer's onBack
  const _onBack = () => {
    if (state.isFullScreen) {
      Orientation.lockToPortrait();
      onChangeOrientation('inline');
      setState(prev => ({ ...prev, isFullScreen: false }));
    } else {
      onBack();
    }
  };

  const onMorePress = () => {
    onPressOption();
  };

  if (!isMounted) return null;

  return (
    <View style={styles.background}>
      {Platform.OS === 'android' ? (
        <StatusBar
          hidden={isFullScreen}
          barStyle="light-content"
          backgroundColor="black"
        />
      ) : (
        <StatusBar
          barStyle={isFullScreen ? 'light-content' : 'dark-content'}
          backgroundColor="black"
        />
      )}

      <Video
        {...props}
        source={source}
        paused={paused}
        repeat={repeat}
        style={isFullScreen ? styles.fullScreen : styles.inline}
        ref={playerRef}
        rate={rate}
        muted={muted}
        hideShutterView={Platform.OS === 'android'}
        onLoad={_onLoad}
        onBuffer={_onBuffer}
        onProgress={_onProgress}
        onEnd={_onEnd}
        onError={_onError}
      />

      <Controls
        ref={controlsRef}
        paused={paused}
        muted={muted}
        movingValue={movingValue}
        hideMovingValue={hideMovingValue}
        fullscreen={isFullScreen}
        isBuffering={isBuffering}
        controlsTimeout={controlsTimeout}
        showBackButton={showBackButton}
        loading={loading}
        progress={progress}
        currentTime={currentTime}
        duration={duration}
        showDuration={showDuration}
        durationTextStyle={durationTextStyle}
        thumbTintColor={thumbTintColor}
        thumbStyle={thumbStyle}
        trackStyle={trackStyle}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        backIcon={backIcon}
        backIconStyle={backIconStyle}
        fullscreenIcon={fullscreenIcon}
        exit_fullscreenIcon={exit_fullscreenIcon}
        fullScreenIconStyle={fullScreenIconStyle}
        muteIcon={muteIcon}
        unMuteIcon={unMuteIcon}
        muteIconStyle={muteIconStyle}
        playIcon={playIcon}
        pauseIcon={pauseIcon}
        playPauseIconStyle={playPauseIconStyle}
        forwardIcon={forwardIcon}
        forwardIconStyle={forwardIconStyle}
        backwardIcon={backwardIcon}
        backwardIconStyle={backwardIconStyle}
        optionIcon={optionIcon}
        optionIconStyle={optionIconStyle}
        videoTitle={videoTitle}
        videoDescription={videoDescription}
        videoTitleStyle={videoTitleStyle}
        videoDescriptionStyle={videoDescriptionStyle}
        onSeek={onSeek}
        onSeekRelease={onSeekRelease}
        onPressForward={onPressForward}
        onPressBack={onPressBackward}
        toggleFS={toggleFullScreen}
        togglePlay={togglePlay}
        toggleMute={toggleMute}
        onBack={_onBack}
        onMorePress={onMorePress}
      />
    </View>
  );
});

export default VideoPlayer;

const inlineHeight = deviceWidth * 0.5625;

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    height: deviceWidth,
    width: deviceHeight,
    alignSelf: 'stretch',
  },
  inline: {
    height: inlineHeight,
    alignSelf: 'stretch',
  },
});
