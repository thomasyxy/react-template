const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const proxy = require('http-proxy-middleware');
const path = require('path');
const glob = require('glob');

const files = glob.sync(__dirname + '/src/pages/*/index.js');
let newEntries = {};
const PORT = 7999;

files.forEach(function (file) {
    var name = /.*\/(src\/.*?\/index)\.js/.exec(file)[1]; //得到src/actEnter/这样的文件名
    name = name.split('src/pages/')[1].split('/index')[0];
    newEntries[name] = file;
});

const isUseProxy = true;    //是否需要本地代理
const config = {
    devtool: 'eval-source-map', //开发环境使用;线上环境请禁用
    entry: Object.assign({}, newEntries),
    output: {
        publicPath: '/static',
        path: path.resolve(__dirname, './static'),
        filename: '[name]/app.js'
    },

    devServer: {
        stats: {                    //打包完，会提供一个 stats 对象，这里有每个 chunk 的详细信息
          chunks: false
        },
        contentBase: './',          //本地服务器所加载的页面所在的目录
        inline: false,              //设置为true，当源文件改变时会自动刷新页面
        port: PORT,                 //设置默认监听端口，如果省略，默认为8080
        historyApiFallback: false,  //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        colors: true,               //设置为true，使终端输出的文件为彩色的
        hot: true,                  //是否热部署
        quiet: false,               //让dev server处于静默的状态启动
        host: '0.0.0.0',            //hostname or IP. 0.0.0.0 binds to all hosts.
        proxy: isUseProxy ? {       //是否需要本地代理
            '/run/*': {
                target: 'http://rr.leoao.com',
                changeOrigin: true,
                secure: false
            },
            '/wap/*': {
                target: 'http://d.leoao.com',
                changeOrigin: true,
                secure: false
            }
        } : {}
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
                //loader: 'style!css?modules!postcss'
                loader: 'style!css!postcss'
            },
            {
                test: /\.scss$/,
                //loader: 'style!css?modules!sass!postcss'
                loader: 'style!css!sass!postcss'
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            }
        ]
    },
    externals: {
        //'AMap': 'window.AMap'
    },
    postcss: [
        require('autoprefixer') //调用autoprefixer插件
    ],
    plugins: [
        new webpack.DefinePlugin({
            __ONLINE__: isUseProxy       //是否使用代理(ps: isUseProxy=false, 调用本地mock接口)
        }),
        new OpenBrowserPlugin({url: `http://127.0.0.1:${PORT}/views`}), //打包完成后自动打开浏览器
        new webpack.HotModuleReplacementPlugin(),           //热加载插件
        new webpack.NoErrorsPlugin()                        //允许错误不打断程序
    ]
};

module.exports = config;
