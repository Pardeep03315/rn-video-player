import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/utils';

// Time — formats and displays a time value in HH:MM:SS or MM:SS format
const Time = (props: any) => {
  const { style, time = 0 } = props;

  const addZeros = (value: number) => (value < 10 ? `0${value}` : value);

  const getTime = (t: number) => {
    const secs = t % 60;
    const s2 = (t - secs) / 60;
    const mins = s2 % 60;
    const hrs = (s2 - mins) / 60;
    const hours = hrs > 0 ? `${addZeros(hrs)}:` : '';
    return `${hours}${addZeros(mins)}:${addZeros(secs)}`;
  };

  return (
    <View>
      <Text style={[styles.text, style]}>{getTime(parseInt(time, 10))}</Text>
    </View>
  );
};

export default Time;

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: colors.whiteColor,
  },
});
