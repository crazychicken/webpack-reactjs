const path = require('path');
const webpack = require('webpack');
var PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AsyncChunkNames = require('webpack-async-chunk-names-plugin');

// Tự viết plugins environment kết hợp với DefaultPlugins của webpack
// Hoặc có thể dùng https://github.com/motdotla/dotenv
const getEnv = require('../plugins/getEnv'),
  env = getEnv('../.env');

// utilities
var { moduleAlias, moduleExtensions, getStyleLoaders } = require('./utilities');

module.exports = Env => {
  // Check môi trường cụ thể khi run với npm script
  const isProduction = Env === 'production';
  const isDevelopment = Env === 'development';
  // console.log('isProduction =' + Env + ' : ' + isProduction);
  // console.log('isDevelopment =' + Env + ' : ' + isDevelopment);
  return {
    // Xác định môi trường chạy webpack bằng npm script
    mode: Env,
    // Value true buộc webpack thoát khỏi quá trình đóng gói khi có lỗi, áp dụng cho isProduction
    bail: isProduction,
    entry: [
      // Sử dụng tiện ích của react-dev-utils hiển thị vị trí lỗi
      // isDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
      path.resolve(__dirname, '../src/index.js')
      // Kiểm tra giữ lại giá trị đúng nhất để đưa vào entry
    ].filter(Boolean),
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: isProduction
        ? 'static/js/[name].[chunkhash:8].js'
        : isDevelopment && 'static/js/bundle.js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isProduction
        ? 'static/js/[name].[chunkhash:8].chunk.js'
        : isDevelopment && 'static/js/[name].chunk.js',
      publicPath: ''
    },
    resolve: {
      alias: moduleAlias,
      // Tắt/Mở phần sử dụng các .js, .jsx .v.v.. resolve.extensions.
      // enforceExtension: false,
      // Tắt/Mở phần sử dụng các lib trong node_modules.
      // enforceModuleExtension: false,
      extensions: moduleExtensions,
      // mainFields: ["browser", "main", "module"],
      // Nói với webpack những thư mục nào sẽ được tìm kiếm khi giải quyết các mô-đun.
      // Với một đường dẫn tuyệt đối, nó sẽ chỉ tìm kiếm trong thư mục đã cho. Khi dùng yarn --pnp xoá luôn node_modules
      // modules: ["node_modules"],
      // Thêm plugin muốn sử dụng khi khởi chạy webpack
      plugins: [PnpWebpackPlugin]
    },
    // Thêm loader muốn sử dụng khi khởi chạy webpack
    resolveLoader: {
      plugins: [
        // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders from the current package.
        // Installs ran using Plug'n'Play are up to 70% faster than regular ones
        // https://github.com/yarnpkg/pnp-sample-app
        PnpWebpackPlugin.moduleLoader(module)
      ]
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              // exclude: /(node_modules)/,
              // use: require.resolve(`babel-loader`)
              use: 'babel-loader'
              // use: {
              //   loader: 'babel-loader',
              //   options: {
              //     // presets: ['es2015']
              //     presets: ['@babel/preset-env'] // just update
              //     presets: [require.resolve(`@babel/preset-env`)]
              //   }
              // }
            },
            {
              test: /\.css/,
              exclude: /\.module\.css/,
              use: getStyleLoaders(
                {
                  importLoaders: 1
                },
                null, // 'css-loader',
                isProduction // true
              ),
              sideEffects: true
            },
            {
              test: /\.module\.css/,
              use: getStyleLoaders(
                {
                  importLoaders: 1,
                  modules: true
                },
                null, // 'css-loader',
                isProduction // true
              )
            },
            {
              test: /\.s(a|c)ss/,
              exclude: /\.module\.s(a|c)ss/,
              use: getStyleLoaders(
                {
                  importLoaders: 2
                },
                'sass-loader',
                isProduction // true
              )
            },
            {
              test: /\.module\.s(a|c)ss/,
              use: getStyleLoaders(
                {
                  importLoaders: 2,
                  modules: true
                },
                'sass-loader',
                isProduction // true
              )
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          // exclude: /(node_modules|fonts)/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                // Lớn hơn thì tự động chuyển định dạng sang src="url" file-loader, còn nhỏ hơn sẽ là base64
                name: '[name][hash].[ext]',
                outputPath: './static/images/' // Mặc định '/' của publicPath
              }
            }
          ]
        },
        {
          // Fonts
          test: /\.(eot|tiff|woff2|woff|ttf|otf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          // exclude: /(node_modules|images)/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name][hash].[ext]',
                outputPath: './static/fonts/' // Vị trí lưu xuất file
                // Nếu không set publicPath thì nó sẽ nhận outputPath làm default
              }
            }
          ]
        }
      ]
    },
    plugins: [
      process.env.envSourceMap
        ? new MiniCssExtractPlugin({
            filename: 'static/css/[name].css',
            chunkFilename: 'static/css/[name].chunk.css'
          })
        : new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
          }),
      new AsyncChunkNames(),
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            file: 'index.html',
            template: path.resolve(__dirname, '../html/index.html')
          },
          isProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true
                }
              }
            : undefined
        )
      ),
      new webpack.DefinePlugin({
        // 'process.env': JSON.stringify({
        //   ENV_POST: '3000'
        // })
        'process.env': env
      })
    ].filter(Boolean),
    // Một số modules nodejs không sử dụng cho trình duyệt, options giúp cho webpack biết được là chúng ta sẽ ẩn nó đi
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    },
    performance: false
  };
};
