/* eslint-disable */
let webpack = require('webpack');
let path = require('path');
let htmlWebpackPluginConfig = require('./html-webapck-config.js')('prod');
let OptimiseCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// let UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let merge = require('webpack-merge');
let baseConfig = require('./webpack.base.js');
const TerserPlugin = require('terser-webpack-plugin');

const env = process.env.PROJECT_ENV || 'QA'; 

console.log('env', env);

let prodConfig = {
	mode: 'production',
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.css$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader'
			]
		}, {
			test: /\.less$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'less-loader'
			]
		}]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new MiniCssExtractPlugin({
			filename: 'css/[name].css',
			chunkFilename: '[id].css',
		}),
		new webpack.DefinePlugin({ // 定义环境变量
			__ENV__: JSON.stringify(env), // qa阶段
		}),
		...htmlWebpackPluginConfig
		// new webpack.BannerPlugin('make by liming ' + new Date());
		// new CopyWebpackPlugin([{
		//   from:'./src/ppt',
		//   to:path.resolve(__dirname,'assets')
		// }]),
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				exclude: /node_modules/,
				cache: true,
				parallel: true,
				sourceMap: true
			}),
			new OptimiseCssAssetsPlugin({})
		]
	}
}
let config = merge(baseConfig, prodConfig);

module.exports = config;
