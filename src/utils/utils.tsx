import { Dimensions } from 'react-native';

export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;
// Average of width and height — used for responsive icon sizing
export const deviceRatio = (deviceHeight + deviceWidth) / 2;

export const colors = {
  baseColor: 'red',
  whiteColor: 'white',
  opacityColor: '#00000090',
  opacityColor1: '#00000080',
};

export const images = {
  play: require('../../src/assets/play.png'),
  pause: require('../../src/assets/pause.png'),
  back: require('../../src/assets/back.png'),
  exit_fullscreen: require('../../src/assets/exit_fullscreen.png'),
  fullscreen: require('../../src/assets/fullscreen.png'),
  mute: require('../../src/assets/mute.png'),
  unmute: require('../../src/assets/unmute.png'),
  backward: require('../../src/assets/backward.png'),
  forward: require('../../src/assets/forward.png'),
  more: require('../../src/assets/more.png'),
};
