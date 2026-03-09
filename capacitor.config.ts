import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prayslovenia.app',
  appName: 'Pray Slovenia',
  webDir: 'out',
  server: {
    url: 'https://pray-slovenia.vercel.app',
    cleartext: false,
  },
};

export default config;