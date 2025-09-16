module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Esta es la línea que necesitamos para las animaciones
      'react-native-reanimated/plugin',
    ],
  };
};