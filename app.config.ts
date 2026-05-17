import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Awaab',
  slug: 'awaab',
  version: '1.0.0',
  scheme: 'awaab',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0A1628',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.awaab.dhikr',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0A1628',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: 'com.awaab.dhikr',
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-av',
      {
        microphonePermission:
          'Awaab needs microphone access to recognise your dhikr recitations.',
      },
    ],
  ],
  extra: {
    openaiApiKey: process.env.OPENAI_API_KEY ?? '',
    groqApiKey: process.env.GROQ_API_KEY ?? '',
  },
};

export default config;
