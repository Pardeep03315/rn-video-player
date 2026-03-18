import { StyleSheet, View } from 'react-native';
import React from 'react';
import { colors, deviceRatio } from '../utils/utils';
import { Slider } from '../../src/components/seekbar';

// Scrubber — seek bar that allows the user to drag to any position in the video
const Scrubber = (props: any) => {
  const {
    progress,
    onSeek,
    onSeekRelease,
    thumbTintColor = colors.baseColor,
    thumbStyle = styles.thumb,
    trackStyle = styles.track,
    minimumTrackTintColor = colors.baseColor,
    maximumTrackTintColor = colors.whiteColor,
  } = props;

  return (
    <View style={styles.container}>
      <Slider
        onValueChange={(val: any) => onSeek(val)}
        onSlidingComplete={(val: any) => onSeekRelease(val)}
        value={progress}
        thumbTintColor={thumbTintColor}
        thumbStyle={thumbStyle}
        trackStyle={trackStyle}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        animateTransitions={true}
      />
    </View>
  );
};

export default Scrubber;

const styles = StyleSheet.create({
  container: {
    height: deviceRatio * 0.025,
    justifyContent: 'center',
    marginHorizontal: '2%',
    width: '100%',
    alignSelf: 'center',
  },
  thumb: {
    width: 10,
    height: 10,
  },
  track: {
    borderRadius: 1,
    height: 2,
  },
});
