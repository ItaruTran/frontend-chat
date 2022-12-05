const path = require('path');

const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    modules: ['node_modules', './src'],
    extensions: ['.js', '.jsx'],
    alias: {
      "@": path.resolve(__dirname, "src/"),
      "@connector": path.resolve(__dirname, "src/connector/"),
      "@components": path.resolve(__dirname, "src/components/"),
      "@api": path.resolve(__dirname, "src/api/"),
      "@pages": path.resolve(__dirname, "src/pages/"),
      "@config": path.resolve(__dirname, "src/config/"),
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html")
    })
  ],
  optimization: {
    splitChunks: { chunks: "all" }
  },
  devServer: {
    port: 5555,
  }
};
