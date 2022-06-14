const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpapckBar = require("webpackbar");

// 代码压缩
const TerserPlugin = require("terser-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const config = {
  // 模式 ： production 生产模式；development：开发模式
  mode: process.env.mode || "development",
  // 入口文件路径
  entry: "./src/index.ts",
  // 出口文件（生成目录）
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/bundle.js",
  },
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new WebpapckBar({
      showCursor: true,
    }),
    new CompressionWebpackPlugin({
      test: /\.(js|css)$/, //匹配要压缩的文件
      algorithm: "gzip",
    }),
    new WindiCSSWebpackPlugin(),
  ],
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, //开启并行压缩，可以加快构建速度
      }),
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".json", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        // exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          //   "style-loader",
          "css-loader",
          //   { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
        ],
      },

      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "url-loader",
        options: {
          // 大于8kb，不生成base64
          limit: 8 * 1024,
          name: "[name]-[hash:3].[ext]",
          esModule: false,
          outputPath: "imgs",
        },
      },
      {
        test: /\.(woff|svg|eot|ttf)\??.*$/,
        loader: "file-loader",
        options: {
          name: "[name]-[hash:3].[ext]",
          outputPath: "font",
        },
      },
      //   {
      //     test: /\.(html)$/,
      //     use: {
      //       loader: "html-loader",
      //     },
      //   },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          "cache-loader",
          {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { targets: "defaults" }]],
            },
          },
        ],
      },
    ],
  },
  devServer: {
    client: { progress: true },
    static: path.resolve(__dirname, "dist"),
    // 压缩
    compress: true,
    // 端口
    port: 80,
    // 自动打开浏览器
    open: true,
  },
};
module.exports = config;
