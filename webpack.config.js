var webpack = require('webpack');
var path = require('path');

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
	devServer: {
		headers: {
		    "Access-Control-Allow-Origin": "*",
		    "Access-Control-Request-Method": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
		    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
		  },
		  allowedHosts: [
		        'studio_data_storage.test',
		        'subdomain.host.com',
		        'subdomain2.host.com',
		        'host2.com'
		      ]
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
		new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
		}),
		new webpack.DefinePlugin({
			VERSION: JSON.stringify(require("./package.json").version)
		}),
	],
	devtool: "cheap-module-source-map"
};