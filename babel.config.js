module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxRuntime: 'automatic' }]
    ],
    plugins: [
      // We let the preset handle classes, but keep your production optimization here
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};