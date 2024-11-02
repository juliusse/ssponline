const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");
const CopyPlugin = require("copy-webpack-plugin");

const devConfig = {
  mode: "development",
  entry: "./src/index.tsx",
  devServer: {
    port: 8080,

    historyApiFallback: {
      index: "/index.html",
    },
    client: {
      overlay: false,
    },
  },
  devtool: "inline-source-map",
  output: {
    publicPath: "http://localhost:8080/",
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ["style-loader", "css-loader", "resolve-url-loader", "postcss-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
  ],
};

module.exports = merge(commonConfig, devConfig);
