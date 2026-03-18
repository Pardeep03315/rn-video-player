import { StyleSheet, View } from 'react-native';
import React from 'react';
import Scrubber from './Scrubber';
import Time from './Time';

// BottomBar — displays current time / total duration and the seek scrubber
const BottomBar = (props: any) => {
  const {
    currentTime,
    duration,
    progress,
    onSeek,
    onSeekRelease,
    showDuration,
    duratonTextStyle,
    thumbTintColor,
    thumbStyle,
    trackStyle,
    minimumTrackTintColor,
    maximumTrackTintColor,
  } = props;

  return (
    <View style={styles.container}>
      {showDuration && (
        <View style={styles.timeRow}>
          {/* Current playback time */}
          <Time time={currentTime} style={duratonTextStyle} />
          {/* Total video duration */}
          <Time time={duration} style={duratonTextStyle} />
        </View>
      )}
      {/* Seek scrubber */}
      <Scrubber
        onSeek={onSeek}
        onSeekRelease={onSeekRelease}
        progress={progress}
        thumbTintColor={thumbTintColor}
        thumbStyle={thumbStyle}
        trackStyle={trackStyle}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
      />
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  container: {
    height: 51,
    paddingHorizontal: '3%',
    paddingBottom: '1.5%',
    justifyContent: 'flex-end',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
