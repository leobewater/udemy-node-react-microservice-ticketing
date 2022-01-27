module.export = {
  // tell webpack when file changes once every 300ms
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
