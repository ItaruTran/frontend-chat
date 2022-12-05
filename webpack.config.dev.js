const webpack = require('webpack');
const { merge } = require('webpack-merge');

const webpackCommonConfig = require('./webpack.config.common');

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      API_URL: 'http://localhost:3000'
    }),
    // new ReactRefreshWebpackPlugin(),
  ],
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
  }
}

module.exports = merge(webpackCommonConfig, config);
