module.exports = {
  packagerConfig: {
    asar: true,
    icon: "./assets/icon",
    extraResource: [
      // Left empty
    ],
  },
  rebuildConfig: {},
  makers: [
    // Windows
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "League-Predictor",
        authors: "Big Jeg",
        description: "An app for predicting PL results",
        iconUrl:
          "https://raw.githubusercontent.com/Broll26/league-predictor-v1/refs/heads/main/assets/icon.ico",
        setupIcon: "./assets/icon.ico",
        setupExe: "League-Predictor-Setup.exe",
        noMsi: true,
        version: "1.0.0",
      },
    },
    // Zip - Multi-Platform
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "win32", "linux"],
    },
    // Linux Debian
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: "./assets/icon.png",
        },
      },
    },
    // Linux RPM
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
};
