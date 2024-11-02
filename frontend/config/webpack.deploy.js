const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const deployConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve("css-loader"),
            options: {
              sourceMap: true,
            },
          },
          {
            loader: require.resolve("resolve-url-loader"),
            options: {
              sourceMap: true,
            },
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              sourceMap: true,
            },
          },
          {
            loader: require.resolve("sass-loader"),
            options: {
              warnRuleAsWarning: true,
              sourceMap: true,
              sassOptions: {
                style: "compressed",
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
  ],
};

module.exports = merge(commonConfig, deployConfig);
