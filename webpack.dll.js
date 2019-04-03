/* eslint-disable */
/**
 * @file: webpack.dll.js
 * @description:
 *  webpack 的dll 构建配置
 */
const webpack = require('webpack');
const path = require('path');
let config = {
    mode: 'development',
    context: __dirname,
    devtool: 'cheap-module-eval-source-map',
    entry: {
        vendors: ['react',
            'react-dom',
            'react-router-dom',
        ]
    },
    output: {
        path: path.resolve(__dirname, 'vender'),
        filename: 'vendors.js',
        library: 'vendors',
        libraryTarget: 'umd',
    },
    plugins: [
        new webpack.DllPlugin({
            context: __dirname,
            path: path.join(__dirname, 'vender', 'manifest.json'),
            // context: path.resolve(__dirname, 'dist'),
            name: 'vendors'
        })
    ]
};

module.exports = config;
