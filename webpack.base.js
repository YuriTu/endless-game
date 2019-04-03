/* eslint-disable */
let webpack = require('webpack');
let path = require('path');
// let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({
    size: 4
});
let dllRunner = require('./webpack.dll.js');

let config = {
    entry: {
        main: './src/index.js',
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'happypack/loader?id=js'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(html|htm)$/i,
                use: 'html-withimg-loader'
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // outputPath: '/imgs',
                        publicPath: '../',
                        name: 'imgs/[name].[ext]',
                        limit: 8 * 1024
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.css', '.less'],
        alias: {
            common: path.resolve(__dirname, './src/common')
        }
    },
    plugins: [
        new HappyPack({
            id: 'js',
            verbose: false,
            threadPool: happyThreadPool,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            '@babel/plugin-syntax-dynamic-import',
                            [
                                '@babel/plugin-proposal-decorators',
                                {
                                    legacy: true
                                }
                            ],
                            [
                                '@babel/plugin-proposal-class-properties',
                                {
                                    loose: true
                                }
                            ],
                            [
                                '@babel/plugin-transform-runtime',
                                {
                                    helpers: false,
                                    corejs: 2
                                }
                            ],
                            '@babel/plugin-transform-async-to-generator',
                            'react-hot-loader/babel'
                        ]
                    }
                }
            ]
        })
    ]
};

module.exports = config;
