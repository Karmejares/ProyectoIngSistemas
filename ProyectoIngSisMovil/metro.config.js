const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add support for web
config.resolver.platforms = ["ios", "android", "native", "web"];

module.exports = config;
