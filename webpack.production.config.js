const webpack = require('webpack');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const files = glob.sync(__dirname + '/src/pages/*/index.js');
let newEntries = {};
let plugins = [];
files.forEach(function (file) {
    var name = /.*\/(src\/.*?\/index)\.js/.exec(file)[1]; //得到src/actEnter/这样的文件名
    name = name.split('src/pages/')[1].split('/index')[0];
    newEntries[name] = file;
});

const config = {
    entry: Object.assign({}, newEntries),

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name]/app.[chunkhash].js'
    },

    module: {
        loaders: [
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                //loader: 'style!css?modules!postcss' //如果模块化使用
                //loader: 'style!css!postcss'         //js和css打包成一个js文件(需注释插件ExtractTextPlugin)
                loader: ExtractTextPlugin.extract('style', 'css!postcss') //js和css分开打包
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!sass!postcss') //js和css分开打包
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            }
        ]
    },

    postcss: [
        require('autoprefixer') //调用autoprefixer插件
    ],
    plugins: plugins.concat([
        new webpack.DefinePlugin({
            __ONLINE__: true,
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new CleanWebpackPlugin(['dist'], {
            'root': path.resolve(__dirname),
            verbose: true,
            dry: false
        }),
        new webpack.BannerPlugin('Copyright leke inc.'),    //打包文件抬头
        //new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new webpack.optimize.UglifyJsPlugin({               //压缩JS代码
            output: {
                comments: false                             // remove all comments
            },
            compress: {
                warnings: false                             //不显示warning
            }
        }),
        new ExtractTextPlugin('[name]/app.[chunkhash].css'),           //是否分离CSS和JS文件('[name]-[hash].css')
    ])
};

module.exports = config;
