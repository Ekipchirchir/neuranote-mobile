// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    assetExts: [...config.resolver.assetExts, 'wasm'], // Add .wasm to asset extensions
    sourceExts: [...config.resolver.sourceExts, 'js', 'json'], // Ensure JS focus
  },
  transformer: {
    ...config.transformer,
    getTransformOptions: () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};