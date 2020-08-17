const path = require('path')
const HtmlWebpackPlugin  = require('html-webpack-plugin')
module.exports = {
  entry: './src/main.js',
  mode: 'development',
  devServer: {
    open: true,
    compress: false,
    contentBase: './src'
},
  optimization: {
    minimize: false
  },
  plugins:[new HtmlWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [['@babel/plugin-transform-react-jsx',{
              pragma: 'create'
            }],'@babel/plugin-proposal-class-properties']
          }
        }
      }
    ]
  }
}
