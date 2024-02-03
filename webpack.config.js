const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = {
  resolve: {
    fallback: {
      zlib: require.resolve("browserify-zlib"),
      https: require.resolve("https-browserify"),
    },
  },
  output: {
    path: path.join(__dirname, "/dist"), // the bundle output path
    filename: "bundle.js",
    publicPath: "/", // the name of the bundle
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html", // to import index.html file inside index.js
    }),
  ],
  devServer: {
    port: 3000,

    historyApiFallback: true, // you can change the port
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // .js and .jsx files
        exclude: /node_modules/, // excluding the node_modules folder
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/, // styles files
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
        loader: "file-loader",
        options: { limit: false },
      },
    ],
  },
};
