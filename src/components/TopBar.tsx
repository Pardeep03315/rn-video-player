import { StyleSheet, View, Image, Pressable } from 'react-native';
import React from 'react';
import { colors, images, deviceRatio } from '../utils/utils';

// TopBar — displays back button (left) and fullscreen, mute, options buttons (right)
const TopBar = (props: any) => {
  const {
    onBack,
    onPressMore,
    muted,
    toggleMute,
    toggleFS,
    fullscreen,
    showBackButton,
    backIcon,
    backIconStyle,
    fullscreenIcon,
    exit_fullscreenIcon,
    fullScreenIconStyle,
    muteIcon,
    unMuteIcon,
    muteIconStyle,
    optionIcon,
    optionIconStyle,
  } = props;

  return (
    <View style={styles.container}>
      {showBackButton && (
        <Pressable onPress={onBack} style={styles.iconButton}>
          <Image
            source={backIcon ? backIcon : images.back}
            style={[styles.icon, backIconStyle]}
            resizeMode="contain"
          />
        </Pressable>
      )}
      <View style={styles.rightContainer}>
        {/* Fullscreen toggle — switches between fullscreen and inline */}
        <Pressable onPress={toggleFS} style={styles.iconButton}>
          {fullscreen ? (
            <Image
              source={exit_fullscreenIcon ? exit_fullscreenIcon : images.exit_fullscreen}
              style={[styles.icon, fullScreenIconStyle]}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={fullscreenIcon ? fullscreenIcon : images.fullscreen}
              style={[styles.icon, fullScreenIconStyle]}
              resizeMode="contain"
            />
          )}
        </Pressable>

        {/* Mute toggle */}
        <Pressable onPress={toggleMute} style={[styles.iconButton, { marginHorizontal: 20 }]}>
          {muted ? (
            <Image
              source={unMuteIcon ? unMuteIcon : images.unmute}
              style={[styles.icon, muteIconStyle]}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={muteIcon ? muteIcon : images.mute}
              style={[styles.icon, muteIconStyle]}
              resizeMode="contain"
            />
          )}
        </Pressable>

        {/* Options/more button */}
        <Pressable onPress={onPressMore} style={styles.iconButton}>
          <Image
            source={optionIcon ? optionIcon : images.more}
            style={[styles.icon, optionIconStyle]}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    height: 51,
    paddingHorizontal: '3%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  icon: {
    height: deviceRatio * 0.02,
    width: deviceRatio * 0.02,
    tintColor: 'white',
  },
  iconButton: {
    backgroundColor: colors.opacityColor1,
    padding: 8,
    borderRadius: 100,
  },
});
