import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',      // Main entry page
        connectToRobot: './connectToRobot.html',
        seeAllRobots: './seeAllRobots.html',
        seeLive: './seeLive.html',
        settingsPage: './settingsPage.html',
        signIn: './signIn.html',
        signUp: './signUp.html'
      }
    }
  }
});
