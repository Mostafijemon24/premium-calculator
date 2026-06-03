import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.premium.calculator",
  appName: "Premium Calculator",
  webDir: "dist",
  android: {
    backgroundColor: "#0a0a0a",
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
