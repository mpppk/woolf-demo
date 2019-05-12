const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');

module.exports = withCSS(
  withTypescript({
    webpack(config, options) {
      config.node = {
        fs: 'empty'
      };

      config.externals = {
        child_process: 'child_process',
        os: 'os',
        worker_threads: 'worker_threads'
      };
      return config;
    }
  })
);
