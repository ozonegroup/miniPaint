var webpack = require('webpack');
var path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
	entry: [
		'babel-polyfill',
		'./src/js/main.js',
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/dist/'
	},
	resolve: {
		extensions: ['.js', '.css'],
		alias: {
			Utilities: path.resolve(__dirname, './../node_modules/')
		}
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {url: false}
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
				loader: 'babel-loader',
					options: {
					presets: ['env']
					}
				}
			},
		]
	},
	plugins: [
		new Dotenv({
		  path: './.env', // Path to .env file (this is the default)
		  safe: true // load .env.example (defaults to "false" which does not use dotenv-safe)
		}),
		new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
		}),
		new webpack.DefinePlugin({
			VERSION: JSON.stringify(require("./package.json").version)
		}),
		
	],
	devtool: "cheap-module-source-map",
	devServer: {
		contentBase: "./",
		compress: true,
	}
};