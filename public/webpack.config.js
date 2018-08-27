const path = require('path');

module.exports = {
  entry: './src/core/index.ts',
  //devtool: 'inline-source-map',
  // 如果需要压缩请改动模式
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'fre.js',
    path: path.resolve(__dirname, '../dist')
  }
};