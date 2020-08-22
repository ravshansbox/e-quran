const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index.js',
  },
  resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/favicon.ico' },
        { from: 'src/images', to: 'images' },
      ],
    }),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  performance: { maxAssetSize: 1024 * 1024, maxEntrypointSize: 256 * 1024 },
  stats: { children: false, modules: false },
  devServer: {
    historyApiFallback: true,
    proxy: { '/api': 'http://localhost:3000' },
    stats: 'minimal',
  },
};
