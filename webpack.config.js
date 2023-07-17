const nodeExternals = require("webpack-node-externals");
const CopyPlugin = require("copy-webpack-plugin"); //copy static files
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./app/index.ts",
  target: "node", //webpack node external property
  externals: [nodeExternals()], //webpack node external property
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "package.json", to: '.'},
        { from: "Dockerfile", to:'.' },
        { from: ".env", to: '.' },
      ],
    }),
  ],
};
