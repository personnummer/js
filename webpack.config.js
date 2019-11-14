module.exports = {
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader'
      }
    ]
  },
  entry: path.join(__dirname, 'src', 'index.js'),
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
  }
}
