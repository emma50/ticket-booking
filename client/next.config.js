module.exports = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Restart every 3ms
    config.watchOptions.poll = 300;
    // Important: return the modified config
    return config;
  },
};