import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prayslovenia.app',
  appName: 'Pray Slovenia',
  webDir: 'public',
  server: {
    url: 'https://pray-slovenia.vercel.app',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: false,
      backgroundColor: '#f5f0e8',
    },
  },
};

export default config;