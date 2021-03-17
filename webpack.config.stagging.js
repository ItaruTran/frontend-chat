const webpack = require('webpack');
const { merge } = require('webpack-merge');

const webpackCommonConfig = require('./webpack.config.common');

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: 'production',
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      API_URL: ''
    }),
  ],
  devtool: false,
}

module.exports = merge(webpackCommonConfig, config);
