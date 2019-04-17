const withTypescript = require('@zeit/next-typescript');
module.exports = withTypescript({
  webpack(config, options) {
    config.externals = {
      child_process: 'child_process',
      os: 'os',
      worker_threads: 'worker_threads'
    };
    return config;
  }
});
