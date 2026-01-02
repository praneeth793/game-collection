# Game Collection - Android App

This is a native Android application that packages the complete 22-game collection as a mobile app with touch controls.

## Features

- **Native Android App** - Full WebView wrapper with native controls
- **Touch Gestures** - Swipe navigation (left/right/back/forward)
- **Haptic Feedback** - Vibration on interactions
- **Splash Screen** - Professional startup experience
- **Responsive Design** - Optimized for all screen sizes
- **Offline Support** - Games work without internet

## Project Structure

```
android-app/
├── android/                          # Android project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/              # Web games (index.html, style.css, game.js, etc.)
│   │   │   ├── java/com/gamecollection/app/
│   │   │   │   ├── MainActivity.java    # Main WebView activity
│   │   │   │   └── SplashActivity.java  # Splash screen
│   │   │   ├── res/                 # Android resources
│   │   │   │   ├── layout/          # XML layouts
│   │   │   │   ├── values/          # Strings, colors, themes
│   │   │   │   ├── drawable/        # Graphics
│   │   │   │   └── xml/             # Config files
│   │   │   └── AndroidManifest.xml
│   │   ├── build.gradle
│   │   └── proguard-rules.pro
│   ├── build.gradle
│   ├── settings.gradle
│   ├── gradle.properties
│   └── gradle/wrapper/
│       └── gradle-wrapper.properties
├── capacitor.config.ts           # Capacitor configuration
└── package.json                  # Node dependencies
```

## Building the APK

### Prerequisites

1. **Java Development Kit (JDK) 17+**
   ```bash
   # Windows
   winget install Microsoft.OpenJDK.17
   
   # macOS
   brew install openjdk@17
   
   # Linux
   sudo apt install openjdk-17-jdk
   ```

2. **Android SDK**
   - Download from: https://developer.android.com/studio
   - Or install via command line:
   ```bash
   # macOS
   brew install android-sdk
   
   # Linux
   sudo apt install android-sdk
   ```

3. **Set ANDROID_HOME**
   ```bash
   export ANDROID_HOME=$HOME/android-sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
   ```

### Build Steps

1. **Install Dependencies**
   ```bash
   cd android-app
   npm install
   ```

2. **Sync Capacitor**
   ```bash
   npx cap sync
   ```

3. **Build Release APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. **Generate Signed APK**
   ```bash
   ./gradlew signRelease
   ```

### Output APK Location

```
android-app/android/app/build/outputs/apk/release/
└── app-release.apk
```

## Touch Controls

| Gesture | Action |
|---------|--------|
| Swipe Right | Go Back |
| Swipe Left | Go Forward |
| Swipe Down | Refresh Page |
| Tap | Select/Play |

## Games Included

1. Neon Drift 3D - Racing
2. Snake - Classic
3. Tic Tac Toe - 2-Player
4. Pong - Classic
5. Tetris - Puzzle
6. Neon Runner - Endless
7. GTA City - Open World
8. Duck Hunt Mario - Shooting
9. Spider-Man - Web Slinger
10. Midnight Corridor - Horror
11. Duck Hunt - Classic
12. Undertale - Bullet Hell
13. Floating Island 3D - Survival
14. Digital Garden - Art Game
15. Neon Arena - 3D Survival
16. Echoes of Void - Psychological
17. Shadow Protocol - FPS Arena
18. Luminous Garden - Puzzle
19. The Wanderer - Horror
20. Nebula Drifter - Space
21. Drift - Meditation
22. Cloud Hop - Mobile (NEW!)

## Configuration

### App Name
Edit `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Your Game Collection</string>
```

### App Icon
Replace files in `android/app/src/main/res/mipmap-*/`

### Colors
Edit `android/app/src/main/res/values/colors.xml`

## Testing

### Debug Build
```bash
cd android-app/android
./gradlew assembleDebug
```

### Install on Connected Device
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Troubleshooting

### WebView Issues
- Ensure `android:usesCleartextTraffic="true"` in manifest
- Check `network_security_config.xml`

### Performance Issues
- Reduce `maxSdkVersion` for older devices
- Disable animations in `style.css`

### Build Errors
- Clean build: `./gradlew clean`
- Check Java version: `java -version`
- Update SDK: `sdkmanager --update`

## License

This project is proprietary software.
