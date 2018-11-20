const webpack = require('webpack');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const { DefinePlugin } = webpack;
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = (env, argv) => {
  return {
    entry: [
      './src/js/app.js'
    ],
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    },
    module: {
      noParse: /excel-builder/gi,
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: [/node_modules/, /excel-builder/gi, /jszip/gi],
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /jszip/gi,
          loader: "script-loader"
        },
        {
          // HTML LOADER
          // Reference: https://github.com/webpack/raw-loader
          // Allow loading html through js
          test: /\.html$/,
          loader: 'raw-loader'
        },
        {
          // ASSET LOADER
          // Reference: https://github.com/webpack/file-loader
          // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
          // Rename the file using the asset hash
          // Pass along the updated reference to your code
          // You can add here any file extension you want to get copied to your output
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
          loader: 'file-loader',
          exclude: /index\.html$/
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            env !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ],
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
      alias: {
        CSV: 'csv.js',
        '@components': path.resolve(__dirname, 'src', 'components'),
        '@stores': path.resolve(__dirname, 'src', 'stores'),
        '@utils': path.resolve(__dirname, 'src', 'utils'),
        '@routes': path.resolve(__dirname, 'src', 'routes'),
        '@styles': path.resolve(__dirname, 'src', 'styles')
      },
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        alwaysWriteToDisk: true,
        template: `./src/index.html`,
        inject: 'body',
        filename: `index.html`
      }),
      new webpack.ProvidePlugin({
        CSV: 'CSV'
      }),
      new HtmlWebpackHarddiskPlugin(),
      new CleanWebpackPlugin(['dist'], {
        verbose: true,
        dry: false
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new DefinePlugin({
        'process.env': {
          NODE_ENV: env,
          HOST: process.env.HOST ? JSON.stringify(process.env.HOST) : undefined
        },
      }),
      new CopyWebpackPlugin([{
        from: './src/public'
      }])
      /*new PostCompile(() => {

      })*/
      // new BundleAnalyzerPlugin()
    ],
    devServer: {
      historyApiFallback: true,
      contentBase: './dist',
      hot: true
    }
  }
};