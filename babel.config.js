module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
    ],
    plugins: [
      'expo-router/babel',
      '@tamagui/babel-plugin',
      // Reanimated plugin MUST be last
      'react-native-reanimated/plugin',
    ],
  };
};


