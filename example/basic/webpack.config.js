const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.tsx',
  devtool: "inline-source-map",
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@castella/macro": path.join(__dirname, "../../packages/macro"),
      "@castella/runtime": path.join(__dirname, "../../packages/runtime"),
      "react": path.join(__dirname, "node_modules/react"),
      "react-dom": path.join(__dirname, "node_modules/react-dom"),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, use: [
          {
            loader: 'linaria/loader',
            options: {
              sourceMap: process.env.NODE_ENV !== 'production',
            },
          },
          "babel-loader",
        ]
      }, {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV !== 'production',
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: process.env.NODE_ENV !== 'production',
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    })
  ]
}