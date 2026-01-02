import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gamecollection.app',
  appName: 'Game Collection',
  webDir: '../dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a2e',
      androidSplashResourceName: 'splash',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a2e'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    },
    Haptics: {
      style: 'medium'
    }
  },
  android: {
    buildOptions: {
      keystorePath: 'release.keystore',
      keystorePassword: 'gamecollection2024',
      keyAlias: 'gamecollection',
      keyPassword: 'gamecollection2024',
      storeType: 'pkcs12'
    }
  }
};

export default config;
