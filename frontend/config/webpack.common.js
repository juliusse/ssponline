const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { DefinePlugin } = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const envKeys = {};
Object.keys(process.env).forEach((key) => {
  if (key.startsWith("REACT_APP")) {
    envKeys[`process.env.${key}`] = JSON.stringify(process.env[key]);
  }
});
envKeys["process"] = { env: {} };

module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src/"),
    },
    extensions: [".tsx", ".ts", ".js", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./public/index.html",
    }),
    new DefinePlugin(envKeys),
    new ModuleFederationPlugin({
      name: "container",
    }),
    new CopyPlugin({
      patterns: [
        { from: "./public", to: "./assets" },
      ],
    }),
  ],
};
