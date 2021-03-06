const withCSS = require('@zeit/next-css');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = withCSS({
  webpack(config, options) {
    config.node = {
      fs: 'empty'
    };

    if (!options.isServer) {
      config.externals = {
        child_process: 'child_process',
        os: 'os',
        worker_threads: 'worker_threads'
      };
    }

    config.plugins.push(
      new MonacoWebpackPlugin({
        output: 'static'
      })
    );

    return config;
  }
});
