/* eslint-disable */
let webpack = require('webpack');
let path = require('path');
let merge = require('webpack-merge');
let baseConfig = require('./webpack.base.js');
let htmlWebpackPluginConfig = require('./html-webapck-config.js')('dev');
const env = process.env.PROJECT_ENV || 'DEV';

let devConfig = {
    mode: 'development',
    devtool: 'inline-source-map',
    watch: true,
    // watchOptions: {
    // 	ignored: /node_modules/,
    // 	aggregateTimeout: 1000, // 停止操作多长时间再次进行编译
    // 	poll: 1000 // 监控遍历时间间隔
    // },
    devServer: { // 在webpack这一层来解决跨域
        // contentBase: __dirname,
        port: 8080,
        allowedHosts: '*',
        hot: true,
        // hotOnly: true,
        // disableHostCheck: true,
        overlay: {
            warnings: false,
            errors: true
        },
        stats: {
            colors: true,
            // cached: true,
            modules: true,
            children: false,
            chunks: false,
            chunkModules: false,
            performance: true
        },
        proxy: { // 涉及两个server 分别代理
            '/api': {
                target: 'https://dev.test.com:8176',
                secure: false,
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({ // 定义环境变量
            __ENV__: JSON.stringify(env), // console.log("dev"),
        }),
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require('./vender/manifest.json')
        // }),
        ...htmlWebpackPluginConfig
    ]
};

let config = merge(baseConfig, devConfig);
module.exports = config;
