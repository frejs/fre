const path = require('path')


module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'fre.js',
  },
  resolve: {

    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'stage-1'],
            plugins: [
              'transform-decorators-legacy',
              [
                "transform-react-jsx", {
                  "pragma": "h"
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.ts?$/,
        loader: "ts-loader"
      }
    ]
  }

}