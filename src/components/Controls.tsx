import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback as Touchable,
  Platform,
  ActivityIndicator
} from 'react-native';
import { colors } from '../utils/utils';
import TopBar from './TopBar';
import MiddleBar from './MiddleBar';
import BottomBar from './BottomBar';

// Module-level variable to track elapsed seconds for controls auto-hide timer
let currentSeconds = 0;

const Controls = forwardRef((props: any, ref) => {
  const {
    paused,
    fullscreen,
    loading,
    isBuffering,
    progress,
    currentTime,
    duration,
    muted,
    onMorePress,
    onBack,
    togglePlay,
    toggleMute,
    onPressBack,
    onPressForward,
    toggleFS,
    movingValue,
    controlsTimeout,
    showBackButton,
    hideMovingValue,
    showDuration,
    thumbTintColor,
    thumbStyle,
    trackStyle,
    minimumTrackTintColor,
    maximumTrackTintColor,
    durationTextStyle,
    backIcon,
    backIconStyle,
    fullscreenIcon,
    exit_fullscreenIcon,
    fullScreenIconStyle,
    muteIcon,
    unMuteIcon,
    muteIconStyle,
    playIcon,
    pauseIcon,
    playPauseIconStyle,
    forwardIcon,
    forwardIconStyle,
    backwardIcon,
    backwardIconStyle,
    optionIcon,
    optionIconStyle,
    videoTitle,
    videoDescription,
    videoTitleStyle,
    videoDescriptionStyle,
  } = props;

  const [hideControls, setHideControls] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const animControls = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const progressbar = useRef(new Animated.Value(2)).current;
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Restart auto-hide timer whenever seeking, paused, or hideControls state changes
  useEffect(() => {
    currentSeconds = 0;
    setTimer();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [seeking, hideControls, props.paused]);

  // Expose showControls to parent via ref (used after video ends)
  useImperativeHandle(ref, () => ({
    showControls,
  }));

  // Forwards seek position to VideoPlayer while marking seeking state
  const onSeek = (pos: any) => {
    props.onSeek(pos);
    if (!seeking) setSeeking(true);
  };

  // Forwards seek release to VideoPlayer and clears seeking state
  const onSeekRelease = (pos: any) => {
    props.onSeekRelease(pos);
    setSeeking(false);
    currentSeconds = 0;
  };

  // Increments timer every second — hides controls after controlsTimeout seconds
  const setTimer = () => {
    timer.current = setInterval(() => {
      switch (true) {
        case seeking:
          break;
        case props.paused:
          if (currentSeconds > 0) currentSeconds = 0;
          break;
        case hideControls:
          break;
        case currentSeconds === controlsTimeout:
          hideControlsFn(false);
          break;
        default:
          currentSeconds++;
      }
    }, 1000);
  };

  // Animates controls back into view and resets the auto-hide timer
  const showControls = () => {
    setHideControls(false);
    progressbar.setValue(2);
    Animated.parallel([
      Animated.timing(animControls, { toValue: 1, duration: 300, useNativeDriver: false }),
      Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  // Animates controls out of view after timeout or on tap
  const hideControlsFn = (isLoading: any) => {
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(animControls, { toValue: 0, duration: 300, useNativeDriver: false }),
        Animated.timing(scale, { toValue: 0.25, duration: 300, useNativeDriver: false }),
      ]).start(() => {
        setHideControls(true);
        currentSeconds = 0;
      });
    }
  };

  // Renders a transparent tap area when controls are hidden — tap to show controls again
  const hiddenControls = () => {
    Animated.timing(progressbar, { toValue: 0, duration: 300, useNativeDriver: false }).start();
    return (
      <Touchable style={styles.container} onPress={showControls}>
        <Animated.View style={[styles.container, { paddingBottom: progressbar }]} />
      </Touchable>
    );
  };

  // Renders the full controls overlay: TopBar + MiddleBar + BottomBar
  const displayedControls = () => (
    <Touchable onPress={() => hideControlsFn(loading)}>
      <Animated.View style={[styles.container, { opacity: animControls }]}>
        <View style={styles.controlsContainer}>
          <TopBar
            onPressMore={onMorePress}
            onBack={onBack}
            toggleFS={toggleFS}
            toggleMute={toggleMute}
            fullscreen={fullscreen}
            muted={muted}
            showBackButton={showBackButton}
            backIcon={backIcon}
            backIconStyle={backIconStyle}
            fullscreenIcon={fullscreenIcon}
            exit_fullscreenIcon={exit_fullscreenIcon}
            fullScreenIconStyle={fullScreenIconStyle}
            muteIcon={muteIcon}
            unMuteIcon={unMuteIcon}
            muteIconStyle={muteIconStyle}
            optionIcon={optionIcon}
            optionIconStyle={optionIconStyle}
          />
          <MiddleBar
            paused={paused}
            loading={loading}
            isBuffering={isBuffering}
            movingValue={movingValue}
            onPressForward={onPressForward}
            onPressBack={onPressBack}
            togglePlay={togglePlay}
            hideMovingValue={hideMovingValue}
            fullscreen={fullscreen}
            playIcon={playIcon}
            pauseIcon={pauseIcon}
            playPauseIconStyle={playPauseIconStyle}
            forwardIcon={forwardIcon}
            forwardIconStyle={forwardIconStyle}
            backwardIcon={backwardIcon}
            backwardIconStyle={backwardIconStyle}
          />
          <BottomBar
            currentTime={currentTime}
            duration={duration}
            fullscreen={fullscreen}
            progress={progress}
            paused={paused}
            showDuration={showDuration}
            duratonTextStyle={durationTextStyle}
            togglePlay={togglePlay}
            onSeek={onSeek}
            onSeekRelease={onSeekRelease}
            thumbTintColor={thumbTintColor}
            thumbStyle={thumbStyle}
            trackStyle={trackStyle}
            minimumTrackTintColor={minimumTrackTintColor}
            maximumTrackTintColor={maximumTrackTintColor}
          />
        </View>
      </Animated.View>
    </Touchable>
  );

  // Show spinner while video is loading
  if (loading) {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator size={Platform.OS === 'android' ? 40 : 'small'} color="white" />
      </View>
    );
  }

  if (hideControls) return hiddenControls();

  return displayedControls();
});

export default Controls;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  controlsContainer: {
    backgroundColor: colors.opacityColor,
    flex: 1,
  },
  loadingView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
});
