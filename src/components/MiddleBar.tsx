import { StyleSheet, View, Image, Pressable, ImageBackground, Text, ActivityIndicator, Platform } from 'react-native';
import React from 'react';
import { colors, deviceRatio, deviceWidth, images } from '../utils/utils';

// MiddleBar — displays backward, play/pause (or buffering spinner), and forward buttons
const MiddleBar = ({
  fullscreen,
  paused,
  onPressForward,
  onPressBack,
  togglePlay,
  movingValue,
  isBuffering,
  hideMovingValue,
  playIcon,
  pauseIcon,
  playPauseIconStyle,
  forwardIcon,
  forwardIconStyle,
  backwardIcon,
  backwardIconStyle,
}: any) => {
  return (
    <View style={styles.container}>
      {/* Backward button — seeks back by movingValue seconds */}
      <Pressable style={styles.sideButton} onPress={onPressBack}>
        <ImageBackground
          source={backwardIcon ? backwardIcon : images.backward}
          style={[styles.seekIcon, backwardIconStyle]}
          resizeMode="contain"
        >
          {!hideMovingValue && <Text style={styles.seekLabel}>{movingValue}</Text>}
        </ImageBackground>
      </Pressable>

      {/* Play/Pause button — shows spinner when buffering */}
      {isBuffering ? (
        <View style={styles.centerButton}>
          <ActivityIndicator
            color={colors.whiteColor}
            size={Platform.OS === 'ios' ? 'small' : deviceRatio * 0.053}
          />
        </View>
      ) : (
        <Pressable
          style={[styles.centerButton, fullscreen && { marginHorizontal: '30%' }]}
          onPress={togglePlay}
        >
          {paused ? (
            <Image
              source={playIcon ? playIcon : images.play}
              style={[styles.playIcon, playPauseIconStyle]}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={pauseIcon ? pauseIcon : images.pause}
              style={[styles.playIcon, playPauseIconStyle]}
              resizeMode="contain"
            />
          )}
        </Pressable>
      )}

      {/* Forward button — seeks forward by movingValue seconds */}
      <Pressable style={styles.sideButton} onPress={onPressForward}>
        <ImageBackground
          source={forwardIcon ? forwardIcon : images.forward}
          style={[styles.seekIcon, forwardIconStyle]}
          resizeMode="contain"
        >
          {!hideMovingValue && <Text style={styles.seekLabel}>{movingValue}</Text>}
        </ImageBackground>
      </Pressable>
    </View>
  );
};

export default MiddleBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: deviceWidth * 0.9,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    height: deviceRatio * 0.035,
    width: deviceRatio * 0.035,
    tintColor: 'white',
    alignSelf: 'center',
  },
  centerButton: {
    alignSelf: 'center',
    padding: deviceRatio * 0.02,
    backgroundColor: colors.opacityColor1,
    borderRadius: 100,
    justifyContent: 'center',
    marginHorizontal: '10%',
  },
  sideButton: {
    alignSelf: 'center',
    padding: deviceRatio * 0.01,
    backgroundColor: colors.opacityColor1,
    borderRadius: 100,
    justifyContent: 'center',
  },
  seekIcon: {
    height: deviceRatio * 0.033,
    width: deviceRatio * 0.033,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seekLabel: {
    color: 'white',
    fontSize: 7,
    textAlign: 'center',
  },
});
