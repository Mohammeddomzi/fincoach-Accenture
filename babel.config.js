module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
    ],
    plugins: [
      // 'expo-router/babel', // Deprecated in SDK 50, using babel-preset-expo instead
      // '@tamagui/babel-plugin', // Temporarily disabled due to parse errors
      // Reanimated plugin MUST be last
      'react-native-reanimated/plugin',
    ],
  };
};


