const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Customize the config
config.resolver.sourceExts = [
  'js',
  'jsx',
  'json',
  'ts',
  'tsx'
];

config.server = {
  port: 8081,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Ensure proper content type for bundle requests
      if (req.url.endsWith('.bundle')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      return middleware(req, res, next);
    };
  }
};

// Configure the watchman
config.watchFolders = [__dirname];

module.exports = config;
