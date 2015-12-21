var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'assets/js/main.jsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist/',
        filename: 'game_bundle.js',
    },
    module: {
        loaders: [
            {test: /\.jsx$/, exclude: /(libs|node_modules)/, loader: 'babel?stage=0'},
            {test: /\.js$/, exclude: /(libs|node_modules)/, loader: 'babel?stage=0'},
            {test: /\.(png|jpg|ttf|woff|svg|eot)$/, loader: 'url-loader?limit=8192'},// inline base64 URLs for <=8k images, direct URLs for the rest
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 versions'
            },
            {
                test: /\.(scss|sass)$/,
                loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 versions!sass?sourceMap'
            }
        ],
    },
    externals: {
        jquery: "jQuery",
        pageResponse: 'pageResponse'
    },
    resolve: {
        alias: {
            libs: path.resolve(__dirname, 'libs'),
            nm: path.resolve(__dirname, "node_modules")
        }
    }
};