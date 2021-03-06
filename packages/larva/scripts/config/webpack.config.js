const fs = require( 'fs' );
const path = require( 'path' );

const getConfig = require( '../../index' ).getConfig;

const SRC_DIR = path.resolve( './entries' );
const BUILD_DIR = path.resolve( './build/js' );

const entries = getConfig( 'webpack' ).entries;

const aliases = {
	'@larva-js': path.resolve( './node_modules/@penskemediacorp/larva-js/src' ),
	'@npm': path.resolve( './node_modules/' ),
	... getConfig( 'webpack' ).aliases
};

const eslintConfigFile = fs.existsSync( path.resolve( './.eslintrc' ) ) ? path.resolve( './.eslintrc' ) : getConfig( 'eslint', true ).configFile;

// Tools
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );


//=========================================================
//  Rules
//---------------------------------------------------------
const rules = {

	/**
	 * JS Loaders
	 */
	pre: {
		enforce: 'pre',
		test: /\.js$/,
		exclude: /(node_modules|nobundle|vendor)/,
		use: {
			loader: 'eslint-loader',
			options: {
				configFile: eslintConfigFile
			}
		}
	},
	js: {
		test: /\.js$/,
		include: SRC_DIR,
		exclude: /(node_modules|nobundle|vendor)/,
		loader: 'babel-loader',
		query: {
			presets: [ '@babel/preset-env' ]
		}
	}
};

const plugins = {
	cleanup: new CleanWebpackPlugin()
};

//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = {
	entry: entries,
	output: {
		path: BUILD_DIR,
		filename: '[name].js'
	},
	module: {
		rules: [ rules.js ]
	},
	watch: false,
	watchOptions: {
		ignored: /node_modules/
	},
	resolve: {
		alias: aliases
	},
	optimization: {
		minimize: true
	}
};

module.exports = ( env, argv ) => {

	if ( 'development' === argv.mode ) {
		config.devtool = 'source-map';
		config.module.rules = ( config.module.rules || [] ).concat( [ rules.pre ] );
	}

	if ( 'production' === argv.mode ) {
		console.log( 'Building Prod JS..' );

		config.module.rules = ( config.module.rules || [] ).concat( [ rules.pre ] );
		config.plugins = ( config.plugins || [] ).concat( [ plugins.cleanup ] );
	}

	return config;
};
