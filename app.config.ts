import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'DominoConnect',
  slug: 'dominoconnect2',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  updates: {
    url: 'https://u.expo.dev/your-project-id'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.dominoconnect2'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF'
    },
    package: 'com.dominoconnect2'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    eas: {
      projectId: ''  // Será preenchido após criar o projeto
    }
  },
  owner: 'your-expo-username'  // Será atualizado com seu username
});
