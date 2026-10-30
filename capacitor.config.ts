import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prayslovenia.app',
  appName: 'Pray Slovenia',
  webDir: 'public',
  backgroundColor: '#0C1322',
  server: {
    url: 'https://pray-slovenia.vercel.app',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#0C1322',
    },
    // DARK means light clock text, for the navy header.
    StatusBar: {
      style: 'DARK',
    },
    // Android runs this too, and it would otherwise override StatusBar.
    SystemBars: {
      style: 'DARK',
    },
  },
};

export default config;
