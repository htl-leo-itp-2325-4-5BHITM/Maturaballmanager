const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const baseHref = '/';

module.exports = env => ({
    entry: './src/ts/index.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    devtool: 'cheap-module-source-map', // Source-Map for development
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            Model: path.resolve(__dirname, 'src/model'),
        },
    },
    output: {
        filename: 'bundle-[fullhash].js',
        path: path.resolve(__dirname, 'dist'), // Output directory is 'dist'
        clean: true, // Cleans the 'dist' directory after every build
        publicPath: baseHref,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'), // Path for index.html is the 'src' directory
        }),
        new webpack.EnvironmentPlugin({
            BASE_HREF: baseHref, // 'baseHref' variable from above
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        compress: true,
        port: 4200,
        proxy: {
            '/api': 'http://localhost:8081',
            '/maturaballmanager': 'http://localhost:8081'
        },
        historyApiFallback: true,
    },
});
