var PATH = require("path");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var WriteFilePlugin = require('write-file-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    plugins: [
        new ExtractTextPlugin('styles.css'),
        new webpack.optimize.UglifyJsPlugin(
        {
            compress:
            {
                warnings: false
            },
        }),
    ],
    entry: "./src/index.jsx",
    module:
    {
        loaders: [
        {
            test: /\.sass$/,
            loader: ExtractTextPlugin.extract('style', ['css-loader?minimize&zindex', 'postcss', 'sass']),
        },
        {
            test: /\.(jpg|png)$/,
            loader: 'file-loader?name=images/[name].[ext]',
            exclude: /\b(favicon)\b/,
        },
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query:
            {
                presets: ['react', 'es2015']
            }
        }]
    },
    postcss: () =>
    {
        return [require('autoprefixer')];
    },
    output:
    {
        filename: 'bundle.js',
        path: PATH.join(__dirname, './dist')
    },
    devServer:
    {
        contentBase: "./dist",
        historyApiFallback: true
    }
};
