module.exports = {
  entry: {
    app: "./src/index.js"
  },
  output: {
    filename: "../build/app.js"
  },
  // source-mapを出力
  devtool: "#source-map",
  module: {
    // ローダ設定
    loaders: [
      {test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ["es2015"],
        }
      }
    ]
  },
  resolve: {
    // requireやimport時の拡張子を省略
    extensions: ['', '.js']
  },
};
