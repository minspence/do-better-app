import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.minuitspence.dobetter",
  appName: "Do Beeter",
  webDir: "out",

  server: {
    url: "http://localhost:3000",
    cleartext: true,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: "#0f0f0f",
      showSpinner: false,
    },
    StutusBar: {
      style: "dark",
      backgroundColor: "#0f0f0f",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
