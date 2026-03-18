# @delainetech/rn-video-player

A fully customizable React Native video player with controls, fullscreen, seek, mute and orientation support for both Android and iOS.

## Features

- ▶️ Play / Pause
- ⏩ Forward / Backward seek
- 🔇 Mute / Unmute
- 📺 Fullscreen with orientation lock
- ⏱ Duration display
- 🎨 Fully customizable icons and styles
- 📱 Android & iOS support

## Installation

```sh
npm install @delainetech/rn-video-player
```

### Peer Dependencies

Install the required peer dependencies:

```sh
npm install react-native-video react-native-orientation-locker @thehale/react-native-keep-awake
```

### iOS Setup

**1. Install pods:**
```sh
bundle exec pod install
```

**2. Add to `AppDelegate.swift` + Bridging Header (RN 0.77 and above):**

Add the following to your project's `AppDelegate.swift`:

```swift
// ...
@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  // ...

  // required for react-native-orientation-locker
  func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
    return Orientation.getOrientation()
  }
}
// ...
```

**3. Add to your Bridging Header (`YourApp-Bridging-Header.h`):**
```objc
#import "Orientation.h"
```

## Usage

```tsx
import VideoPlayer from '@delainetech/rn-video-player';

<VideoPlayer
  source={{ uri: 'https://your-video-url.mp4' }}
  autoPlay={true}
  showDuration={true}
  controlsTimeout={3}
  movingValue={10}
  onEnd={() => console.log('ended')}
  onError={(err) => console.log(err)}
  onBack={() => navigation.goBack()}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `object` | required | Video source `{ uri: '...' }` |
| `autoPlay` | `boolean` | `true` | Auto play on load |
| `repeat` | `boolean` | `false` | Loop video |
| `showDuration` | `boolean` | `true` | Show time display |
| `controlsTimeout` | `number` | `3` | Seconds before controls auto-hide |
| `movingValue` | `number` | `10` | Seconds to skip forward/backward |
| `hideMovingValue` | `boolean` | `false` | Hide skip seconds label |
| `defaultMuted` | `boolean` | `false` | Start muted |
| `showBackButton` | `boolean` | `true` | Show back button |
| `rate` | `number` | `1` | Playback speed |
| `resizeMode` | `string` | `contain` | Video resize mode |
| `lockRatio` | `number` | - | Lock aspect ratio |

## Callbacks

| Prop | Description |
|------|-------------|
| `onLoad` | Called when video loads |
| `onEnd` | Called when video ends |
| `onError` | Called on error with sanitized error string |
| `onBack` | Called when back button pressed |
| `onPressOption` | Called when options button pressed |
| `onChangeOrientation` | Called with `"fullscreen"` or `"inline"` |

## Customization — Icons

| Prop | Description |
|------|-------------|
| `backIcon` | Custom back button image |
| `playIcon` | Custom play image |
| `pauseIcon` | Custom pause image |
| `muteIcon` | Custom mute image |
| `unMuteIcon` | Custom unmute image |
| `fullscreenIcon` | Custom fullscreen image |
| `exit_fullscreenIcon` | Custom exit fullscreen image |
| `forwardIcon` | Custom forward image |
| `backwardIcon` | Custom backward image |
| `optionIcon` | Custom options image |

## Customization — Styles

| Prop | Description |
|------|-------------|
| `backIconStyle` | Style for back icon |
| `fullScreenIconStyle` | Style for fullscreen icon |
| `muteIconStyle` | Style for mute icon |
| `playPauseIconStyle` | Style for play/pause icon |
| `forwardIconStyle` | Style for forward icon |
| `backwardIconStyle` | Style for backward icon |
| `optionIconStyle` | Style for options icon |
| `durationTextStyle` | Style for time text |
| `thumbTintColor` | Scrubber thumb color |
| `minimumTrackTintColor` | Scrubber played track color |
| `maximumTrackTintColor` | Scrubber unplayed track color |
| `thumbStyle` | Scrubber thumb style |
| `trackStyle` | Scrubber track style |

## Ref Methods

```tsx
const playerRef = useRef(null);

<VideoPlayer ref={playerRef} ... />

playerRef.current.play();           // Resume playback
playerRef.current.pause();          // Pause playback
playerRef.current.stop();           // Stop playback
playerRef.current.seek(30);         // Seek to 30 seconds
playerRef.current.exitFullScreen(); // Exit fullscreen
```

## Author

[Pardeep](https://github.com/Pardeep03315)

## License

MIT © [delainetech](https://www.npmjs.com/~delainetech)
