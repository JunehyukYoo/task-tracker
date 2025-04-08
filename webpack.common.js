// webpack.common.js 
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  resolve: {
    fallback: {
      'util': false,
      'fs': false,
      'child_process': false,
      'worker_threads': false,
      "constants": false,
      "vm": false,
      "path": false,
      "crypto": false,
      "zlib": false,
      "stream": false,
      "assert": false,
      "buffer": false,
      "http": false,
      "url": false,
      "https": false,
      "os": false,
      "querystring": false
    }
  },
 entry: {
   app: './src/index.js',
 },
 plugins: [
   new HtmlWebpackPlugin({
    template: "./src/template.html",
   }),
 ],
 output: {
   filename: "main.js",
   path: path.resolve(__dirname, "dist"),
   clean: true,
 },
 module: {
  rules: [
    {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    },
    {
      test: /\.html$/i,
      loader: "html-loader",
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: "asset/resource",
    },
  ],
 },
};